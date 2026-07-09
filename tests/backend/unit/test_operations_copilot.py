"""
Unit tests for the Operations Copilot Agent.
"""

import pytest
from backend.ai.agents.operations_copilot import OperationsCopilotAgent
from backend.ai.core import MockGeminiService
from backend.db.schemas import SensorTelemetry, IncidentReportInput, CopilotRecommendation

@pytest.mark.asyncio
async def test_analyze_incident_success():
    """Test successful incident analysis generating a valid recommendation."""
    # Arrange
    ai_service = MockGeminiService()
    agent = OperationsCopilotAgent(ai_service=ai_service)
    
    telemetry = [
        SensorTelemetry(
            sensor_id="SEN-01",
            location="Gate 4",
            metric_type="crowd_density",
            value=0.92,
            timestamp="2026-07-09T14:15:00Z"
        )
    ]
    reports = [
        IncidentReportInput(
            location="Gate 4",
            description="Crowd is backing up into the street.",
            reporter_role="Volunteer"
        )
    ]
    
    # Act
    recommendation = await agent.analyze_incident(
        incident_id="INC-TEST-123",
        telemetry_data=telemetry,
        recent_reports=reports
    )
    
    # Assert
    assert isinstance(recommendation, CopilotRecommendation)
    assert recommendation.risk_score == 85
    assert len(recommendation.recommended_actions) > 0

def test_build_context_prompt():
    """Test that the prompt string is constructed correctly."""
    ai_service = MockGeminiService()
    agent = OperationsCopilotAgent(ai_service=ai_service)
    
    telemetry = [
        SensorTelemetry(
            sensor_id="SEN-01",
            location="Zone A",
            metric_type="temperature",
            value=35.5,
            timestamp="2026-07-09T14:00:00Z"
        )
    ]
    reports = []
    
    prompt = agent._build_context_prompt("INC-456", telemetry, reports)
    
    assert "INC-456" in prompt
    assert "Zone A" in prompt
    assert "35.5" in prompt
    assert "No recent manual reports available." in prompt
