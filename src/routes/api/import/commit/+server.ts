import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { commitApprovedUpdates } from '$lib/importer/server/chatgptPipeline';
import { getJob, setJob } from '$lib/importer/server/jobStore';

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as { job_id?: string };
  if (!body.job_id) return json({ ok: false, error: 'Missing job_id.' }, { status: 400 });

  const job = getJob(body.job_id);
  if (!job) return json({ ok: false, error: 'Import job not found.' }, { status: 404 });

  try {
    const committedCount = await commitApprovedUpdates(job);
    if (committedCount === 0) {
      return json({ ok: false, error: 'No approved updates to commit.' }, { status: 400 });
    }

    const updated = {
      ...job,
      stage: 'committed' as const,
      stage_message: `Committed ${committedCount} approved update${committedCount === 1 ? '' : 's'} to review output.`,
      updated_at: new Date().toISOString()
    };
    setJob(updated);

    return json({ ok: true, job: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Commit failed.';
    return json({ ok: false, error: message }, { status: 500 });
  }
};
