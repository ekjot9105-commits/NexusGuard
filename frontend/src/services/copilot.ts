import type { CopilotRecommendation } from '../types';


export const fetchRecommendations = async (): Promise<CopilotRecommendation> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const payload = {
    incident_id: "INC-AUTO-999",
    telemetry: [],
    reports: []
  };

  try {
    const response = await fetch(`${apiUrl}/api/v1/copilot/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock_dev_token_123'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('API Error');
    const json = await response.json();
    if (!json.success) throw new Error(json.message);
    
    return json.data as CopilotRecommendation;
  } catch (e) {
    // Graceful fallback for Netlify demo when backend is down
    console.warn("Backend unreachable, falling back to mock Copilot data", e);
    return {
      incident_id: "INC-2026-004",
      risk_score: 85,
      confidence: 94,
      situation_summary: "Severe overcrowding detected at North Gate 2. Density has reached 92% capacity.",
      root_cause: "Simultaneous arrival of 3 metro trains within 5 minutes due to prior delays.",
      evidence: [
        "Sensor N2-CAM-01 reports 92% density.",
        "Metro API indicates 3 arrivals between 14:10 and 14:15.",
        "Ticketing API shows 5,000 un-scanned tickets for this sector."
      ],
      reasoning: "Given the rapid influx and finite scanning throughput, the queue will spill onto the main road within 8 minutes. Diverting traffic to East Plaza (currently at 65% capacity) will distribute the load and prevent a crush hazard.",
      reasoning_chain: [
        "Observed density at Gate N2 reached 92%.",
        "Correlated with recent metro arrivals.",
        "Historical data shows East Plaza is currently underutilized.",
        "Rerouting will distribute the load and resolve the bottleneck."
      ],
      recommended_actions: [
        {
          action_id: "ACT-001",
          description: "Reroute incoming metro foot traffic from N2 to East Plaza via electronic signage.",
          priority: "urgent",
          expected_impact: "Reduce N2 density by 40%.",
          assigned_role: "Operator"
        },
        {
          action_id: "ACT-002",
          description: "Open 4 additional emergency scanning lanes at N2.",
          priority: "high",
          expected_impact: "Increase throughput by 15%.",
          assigned_role: "Staff"
        }
      ],
      alternative_actions: [],
      estimated_crowd_reduction: 40,
      volunteer_tasks: [
        { task: "Form barricade and redirect crowd East", location: "N2 Approach Path" },
        { task: "Prepare extra scanners", location: "N2 Security Check" }
      ],
      multilingual_announcement: [
        { language: "English", message: "Attention fans. North Gate 2 is currently congested. Please proceed to East Plaza for faster entry." },
        { language: "Spanish", message: "Atención aficionados. La Puerta Norte 2 está congestionada. Por favor, diríjase a la Plaza Este para una entrada más rápida." }
      ]
    };
  }
};

export const executeRecommendation = async (_incidentId: string, action: 'approve' | 'reject' | 'modify') => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, action };
};
