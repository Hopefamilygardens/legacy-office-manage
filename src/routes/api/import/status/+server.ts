import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getJob } from '$lib/importer/server/jobStore';

export const GET: RequestHandler = async ({ url }) => {
  const jobId = url.searchParams.get('job_id');
  if (!jobId) return json({ ok: false, error: 'Missing job_id.' }, { status: 400 });

  const job = getJob(jobId);
  if (!job) return json({ ok: false, error: 'Import job not found.' }, { status: 404 });

  return json({ ok: true, job });
};
