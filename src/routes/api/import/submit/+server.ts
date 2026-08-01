import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { PreparedImport } from '$lib/importer/types';
import { createChatGptJob } from '$lib/importer/server/chatgptPipeline';
import { setJob } from '$lib/importer/server/jobStore';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const prepared = (await request.json()) as PreparedImport;
    if (prepared.source_type !== 'chatgpt-export') {
      return json({ ok: false, error: 'Only ChatGPT export imports are implemented locally at this time.' }, { status: 400 });
    }

    const job = await createChatGptJob(prepared);
    setJob(job);
    return json({ ok: true, job });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Import submission failed.';
    return json({ ok: false, error: message }, { status: 400 });
  }
};
