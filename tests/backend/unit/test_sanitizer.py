"""
Unit tests for the PII Sanitizer Middleware.
"""

import pytest
from backend.api.middleware.sanitizer import PIISanitizer

def test_sanitize_email():
    text = "Contact user at john.doe@example.com for info."
    sanitized = PIISanitizer.sanitize_text(text)
    assert "john.doe@example.com" not in sanitized
    assert "[EMAIL_REDACTED]" in sanitized

def test_sanitize_phone():
    text = "Call me at +1-555-123-4567 immediately."
    sanitized = PIISanitizer.sanitize_text(text)
    assert "+1-555-123-4567" not in sanitized
    assert "[PHONE_REDACTED]" in sanitized

def test_sanitize_ticket_id():
    text = "Fan with ticket TKT-98765 is causing a disturbance."
    sanitized = PIISanitizer.sanitize_text(text)
    assert "TKT-98765" not in sanitized
    assert "[TICKET_REDACTED]" in sanitized

def test_sanitize_mock_names():
    text = "John Doe and Jane Smith were seen at Gate 4."
    sanitized = PIISanitizer.sanitize_text(text)
    assert "John Doe" not in sanitized
    assert "Jane Smith" not in sanitized
    assert "[NAME_REDACTED]" in sanitized
    assert sanitized.count("[NAME_REDACTED]") == 2

def test_sanitize_dict_recursive():
    payload = {
        "incident": "Medical emergency",
        "reporter": {
            "name": "Alice",
            "contact": "alice@test.com",
            "phone": "555-999-0000"
        },
        "tags": ["urgent", "TKT-1111"]
    }
    
    sanitized = PIISanitizer.sanitize_dict(payload)
    
    assert sanitized["reporter"]["name"] == "[NAME_REDACTED]"
    assert sanitized["reporter"]["contact"] == "[EMAIL_REDACTED]"
    assert sanitized["reporter"]["phone"] == "[PHONE_REDACTED]"
    assert sanitized["tags"][1] == "[TICKET_REDACTED]"
    assert sanitized["incident"] == "Medical emergency"
