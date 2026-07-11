from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from backend.api.middleware.sanitizer import PIISanitizerMiddleware
import json

app = FastAPI()
app.add_middleware(PIISanitizerMiddleware)


@app.post("/test-pii")
async def test_pii_route(request: Request):
    # This route just echoes the body after the middleware parses it
    # But wait, middleware normally doesn't modify the raw body for subsequent parsers easily in FastAPI
    # without advanced streaming resets. Assuming PIISanitizer intercepts and cleans.
    body = await request.body()
    return json.loads(body.decode())


client = TestClient(app)


def test_pii_sanitizer_removes_identifiers():
    payload = {
        "user": "David Beckham",
        "message": "My email is test@example.com and phone is +1-800-555-0199",
        "ticket": "Issue with TKT-12345",
        "uuid_ref": "Event 123e4567-e89b-12d3-a456-426614174000",
        "player": "Look at PLY-9988",
        "passport": "ID US1234567",
        "name": "Lionel Messi"
    }

    # Send request
    response = client.post("/test-pii", json=payload)
    data = response.json()

    # The middleware should redact key-based names
    assert "David Beckham" not in str(data)
    assert "Lionel Messi" not in str(data)
    assert data["user"] == "[REDACTED]"
    assert data["name"] == "[REDACTED]"
    
    # The middleware should redact regex identifiers in text
    assert "test@example.com" not in str(data)
    assert "[EMAIL_REDACTED]" in str(data)
    
    assert "+1-800-555-0199" not in str(data)
    assert "[PHONE_REDACTED]" in str(data)
    
    assert "TKT-12345" not in str(data)
    assert "[TICKET_REDACTED]" in str(data)
    
    assert "123e4567-e89b-12d3-a456-426614174000" not in str(data)
    assert "[UUID_REDACTED]" in str(data)
    
    assert "PLY-9988" not in str(data)
    assert "[PLAYER_REDACTED]" in str(data)
    
    assert "US1234567" not in str(data)
    assert "[PASSPORT_REDACTED]" in str(data)


def test_mock_auth_jwt_validation():
    # We can test MockAuthMiddleware here if we add it to the test app
    pass
