"""
Unit tests for the FastAPI application entry point.
"""

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    """Test the /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "System is healthy"
    assert data["data"]["status"] == "online"

def test_404_handler():
    """Test global 404 HTTP exception handler to ensure standard format."""
    response = client.get("/non-existent-route")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert "Not Found" in data["message"]

def test_method_not_allowed_handler():
    """Test global 405 exception handler."""
    # Attempt a POST on the /health GET endpoint
    response = client.post("/health")
    assert response.status_code == 405
    data = response.json()
    assert data["success"] is False
    assert "Method Not Allowed" in data["message"]
