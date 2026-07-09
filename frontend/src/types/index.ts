export interface VolunteerTask {
  task: string;
  location: string;
}

export interface Announcement {
  language: string;
  message: string;
}

export interface CopilotRecommendation {
  incident_id: string;
  risk_score: number;
  confidence: number;
  situation_summary: string;
  root_cause: string;
  evidence: string[];
  reasoning: string;
  recommended_actions: string[];
  expected_impact: string;
  estimated_congestion_reduction: string;
  volunteer_tasks: VolunteerTask[];
  announcements: Announcement[];
}
