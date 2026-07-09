"""
Core AI Interface for AegisFlow.

This module defines the abstract base classes for interacting with
Generative AI models. It allows seamless swapping between a mock 
implementation (for local development/testing) and the real Gemini API.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import TypeVar, Type, Any, Dict

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

class AICoreInterface(ABC):
    """
    Abstract Base Class defining the contract for AI text generation.
    """
    
    @abstractmethod
    async def generate_structured_response(
        self, 
        prompt: str, 
        response_model: Type[T],
        temperature: float = 0.7,
        **kwargs: Any
    ) -> T:
        """
        Generates a structured response conforming to the provided Pydantic model.
        
        Args:
            prompt: The input text/context for the LLM.
            response_model: The Pydantic model class to validate the output against.
            temperature: Sampling temperature for generation.
            **kwargs: Additional provider-specific parameters.
            
        Returns:
            An instance of the provided response_model.
        """
        pass

class MockGeminiService(AICoreInterface):
    """
    Mock implementation of the Gemini API for development and testing.
    Simulates network latency and returns strictly typed structured data.
    """
    
    def __init__(self, mock_responses: Dict[str, dict] = None):
        """
        Initialize the mock service.
        
        Args:
            mock_responses: Optional dictionary mapping prompt keywords to raw dictionary responses.
                            If provided, allows deterministic testing.
        """
        self.mock_responses = mock_responses or {}
        
    async def generate_structured_response(
        self, 
        prompt: str, 
        response_model: Type[T],
        temperature: float = 0.7,
        **kwargs: Any
    ) -> T:
        """
        Simulates an async call to Gemini SDK and returns a validated Pydantic model.
        """
        # Simulate API latency as required
        await asyncio.sleep(1.5)
        
        # Check if we have a specific mock response mapped to a keyword in the prompt
        for keyword, raw_response in self.mock_responses.items():
            if keyword.lower() in prompt.lower():
                return response_model(**raw_response)
                
        # Fallback realistic defaults based on the requested model type
        if response_model.__name__ == "CopilotRecommendation":
            default_data = {
                "incident_id": "INC-AUTO-999",
                "risk_score": 85,
                "risk_level": "high",
                "confidence": 0.92,
                "reasoning": "High density detected at Gate 4 combined with unexpected metro arrival spike.",
                "evidence": ["Crowd density > 90%", "Metro arrived with 500+ passengers"],
                "root_cause": "Transportation schedule misalignment causing sudden surge.",
                "recommended_actions": [
                    {
                        "action_id": "ACT-001",
                        "description": "Reroute incoming fans to Gate 5 using digital signage.",
                        "priority": "urgent",
                        "expected_impact": "Reduce Gate 4 density by 40% within 10 minutes.",
                        "assigned_role": "Operator"
                    }
                ],
                "volunteer_tasks": [
                    {
                        "task_id": "TSK-001",
                        "location": "Gate 4 Approach",
                        "instructions": "Form a line and direct fans towards Gate 5. Use megaphones."
                    }
                ],
                "multilingual_announcement": {
                    "english": "Attention fans: Gate 4 is currently experiencing high volume. Please proceed to Gate 5 for faster entry.",
                    "spanish": "Atención aficionados: La Puerta 4 tiene un alto volumen. Por favor, diríjase a la Puerta 5 para una entrada más rápida.",
                    "french": "Attention les fans : La porte 4 connaît actuellement une forte affluence. Veuillez vous diriger vers la porte 5."
                },
                "incident_summary": "Gate 4 overcrowding due to metro surge. Rerouting to Gate 5 initiated."
            }
            return response_model(**default_data)

        # Generic fallback if not matched
        raise ValueError(
            f"No mock response configured for {response_model.__name__} in {self.__class__.__name__}."
        )

def get_ai_service(use_mock: bool = True) -> AICoreInterface:
    """Factory to retrieve the appropriate AI service implementation."""
    if use_mock:
        return MockGeminiService()
    raise NotImplementedError("Real Gemini Service not yet implemented.")
