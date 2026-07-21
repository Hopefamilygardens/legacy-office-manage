// Shapes returned by the n8n backend. The frontend treats these as read-only.
export interface BriefCount {
  count: number;
  items: unknown[];
}

export interface DailyBrief {
  headlines: unknown[];
  overdue_tasks: BriefCount;
  tasks_due_today: BriefCount;
  pending_approvals: BriefCount;
  leads_requiring_attention: BriefCount;
}

export interface BriefResponse {
  success: boolean;
  generated_at: string;
  daily_brief: DailyBrief;
  communications_summary: BriefCount;
  executive_memory_summary: BriefCount;
  calendar_summary: BriefCount;
  suggested_actions: unknown[];
  office_manager_summary: string;
}

export interface AiResponse {
  ok: boolean;
  answer: string;
  session_id: string;
}

export interface VoiceResponse {
  ok: boolean;
  transcript: string;
  message?: string;
  error_code?: string;
}
