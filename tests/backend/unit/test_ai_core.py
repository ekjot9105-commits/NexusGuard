"""
Unit tests for the AI Core Interface (backend/ai/core.py).
"""

import pytest
import asyncio
from pydantic import BaseModel
from backend.ai.core import MockGeminiService, get_ai_service, AICoreInterface
from backend.db.schemas import CopilotRecommendation

class DummyModel(BaseModel):
    message: str

@pytest.mark.asyncio
async def test_mock_gemini_service_latency():
    """Test that the mock service simulates network latency."""
    service = MockGeminiService(mock_responses={"hello": {"message": "world"}})
    
    start_time = asyncio.get_event_loop().time()
    response = await service.generate_structured_response("hello", DummyModel)
    end_time = asyncio.get_event_loop().time()
    
    # Check if it slept for at least 1.5 seconds (allowing small epsilon for timer inaccuracy)
    assert end_time - start_time >= 1.49 
    assert response.message == "world"

@pytest.mark.asyncio
async def test_mock_gemini_service_copilot_fallback():
    """Test that the mock service returns a realistic fallback for CopilotRecommendation."""
    service = MockGeminiService()
    
    response = await service.generate_structured_response(
        "Analyze this situation", 
        CopilotRecommendation
    )
    
    assert isinstance(response, CopilotRecommendation)
    assert response.risk_score == 85
    assert response.risk_level == "high"
    assert len(response.recommended_actions) > 0

@pytest.mark.asyncio
async def test_mock_gemini_service_unsupported_model():
    """Test that the mock service raises an error for unknown models without mock data."""
    service = MockGeminiService()
    
    with pytest.raises(ValueError, match="No mock response configured"):
        await service.generate_structured_response("unknown prompt", DummyModel)

def test_get_ai_service_factory():
    """Test the AI service factory function."""
    service = get_ai_service(use_mock=True)
    assert isinstance(service, MockGeminiService)
    assert isinstance(service, AICoreInterface)
    
    with pytest.raises(NotImplementedError):
        get_ai_service(use_mock=False)
