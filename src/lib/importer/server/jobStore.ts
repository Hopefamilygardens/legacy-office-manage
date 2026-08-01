import type { ImportJob } from '$lib/importer/types';

const jobs = new Map<string, ImportJob>();

export function setJob(job: ImportJob): void {
  jobs.set(job.id, job);
}

export function getJob(jobId: string): ImportJob | undefined {
  return jobs.get(jobId);
}

export function updateJob(jobId: string, updater: (job: ImportJob) => ImportJob): ImportJob | undefined {
  const current = jobs.get(jobId);
  if (!current) return undefined;
  const next = updater(current);
  jobs.set(jobId, next);
  return next;
}
