import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateJob } from '$lib/importer/server/jobStore';

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as { job_id?: string; decision?: 'approved' | 'rejected'; update_id?: string; notes?: string };
  if (!body.job_id) return json({ ok: false, error: 'Missing job_id.' }, { status: 400 });
  if (body.decision !== 'approved' && body.decision !== 'rejected') {
    return json({ ok: false, error: 'Decision must be approved or rejected.' }, { status: 400 });
  }

  const updated = updateJob(body.job_id, (job) => {
    const now = new Date().toISOString();
    const proposed = job.proposed_updates.map((update) => {
      const shouldUpdate = body.update_id ? update.id === body.update_id : update.reviewer_decision === 'pending';
      if (!shouldUpdate) return update;
      return {
        ...update,
        reviewer_decision: body.decision!,
        reviewer_notes: body.notes,
        reviewed_at: now
      };
    });

    return {
      ...job,
      updated_at: now,
      proposed_updates: proposed
    };
  });

  if (!updated) return json({ ok: false, error: 'Import job not found.' }, { status: 404 });
  return json({ ok: true, job: updated });
};
