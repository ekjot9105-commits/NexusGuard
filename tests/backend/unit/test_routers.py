"""
Unit tests for the Copilot API Routes.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.cache import semantic_cache

# We need to ensure the router is included in main.py.
# If not, the test will fail, so this acts as an integration check.

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_cache():
    """Clear cache before each test."""
    semantic_cache.clear()
    yield
    semantic_cache.clear()

def test_analyze_incident_endpoint():
    """Test successful POST to /api/v1/copilot/analyze."""
    payload = {
        "incident_id": "INC-API-123",
        "telemetry": [
            {
                "sensor_id": "SEN-01",
                "location": "Gate 4",
                "metric_type": "crowd_density",
                "value": 0.95,
                "timestamp": "2026-07-09T14:15:00Z"
            }
        ],
        "reports": []
    }
    
    response = client.post("/api/v1/copilot/analyze", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Mitigation plan generated successfully."
    assert "data" in data
    assert data["data"]["risk_score"] == 85  # Based on our mock response
    
    # Check that it got cached
    assert semantic_cache.misses == 1  # First call is a miss
    
    # Second call should be a cache hit
    response2 = client.post("/api/v1/copilot/analyze", json=payload)
    assert response2.status_code == 200
    assert semantic_cache.hits == 1

def test_analyze_incident_validation_error():
    """Test that invalid payload returns 422 securely."""
    # Missing incident_id
    payload = {
        "telemetry": []
    }
    
    response = client.post("/api/v1/copilot/analyze", json=payload)
    
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert "Invalid request payload" in data["message"]
