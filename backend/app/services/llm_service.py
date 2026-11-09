from typing import List, Optional
from app.core.config import settings


def available() -> bool:
    return bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip())


def _client():
    from google import genai
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def embed(text: str) -> List[float]:
    if not available():
        # Fallback pseudo-embedding
        return [0.0] * 768
    try:
        r = _client().models.embed_content(model="text-embedding-004", contents=text)
        return list(r.embeddings[0].values)
    except Exception:
        return [0.0] * 768


def generate(prompt: str) -> str:
    if not available():
        return ""
    try:
        response = _client().models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Gemini API connection error: {str(e)}"
