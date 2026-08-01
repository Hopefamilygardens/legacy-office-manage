<script lang="ts">
  import { ImportEngine, connectorRegistry, FUTURE_CONNECTORS } from '$lib/importer';
  import type { ImportConnector, ImportJob, SourceType } from '$lib/importer';
  import ImportConnectorCard from '$lib/components/ImportConnectorCard.svelte';
  import ImportPipelineStatus from '$lib/components/ImportPipelineStatus.svelte';
  import ImportApprovalCard from '$lib/components/ImportApprovalCard.svelte';

  const engine = new ImportEngine(connectorRegistry);
  const connectors = connectorRegistry.getAll();

  // ─── State ────────────────────────────────────────────────────────────────

  let selectedConnector: ImportConnector | null = null;
  let selectedFile: File | null = null;
  let pastedText = '';
  let job: ImportJob | null = null;
  let submitting = false;
  let submitError = '';
  let polling = false;
  let pollError = '';
  let commitError = '';
  let commitDone = false;
  let pollingInterval: ReturnType<typeof setInterval> | null = null;

  // ─── Derived ──────────────────────────────────────────────────────────────

  $: pendingCount = job
    ? job.proposed_updates.filter((u) => u.reviewer_decision === 'pending').length
    : 0;
  $: approvedCount = job
    ? job.proposed_updates.filter((u) => u.reviewer_decision === 'approved').length
    : 0;
  $: canCommit = job && approvedCount > 0 && job.stage === 'pending-approval';
  $: awaitingApproval = job?.stage === 'pending-approval';
  $: pipelineActive =
    job &&
    job.stage !== 'pending-approval' &&
    job.stage !== 'committed' &&
    job.stage !== 'error';

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function selectConnector(c: ImportConnector) {
    selectedConnector = c;
    selectedFile = null;
    pastedText = '';
    job = null;
    submitError = '';
    commitError = '';
    commitDone = false;
    stopPolling();
  }

  function onFileChange(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    selectedFile = input.files?.[0] ?? null;
  }

  async function handleSubmit() {
    if (!selectedConnector) return;
    submitting = true;
    submitError = '';
    job = null;
    commitDone = false;

    try {
      const input =
        selectedConnector.accepts_text && !selectedFile && pastedText
          ? { text: pastedText }
          : { file: selectedFile ?? undefined };

      job = await engine.submitImport(selectedConnector.source_type as SourceType, input);
      startPolling();
    } catch (e) {
      submitError = e instanceof Error ? e.message : 'Submission failed.';
    } finally {
      submitting = false;
    }
  }

  function startPolling() {
    if (pollingInterval) return;
    polling = true;
    pollingInterval = setInterval(pollStatus, 3000);
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    polling = false;
  }

  async function pollStatus() {
    if (!job) { stopPolling(); return; }
    if (job.stage === 'pending-approval' || job.stage === 'committed' || job.stage === 'error') {
      stopPolling();
      return;
    }
    try {
      job = await engine.getJobStatus(job.id);
      pollError = '';
    } catch (e) {
      pollError = e instanceof Error ? e.message : 'Status check failed.';
    }
  }

  async function handleApprove(e: CustomEvent<{ updateId: string }>) {
    if (!job) return;
    try {
      job = await engine.approveUpdate(job.id, e.detail.updateId);
    } catch (_) { /* update will remain pending; user can retry */ }
  }

  async function handleReject(e: CustomEvent<{ updateId: string }>) {
    if (!job) return;
    try {
      job = await engine.rejectUpdate(job.id, e.detail.updateId);
    } catch (_) { /* update will remain pending; user can retry */ }
  }

  async function handleApproveAll() {
    if (!job) return;
    try {
      job = await engine.approveAllPending(job.id);
    } catch (e) {
      commitError = e instanceof Error ? e.message : 'Approve all failed.';
    }
  }

  async function handleCommit() {
    if (!job) return;
    commitError = '';
    try {
      job = await engine.commitApproved(job.id);
      commitDone = true;
    } catch (e) {
      commitError = e instanceof Error ? e.message : 'Commit failed.';
    }
  }

  function reset() {
    selectedConnector = null;
    selectedFile = null;
    pastedText = '';
    job = null;
    submitError = '';
    commitError = '';
    commitDone = false;
    stopPolling();
  }
