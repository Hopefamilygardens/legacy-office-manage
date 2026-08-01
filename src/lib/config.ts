// Central configuration for backend endpoints.
// All business logic lives in n8n; the frontend only calls these endpoints.
export const API_BASE = 'https://hope2026os.app.n8n.cloud/webhook';

export const ENDPOINTS = {
  brief: API_BASE + '/legacy-os-brief',
  ai: API_BASE + '/legacy-office-manager-ai',
  voice: API_BASE + '/legacy-os-voice-transcribe'
};

// Endpoints for the Universal Knowledge Importer pipeline.
// Each endpoint maps to one stage of the import pipeline; n8n owns the logic.
export const IMPORTER_ENDPOINTS = {
  submit: API_BASE + '/legacy-os-import-submit',
  status: API_BASE + '/legacy-os-import-status',
  approve: API_BASE + '/legacy-os-import-approve',
  commit: API_BASE + '/legacy-os-import-commit'
};
