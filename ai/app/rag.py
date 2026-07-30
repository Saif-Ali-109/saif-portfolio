import os

import google.genai as genai
from google.genai import types

from app.config import GEMINI_API_KEY, GEMINI_MODEL, MAX_HISTORY
from app.prompts import SYSTEM_PROMPT, RAG_PROMPT_TEMPLATE
from app.retriever import retrieve_context
from app.models import ChatMessage

AI_TEMPERATURE = float(os.getenv("AI_TEMPERATURE", "0.7"))
AI_MAX_OUTPUT_TOKENS = int(os.getenv("AI_MAX_OUTPUT_TOKENS", "250"))

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


def generate_response(user_message: str, history: list[ChatMessage]) -> str:
    context = retrieve_context(user_message)
    prompt = RAG_PROMPT_TEMPLATE.format(context=context, question=user_message)
    contents = build_contents(history, prompt)

    client = _get_client()
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=AI_TEMPERATURE,
            max_output_tokens=AI_MAX_OUTPUT_TOKENS,
        ),
    )

    if response.text:
        return response.text.strip()

    return "I'm currently unable to process that request. Please try again."
