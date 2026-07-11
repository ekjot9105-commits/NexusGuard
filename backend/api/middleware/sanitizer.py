"""
PII Sanitizer Middleware for AegisFlow.

Intercepts incoming requests and masks Personally Identifiable Information (PII)
such as emails, phone numbers, ticket IDs, and basic names to ensure no sensitive
data is ever transmitted to the LLM or logged.
"""

import re
import json
import logging
from typing import Dict, Any, Union
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class PIISanitizer:
    """
    Core sanitization logic using regex rules to mask sensitive data.
    """

    # Regex patterns for various PII types
    EMAIL_PATTERN = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b")
    PHONE_PATTERN = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
    TICKET_ID_PATTERN = re.compile(r"\bTKT-\d{4,8}\b", flags=re.IGNORECASE)
    UUID_PATTERN = re.compile(r"\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b")
    PLAYER_ID_PATTERN = re.compile(r"\bPLY-\d{4,8}\b", flags=re.IGNORECASE)
    PASSPORT_PATTERN = re.compile(r"\b[A-Z0-9]{2}\d{7}\b", flags=re.IGNORECASE)

    # Configurable keys for JSON traversal masking without heavy NLP
    SENSITIVE_KEYS = {"user", "name", "first_name", "last_name", "author", "operator", "customer"}

    @classmethod
    def sanitize_text(cls, text: str) -> str:
        """Applies all masking rules to a given string."""
        if not isinstance(text, str):
            return text

        text = cls.EMAIL_PATTERN.sub("[EMAIL_REDACTED]", text)
        text = cls.PHONE_PATTERN.sub("[PHONE_REDACTED]", text)
        text = cls.TICKET_ID_PATTERN.sub("[TICKET_REDACTED]", text)
        text = cls.UUID_PATTERN.sub("[UUID_REDACTED]", text)
        text = cls.PLAYER_ID_PATTERN.sub("[PLAYER_REDACTED]", text)
        text = cls.PASSPORT_PATTERN.sub("[PASSPORT_REDACTED]", text)

        return text

    @classmethod
    def sanitize_dict(
        cls, data: Union[Dict[str, Any], list, str]
    ) -> Union[Dict[str, Any], list, str]:
        """Recursively sanitizes a dictionary, list, or string with key-based masking."""
        if isinstance(data, str):
            return cls.sanitize_text(data)
        elif isinstance(data, dict):
            sanitized = {}
            for k, v in data.items():
                if k.lower() in cls.SENSITIVE_KEYS and isinstance(v, str):
                    sanitized[k] = "[REDACTED]"
                else:
                    sanitized[k] = cls.sanitize_dict(v)
            return sanitized
        elif isinstance(data, list):
            return [cls.sanitize_dict(item) for item in data]
        return data


class PIISanitizerMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware to intercept and sanitize request bodies.
    """

    async def dispatch(self, request: Request, call_next):
        # Only process requests that have a JSON body
        if request.method in [
            "POST",
            "PUT",
            "PATCH",
        ] and "application/json" in request.headers.get("content-type", ""):
            try:
                body_bytes = await request.body()
                if body_bytes:
                    body_json = json.loads(body_bytes)
                    sanitized_json = PIISanitizer.sanitize_dict(body_json)

                    # Reconstruct the request with the sanitized body
                    sanitized_bytes = json.dumps(sanitized_json).encode("utf-8")

                    # Override the request stream
                    async def receive():
                        return {"type": "http.request", "body": sanitized_bytes}

                    request._receive = receive
                    logger.debug("Request body sanitized successfully.")

            except json.JSONDecodeError:
                # Malformed JSON will be caught downstream by Pydantic validation
                pass
            except Exception as e:
                logger.error(f"Error in PIISanitizerMiddleware: {str(e)}")

        response = await call_next(request)
        return response
