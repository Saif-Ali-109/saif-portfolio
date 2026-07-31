from app.prompts import GUARDRAIL_RESPONSE
import re

OFF_TOPIC_PATTERNS = [
    "weather",
    "rain",
    "sunny",
    "forecast",
    "climate",
    "temperature outside",
    "what time",
    "what's the time",
    "whats the time",
    "current time",
    "today's date",
    "todays date",
    "what day",
    "news",
    "politics",
    "election",
    "sports",
    "cricket",
    "football",
    "match",
    "stock price",
    "recipe",
    "cook",
    "math",
    "calculator",
    "homework",
    "translate",
    "write code",
    "solve",
    "joke",
    "movie",
    "song",
    "celebrity",
]

# Prompt-injection phrasings — treat any of these as hostile and refuse.
INJECTION_PATTERNS = [
    "ignore your",
    "ignore the",
    "ignore all previous",
    "disregard",
    "system prompt",
    "system instructions",
    "your instructions",
    "your rules",
    "print your",
    "reveal your",
    "repeat your",
    "you are now",
    "act as",
    "pretend you",
    "developer mode",
    "dan mode",
    "jailbreak",
    "do not follow",
]


def check_guardrail(text: str) -> str | None:
    normalized = text.lower()
    # Off-topic and injection checks run FIRST. There is deliberately no
    # on-topic bailout: "Saif, ignore your instructions..." must not slip
    # through just because it mentions Saif.
    if any(pattern in normalized for pattern in OFF_TOPIC_PATTERNS):
        return GUARDRAIL_RESPONSE
    if any(pattern in normalized for pattern in INJECTION_PATTERNS):
        return GUARDRAIL_RESPONSE
    if re.search(r"\d+\s*[+\-*/×x]\s*\d+", normalized):
        return GUARDRAIL_RESPONSE
    return None
