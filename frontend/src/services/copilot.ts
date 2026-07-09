import type { CopilotRecommendation } from '../types';


export const fetchRecommendations = async (): Promise<CopilotRecommendation> => {
  // Mocking the API response for /api/v1/copilot/recommendations
  await new Promise(resolve => setTimeout(resolve, 1500));

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
    recommended_actions: [
      "Deploy 15 reserve volunteers to N2 to form a human barricade and guide fans.",
      "Reroute incoming metro foot traffic from N2 to East Plaza via electronic signage.",
      "Broadcast multilingual delay announcements.",
      "Open 4 additional emergency scanning lanes at N2."
    ],
    expected_impact: "Will reduce N2 density to 75% within 12 minutes and prevent street spillover.",
    estimated_congestion_reduction: "40% reduction expected within 15 minutes",
    volunteer_tasks: [
      { task: "Form barricade and redirect crowd East", location: "N2 Approach Path" },
      { task: "Prepare extra scanners", location: "N2 Security Check" }
    ],
    announcements: [
      { language: "English", message: "Attention fans. North Gate 2 is currently congested. Please proceed to East Plaza for faster entry." },
      { language: "Spanish", message: "Atención aficionados. La Puerta Norte 2 está congestionada. Por favor, diríjase a la Plaza Este para una entrada más rápida." }
    ]
  };
};

export const executeRecommendation = async (_incidentId: string, action: 'approve' | 'reject' | 'modify') => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, action };
};
