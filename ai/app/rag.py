import os
import time

import google.genai as genai
from google.genai import types

from app.config import GEMINI_API_KEY, GEMINI_MODEL, FALLBACK_MODELS, MAX_HISTORY
from app.guardrails import check_guardrail
from app.prompts import SYSTEM_PROMPT, RAG_PROMPT_TEMPLATE
from app.retriever import retrieve_context
from app.models import ChatMessage

AI_TEMPERATURE = float(os.getenv("AI_TEMPERATURE", "0.7"))
AI_MAX_OUTPUT_TOKENS = int(os.getenv("AI_MAX_OUTPUT_TOKENS", "600"))
MAX_RETRIES = 2

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def build_contents(history: list[ChatMessage], prompt: str) -> list[types.Content]:
    contents = []
    for msg in history[-MAX_HISTORY:]:
        role = "model" if msg.role == "assistant" else "user"
        contents.append(types.Content(role=role, parts=[types.Part(text=msg.content)]))
    contents.append(types.Content(role="user", parts=[types.Part(text=prompt)]))
    return contents


def _try_model(client, model: str, contents, config):
    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model=model, contents=contents, config=config
            )
            if response.text:
                return response.text.strip()
            return "I'm currently unable to process that request. Please try again."
        except Exception as e:
            # 503 (overloaded) and 429 (quota/RPM) are retryable and should
            # fall through to the next model after retries are exhausted.
            if any(code in str(e) for code in ("503", "UNAVAILABLE", "429", "RESOURCE_EXHAUSTED")):
                if attempt < MAX_RETRIES - 1:
                    time.sleep(1)
                continue
            raise
    return None


def generate_response(user_message: str, history: list[ChatMessage]) -> str:
    blocked = check_guardrail(user_message)
    if blocked:
        return blocked

    # A prior turn may also carry an injection attempt — refuse if so.
    for msg in history[-MAX_HISTORY:]:
        if msg.role == "user":
            blocked = check_guardrail(msg.content)
            if blocked:
                return blocked

    context = retrieve_context(user_message)
    prompt = RAG_PROMPT_TEMPLATE.format(context=context, question=user_message)
    contents = build_contents(history, prompt)

    client = _get_client()
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        temperature=AI_TEMPERATURE,
        max_output_tokens=AI_MAX_OUTPUT_TOKENS,
    )

    models = [GEMINI_MODEL] + [m for m in FALLBACK_MODELS if m]
    for model in models:
        result = _try_model(client, model, contents, config)
        if result is not None:
            return result

    raise Exception(f"All models unavailable: {', '.join(models)}")
