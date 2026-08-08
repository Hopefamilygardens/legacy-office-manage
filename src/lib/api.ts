import { ENDPOINTS } from './config';
import type { BriefResponse, AiResponse, ScheduleResponse } from './types';

// Fetch the daily brief assembled by the n8n Daily Brief API.
export async function fetchBrief(view = 'command'): Promise<BriefResponse> {
  const url = ENDPOINTS.brief + '?view=' + encodeURIComponent(view);
  const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error('Brief request failed: ' + res.status);
  }
  return (await res.json()) as BriefResponse;
}
// Fetch the live Schedule view from the read-only n8n Schedule API.
export async function fetchSchedule(): Promise<ScheduleResponse> {
  const res = await fetch(ENDPOINTS.schedule, {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });

  if (!res.ok) {
    throw new Error('Schedule request failed: ' + res.status);
  }

  return (await res.json()) as ScheduleResponse;
}
// Ask the Office Manager AI. The backend decides context and authorization.
export async function askOfficeManager(
  message: string,
  opts: { view?: string; id?: string; type?: string; session_id?: string } = {}
): Promise<AiResponse> {
  const payload = {
    message: message,
    view: opts.view || 'command',
    id: opts.id || '',
    type: opts.type || '',
    session_id: opts.session_id || 'web-ui'
  };
  const res = await fetch(ENDPOINTS.ai, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('AI request failed: ' + res.status);
  }
  return (await res.json()) as AiResponse;
}