</script>

<svelte:head>
  <title>Knowledge Import — Legacy Office Manager</title>
</svelte:head>

<div class="page">
  <div class="viewhead">
    <a class="backlink" href="/">&larr; Back to Command Center</a>
    <h2 class="vtitle serif">Knowledge Import</h2>
    <p class="subtitle">Import organizational knowledge from any source into the Legacy Brain. Every import requires your approval before anything is written.</p>
  </div>

  <!-- ── Source Selector ── -->
  {#if !job}
    <section class="card">
      <h3 class="section-title">1. Select Source Type</h3>
      <div class="connector-grid">
        {#each connectors as c}
          <ImportConnectorCard
            connector={c}
            selected={selectedConnector?.source_type === c.source_type}
            onSelect={selectConnector}
          />
        {/each}
        {#each FUTURE_CONNECTORS as fc}
          <div class="future-card">
            <div class="icon">{fc.icon}</div>
            <div class="label">{fc.display_name}</div>
            <div class="desc">{fc.description}</div>
            <div class="badge">Coming Soon</div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- ── Input Panel ── -->
  {#if selectedConnector && !job}
    <section class="card">
      <h3 class="section-title">2. Provide Content — {selectedConnector.display_name}</h3>
      <p class="hint">{selectedConnector.description}</p>

      {#if selectedConnector.accepts_file}
        <label class="upload-zone" class:has-file={!!selectedFile}>
          <input
            type="file"
            accept={selectedConnector.file_extensions.join(',')}
            on:change={onFileChange}
            class="file-input"
          />
          {#if selectedFile}
            <div class="file-name">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 3h7l4 4v11H5V3z"/><path d="M12 3v4h4"/></svg>
              {selectedFile.name}
              <span class="file-size">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          {:else}
            <div class="upload-prompt">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 16V8M9 11l3-3 3 3"/><path d="M20 16.7A5 5 0 0017 7h-.5A7.5 7.5 0 104 14.5"/></svg>
              <div>
                <strong>Choose file</strong> or drag and drop<br />
                <span class="ext-hint">{selectedConnector.file_extensions.join(', ')}</span>
              </div>
            </div>
          {/if}
        </label>
      {/if}

      {#if selectedConnector.accepts_text}
        <div class="or-divider">{selectedConnector.accepts_file ? 'or paste text' : 'Paste content'}</div>
        <textarea
          class="text-input"
          placeholder="Paste content here…"
          bind:value={pastedText}
          rows="6"
        ></textarea>
      {/if}

      {#if submitError}
        <div class="error-notice">{submitError}</div>
      {/if}

      <div class="btn-row">
        <button class="btn-secondary" on:click={reset}>← Change Source</button>
        <button
          class="btn-primary"
          disabled={submitting || (!selectedFile && !pastedText)}
          on:click={handleSubmit}
        >
          {submitting ? 'Submitting…' : 'Start Import →'}
        </button>
      </div>
    </section>
  {/if}

  <!-- ── Pipeline + Approval ── -->
  {#if job}
    <section class="card">
      <div class="job-head">
        <div>
          <h3 class="section-title" style="margin-bottom:4px">Import Pipeline</h3>
          <div class="job-meta">
            <span>Job ID: <code>{job.id}</code></span>
            <span>Source: {job.source_file_name}</span>
          </div>
        </div>
        <button class="btn-ghost" on:click={reset}>New Import</button>
      </div>

      <ImportPipelineStatus stage={job.stage} />

      {#if job.stage_message}
        <div class="stage-msg">{job.stage_message}</div>
      {/if}

      {#if job.error}
        <div class="error-notice">{job.error}</div>
      {/if}

      {#if pipelineActive}
        <div class="processing">
          <div class="spinner"></div>
          Processing — the pipeline is running in n8n…
        </div>
      {/if}
    </section>

    <!-- ── Proposed Updates ── -->
    {#if awaitingApproval && job.proposed_updates.length > 0}
      <section class="card">
        <div class="approval-head">
          <div>
            <h3 class="section-title" style="margin-bottom:4px">3. Review Proposed Brain Updates</h3>
            <p class="hint">
              {job.proposed_updates.length} update{job.proposed_updates.length !== 1 ? 's' : ''} proposed
              &nbsp;·&nbsp; {pendingCount} pending
              &nbsp;·&nbsp; {approvedCount} approved
            </p>
          </div>
          <div class="approval-actions">
            {#if pendingCount > 0}
              <button class="btn-secondary" on:click={handleApproveAll}>Approve All ({pendingCount})</button>
            {/if}
          </div>
        </div>

        <div class="updates-list">
          {#each job.proposed_updates as update (update.id)}
            <ImportApprovalCard
              {update}
              on:approve={handleApprove}
              on:reject={handleReject}
            />
          {/each}
        </div>

        {#if commitError}
          <div class="error-notice">{commitError}</div>
        {/if}

        <div class="commit-row">
          <div class="commit-hint">
            {#if approvedCount === 0}
              Approve at least one update before committing.
            {:else}
              {approvedCount} update{approvedCount !== 1 ? 's' : ''} ready to commit to the Brain.
            {/if}
          </div>
          <button
            class="btn-commit"
            disabled={!canCommit}
            on:click={handleCommit}
          >
            Commit {approvedCount} Update{approvedCount !== 1 ? 's' : ''} to Brain →
          </button>
        </div>
      </section>
    {:else if awaitingApproval && job.proposed_updates.length === 0}
      <section class="card">
        <div class="empty-state">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
          <h4>No new knowledge found</h4>
          <p>The pipeline analyzed this source and found no knowledge items that are new to the Brain. Nothing to commit.</p>
        </div>
      </section>
    {/if}

    <!-- ── Committed ── -->
    {#if commitDone || job.stage === 'committed'}
      <section class="card success-card">
        <div class="success-ic">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>
        </div>
        <div>
          <h4>Committed to Brain</h4>
          <p>Your approved updates have been written to the Legacy Brain. Source references, timestamps, and original file names are preserved.</p>
        </div>
        <button class="btn-primary" on:click={reset} style="margin-top:12px">Import Another Source</button>
      </section>
    {/if}
  {/if}

  <!-- ── Rules reminder ── -->
  <div class="rules">
    <div class="rules-title">Import Rules</div>
    <ul>
      <li>No knowledge is written to the Brain without your explicit approval.</li>
      <li>Source references and original timestamps are always preserved.</li>
      <li>Duplicates are detected and flagged before they reach your review queue.</li>
      <li>Items the pipeline cannot classify are flagged for your attention.</li>
      <li>Original files are never deleted; this system only reads them.</li>
    </ul>
  </div>
</div>

<style>
  .page { padding: 24px 52px 48px; display: flex; flex-direction: column; gap: 22px; }
  .viewhead { max-width: 900px; }
  .backlink { color: var(--muted); font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
  .backlink:hover { color: var(--navy); }
  .vtitle { font-size: 30px; color: var(--navy); margin-top: 8px; font-weight: 700; }
  .subtitle { font-size: 15px; color: var(--muted); margin-top: 6px; line-height: 1.5; max-width: 600px; }

  .card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 28px 28px 24px; max-width: 900px; box-shadow: var(--shadow-sm); }
  .section-title { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 14px; }
  .hint { font-size: 14px; color: var(--muted); margin-bottom: 14px; line-height: 1.5; }

  .connector-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; }

  /* Future connector card (read-only, mirrors ImportConnectorCard layout) */
  .future-card { position: relative; background: #fafafa; border: 2px solid var(--line); border-radius: 14px; padding: 18px 16px 14px; opacity: 0.45; display: flex; flex-direction: column; gap: 6px; }
  .future-card .icon { font-size: 22px; line-height: 1; margin-bottom: 2px; }
  .future-card .label { font-size: 14px; font-weight: 700; color: var(--navy); line-height: 1.2; }
  .future-card .desc { font-size: 12px; color: var(--muted); line-height: 1.45; }
  .future-card .badge { position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: 600; color: var(--muted); background: var(--line); border-radius: 999px; padding: 2px 8px; }

  .upload-zone { display: block; border: 2px dashed var(--line); border-radius: 12px; padding: 28px 20px; text-align: center; cursor: pointer; transition: border-color 0.15s; position: relative; }
  .upload-zone:hover, .upload-zone.has-file { border-color: var(--navy); }
  .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .upload-prompt { display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--muted); font-size: 14px; }
  .ext-hint { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .file-name { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--navy); }
  .file-size { font-size: 12px; color: var(--muted); font-weight: 400; }

  .or-divider { text-align: center; font-size: 13px; color: var(--muted); margin: 14px 0 10px; position: relative; }
  .or-divider::before, .or-divider::after { content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: var(--line); }
  .or-divider::before { left: 0; }
  .or-divider::after { right: 0; }

  .text-input { width: 100%; border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: inherit; resize: vertical; color: var(--ink); box-sizing: border-box; }
  .text-input:focus { outline: none; border-color: var(--navy); }

  .btn-row { display: flex; gap: 12px; justify-content: flex-end; margin-top: 18px; }
  .btn-primary { background: var(--navy); color: #fff; font-size: 14px; font-weight: 700; border: none; border-radius: 999px; padding: 10px 24px; cursor: pointer; transition: opacity 0.15s; }
  .btn-primary:hover:not(:disabled) { opacity: 0.85; }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-secondary { background: #f3f4f6; color: var(--navy); font-size: 14px; font-weight: 600; border: none; border-radius: 999px; padding: 10px 20px; cursor: pointer; transition: background 0.15s; }
  .btn-secondary:hover { background: #e5e7eb; }
  .btn-ghost { background: none; border: 1px solid var(--line); color: var(--muted); font-size: 13px; font-weight: 500; border-radius: 999px; padding: 7px 16px; cursor: pointer; }
  .btn-ghost:hover { border-color: var(--navy); color: var(--navy); }

  .error-notice { background: #fce8e8; border: 1px solid #f4b4b4; border-radius: 10px; padding: 10px 14px; font-size: 13.5px; color: #7d1a1a; margin-top: 12px; }

  .job-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 16px; }
  .job-meta { display: flex; gap: 14px; font-size: 12.5px; color: var(--muted); margin-top: 2px; flex-wrap: wrap; }
  .job-meta code { font-family: monospace; font-size: 11px; background: #f3f4f6; padding: 1px 5px; border-radius: 4px; }

  .stage-msg { font-size: 13px; color: var(--muted); margin-top: 10px; }

  .processing { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--navy); font-weight: 500; margin-top: 14px; }
  .spinner { width: 16px; height: 16px; border: 2px solid var(--line); border-top-color: var(--navy); border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .approval-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
  .approval-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .updates-list { display: flex; flex-direction: column; gap: 12px; }

  .commit-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--line); flex-wrap: wrap; }
  .commit-hint { font-size: 13.5px; color: var(--muted); }
  .btn-commit { background: var(--gold); color: #fff; font-size: 14px; font-weight: 700; border: none; border-radius: 999px; padding: 11px 26px; cursor: pointer; transition: opacity 0.15s; flex-shrink: 0; }
  .btn-commit:hover:not(:disabled) { opacity: 0.88; }
  .btn-commit:disabled { opacity: 0.4; cursor: not-allowed; }

  .empty-state { text-align: center; padding: 20px 0; }
  .empty-state svg { margin: 0 auto 12px; display: block; color: var(--muted); }
  .empty-state h4 { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 6px; }
  .empty-state p { font-size: 14px; color: var(--muted); line-height: 1.5; max-width: 440px; margin: 0 auto; }

  .success-card { border-top: 4px solid var(--gold); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 32px 28px; }
  .success-ic { width: 52px; height: 52px; border-radius: 50%; background: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
  .success-card h4 { font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .success-card p { font-size: 14px; color: var(--muted); line-height: 1.55; max-width: 460px; }

  .rules { max-width: 900px; background: #f8f6f2; border: 1px solid var(--line); border-radius: 12px; padding: 16px 20px; }
  .rules-title { font-size: 13px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
  .rules ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 5px; }
  .rules li { font-size: 13px; color: var(--muted); line-height: 1.4; }

  @media (max-width: 860px) {
    .page { padding: 16px 16px 32px; }
    .card { max-width: 100%; padding: 20px 16px; }
    .connector-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
    .commit-row { flex-direction: column; align-items: flex-start; }
    .btn-commit { width: 100%; text-align: center; }
  }
</style>
