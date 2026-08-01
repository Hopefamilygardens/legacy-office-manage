import { IMPORTER_ENDPOINTS } from '$lib/config';
import type {
  PreparedImport,
  ImportSubmitResponse,
  ImportStatusResponse,
  ImportDecisionResponse
} from './types';

// Submit a new import job to the n8n pipeline.
// The n8n workflow receives the PreparedImport and begins the
// Parse → Classify → Extract → Compare → Deduplicate → Propose stages.
export async function submitImport(prepared: PreparedImport): Promise<ImportSubmitResponse> {
  const res = await fetch(IMPORTER_ENDPOINTS.submit, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(prepared)
  });
  if (!res.ok) throw new Error('Import submit failed: ' + res.status);
  return (await res.json()) as ImportSubmitResponse;
}

// Poll the current state of an import job.
// Returns the job including any proposed Brain updates that have been generated.
export async function getJobStatus(jobId: string): Promise<ImportStatusResponse> {
  const url = IMPORTER_ENDPOINTS.status + '?job_id=' + encodeURIComponent(jobId);
  const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Import status failed: ' + res.status);
  return (await res.json()) as ImportStatusResponse;
}

// Record a human decision (approve or reject) on one or all proposed updates.
// If updateId is omitted, the decision is applied to all pending updates in the job.
export async function decideUpdate(
  jobId: string,
  decision: 'approved' | 'rejected',
  updateId?: string,
  notes?: string
): Promise<ImportDecisionResponse> {
  const payload: Record<string, string> = { job_id: jobId, decision };
  if (updateId) payload.update_id = updateId;
  if (notes) payload.notes = notes;

  const res = await fetch(IMPORTER_ENDPOINTS.approve, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Import decision failed: ' + res.status);
  return (await res.json()) as ImportDecisionResponse;
}

// Commit all approved updates to the Brain.
// Rule: only approved updates are written. Rejected items are discarded.
// This is the final step; the job moves to 'committed' stage on success.
export async function commitApproved(jobId: string): Promise<ImportDecisionResponse> {
  const res = await fetch(IMPORTER_ENDPOINTS.commit, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ job_id: jobId })
  });
  if (!res.ok) throw new Error('Import commit failed: ' + res.status);
  return (await res.json()) as ImportDecisionResponse;
}
