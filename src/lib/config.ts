// Central configuration for backend endpoints.
// All business logic lives in n8n; the frontend only calls these endpoints.
export const API_BASE = 'https://hope2026os.app.n8n.cloud/webhook';

export const ENDPOINTS = {
  brief: API_BASE + '/legacy-os-brief',
  ai: API_BASE + '/legacy-office-manager-ai',
  schedule: API_BASE + '/legacy-os-schedule',
  voice: API_BASE + '/legacy-os-voice-transcribe'
};
