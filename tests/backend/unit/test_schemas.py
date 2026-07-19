"""
Unit tests for backend schemas (backend/db/schemas.py).
"""

import pytest
from pydantic import ValidationError
from backend.db.schemas import (
    RiskLevel,
    ActionPriority,
    APIResponse,
    ActionRecommendation,
    CopilotRecommendation,
    SensorTelemetry
)

def test_api_response_valid():
    """Test standard API response with valid data."""
    response = APIResponse(
        success=True,
        message="Test successful",
        data={"user": "admin"}
    )
    assert response.success is True
    assert response.message == "Test successful"
    assert response.data == {"user": "admin"}
    assert response.metadata == {}

def test_api_response_missing_fields():
    """Test API response missing required fields."""
    with pytest.raises(ValidationError):
        APIResponse(success=True)

def test_copilot_recommendation_valid():
    """Test validation of a complete CopilotRecommendation."""
    action = ActionRecommendation(
        action_id="ACT-123",
        description="Reroute fans",
        priority=ActionPriority.URGENT,
        expected_impact="Reduce congestion",
        assigned_role="Operator"
    )
    
    rec = CopilotRecommendation(
        incident_id="INC-456",
        risk_score=85,
        risk_level=RiskLevel.HIGH,
        confidence=0.92,
        reasoning="Sensors indicate overcrowding",
        reasoning_chain=["Step 1", "Step 2"],
        evidence=["Density 90% at Gate 4"],
        root_cause="Train arrival spike",
        situation_summary="Crowd spike",
        estimated_crowd_reduction=20,
        recommended_actions=[action],
        alternative_actions=[],
        volunteer_tasks=[],
        transit_recommendations=["Delay metro"],
        accessibility_support=["Wheelchairs"],
        sustainability_impact="Reduced HVAC",
        multilingual_announcement={
            "english": "Please use Gate 5.",
            "spanish": "Por favor, use la Puerta 5.",
            "french": "Veuillez utiliser la porte 5.",
            "arabic": "يرجى استخدام البوابة 5.",
            "portuguese": "Por favor, use o Portão 5."
        },
        incident_summary="Overcrowding at Gate 4 due to train arrivals."
    )
    assert rec.risk_score == 85
    assert len(rec.recommended_actions) == 1

def test_copilot_recommendation_invalid_risk_score():
    """Test that risk score must be within bounds (1-100)."""
    with pytest.raises(ValidationError):
        CopilotRecommendation(
            incident_id="INC-456",
            risk_score=150,  # Invalid: max is 100
            risk_level=RiskLevel.HIGH,
            confidence=0.9,
            reasoning="Test",
            reasoning_chain=[],
            evidence=["Test"],
            root_cause="Test",
            situation_summary="",
            estimated_crowd_reduction=0,
            recommended_actions=[],
            volunteer_tasks=[],
            sustainability_impact="",
            multilingual_announcement={"english": "e", "spanish": "s", "french": "f", "arabic": "a", "portuguese": "p"},
            incident_summary="Summary"
        )

def test_copilot_recommendation_invalid_confidence():
    """Test that confidence must be between 0.0 and 1.0."""
    with pytest.raises(ValidationError):
        CopilotRecommendation(
            incident_id="INC-456",
            risk_score=85,
            risk_level=RiskLevel.HIGH,
            confidence=1.5,  # Invalid: max is 1.0
            reasoning="Test",
            reasoning_chain=[],
            evidence=["Test"],
            root_cause="Test",
            situation_summary="",
            estimated_crowd_reduction=0,
            recommended_actions=[],
            volunteer_tasks=[],
            sustainability_impact="",
            multilingual_announcement={"english": "e", "spanish": "s", "french": "f", "arabic": "a", "portuguese": "p"},
            incident_summary="Summary"
        )

def test_sensor_telemetry_valid():
    """Test SensorTelemetry schema."""
    telemetry = SensorTelemetry(
        sensor_id="SEN-01",
        location="Gate 4",
        metric_type="crowd_density",
        value=0.88,
        timestamp="2026-07-09T14:15:00Z"
    )
    assert telemetry.sensor_id == "SEN-01"
    assert telemetry.value == 0.88
