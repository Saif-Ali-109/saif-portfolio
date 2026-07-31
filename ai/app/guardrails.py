from app.prompts import GUARDRAIL_RESPONSE
import re

ON_TOPIC_PATTERNS = [
    "saif",
    "skills",
    "skill",
    "project",
    "education",
    "experience",
    "contact",
    "hire",
    "hiring",
    "email",
    "whatsapp",
    "github",
    "linkedin",
    "resume",
    "cv",
    "portfolio",
    "web3",
    "blockchain",
    " ai",
    " ai.",
    "freelance",
    "internship",
    "job",
    "degree",
    "university",
    "certification",
    "award",
    "technology",
    "tech stack",
    "developer",
    "software",
]

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


def check_guardrail(text: str) -> str | None:
    normalized = text.lower()
    if any(pattern in normalized for pattern in ON_TOPIC_PATTERNS):
        return None
    if any(pattern in normalized for pattern in OFF_TOPIC_PATTERNS):
        return GUARDRAIL_RESPONSE
    if re.search(r"\d+\s*[+\-*/×x]\s*\d+", normalized):
        return GUARDRAIL_RESPONSE
    return None
