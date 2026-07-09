"""
Unit tests for the Semantic Cache Service.
"""

import pytest
import asyncio
import time
from backend.services.cache import semantic_cache

@pytest.fixture(autouse=True)
def reset_cache():
    """Ensure cache is clear before every test."""
    semantic_cache.clear()
    yield
    semantic_cache.clear()

@pytest.mark.asyncio
async def test_cache_set_and_get():
    """Test basic setting and getting of cache values."""
    prompt = "Analyze Gate 4"
    data = {"risk_score": 85}
    
    # Initially should be a miss
    result = await semantic_cache.get(prompt)
    assert result is None
    assert semantic_cache.misses == 1
    
    # Set the cache
    await semantic_cache.set(prompt, data)
    
    # Now should be a hit
    result = await semantic_cache.get(prompt)
    assert result == data
    assert semantic_cache.hits == 1

@pytest.mark.asyncio
async def test_cache_expiration():
    """Test that items expire after their TTL."""
    prompt = "Short lived data"
    data = {"status": "ok"}
    
    # Set with a 1-second TTL
    await semantic_cache.set(prompt, data, ttl_seconds=1)
    
    # Immediately accessible
    assert await semantic_cache.get(prompt) == data
    
    # Wait for expiration
    time.sleep(1.1)
    
    # Should now be a miss
    assert await semantic_cache.get(prompt) is None
    assert semantic_cache.misses == 1

def test_cache_metrics():
    """Test that metrics are calculated correctly."""
    asyncio.run(semantic_cache.set("P1", "D1"))
    
    asyncio.run(semantic_cache.get("P1")) # hit
    asyncio.run(semantic_cache.get("P1")) # hit
    asyncio.run(semantic_cache.get("P2")) # miss
    
    metrics = semantic_cache.get_metrics()
    assert metrics["hits"] == 2
    assert metrics["misses"] == 1
    assert metrics["total_items"] == 1
    assert metrics["hit_rate_percent"] == 66.67
