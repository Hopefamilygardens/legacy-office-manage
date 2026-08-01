<script lang="ts">
  import type { ProposedBrainUpdate } from '$lib/importer';
  import { createEventDispatcher } from 'svelte';

  export let update: ProposedBrainUpdate;

  const dispatch = createEventDispatcher<{
    approve: { updateId: string };
    reject: { updateId: string };
  }>();

  const ACTION_LABELS: Record<string, string> = {
    add: 'Add to Brain',
    flag: 'Flag for Review'
  };

  const TYPE_COLORS: Record<string, string> = {
    decision: '#1a3a6b',
    fact: '#2d6a4f',
    process: '#7b4f12',
    contact: '#5a2d82',
    project: '#0e4d8a',
    policy: '#7b0e2d',
    preference: '#3d5a3e',
    unknown: '#666'
  };

  $: typeColor = TYPE_COLORS[update.knowledge_item.type] ?? '#666';
</script>

<div class="card" class:flagged={update.knowledge_item.flagged_for_review}>
  <div class="card-head">
    <div class="badges">
      <span class="type-badge" style="background:{typeColor}11;color:{typeColor};border-color:{typeColor}33">
        {update.knowledge_item.type}
      </span>
      <span class="action-badge" class:flag-action={update.action === 'flag'}>
        {ACTION_LABELS[update.action] ?? update.action}
      </span>
      {#if update.knowledge_item.flagged_for_review}
        <span class="flag-badge">⚑ Flagged</span>
      {/if}
      {#if update.duplicate_of}
        <span class="dup-badge">⚠ Near-Duplicate</span>
      {/if}
    </div>

    {#if update.reviewer_decision === 'pending'}
      <div class="actions">
        <button class="btn-approve" on:click={() => dispatch('approve', { updateId: update.id })}>
          ✓ Approve
        </button>
        <button class="btn-reject" on:click={() => dispatch('reject', { updateId: update.id })}>
          ✕ Reject
        </button>
      </div>
    {:else}
      <div class="decision" class:approved={update.reviewer_decision === 'approved'} class:rejected={update.reviewer_decision === 'rejected'}>
        {update.reviewer_decision === 'approved' ? '✓ Approved' : '✕ Rejected'}
      </div>
    {/if}
  </div>

  <div class="content">{update.knowledge_item.content}</div>

  <div class="meta">
    <span class="meta-item">
      <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 4h12M2 8h8M2 12h5"/></svg>
      {update.target_brain_path}
    </span>
    {#if update.knowledge_item.source_reference}
      <span class="meta-item">
        <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 6v4M8 5v.5"/></svg>
        {update.knowledge_item.source_reference}
      </span>
    {/if}
    {#if update.duplicate_of}
      <span class="meta-item warn">Possible duplicate of: {update.duplicate_of}</span>
    {/if}
  </div>

  {#if update.knowledge_item.flagged_for_review && update.knowledge_item.flag_reason}
    <div class="flag-reason">
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 2l.5 6h-1zM8 10v2"/></svg>
      {update.knowledge_item.flag_reason}
    </div>
  {/if}
</div>

<style>
  .card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: var(--shadow-sm);
  }
  .card.flagged {
    border-left: 4px solid var(--gold);
  }
  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .type-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 9px;
    border-radius: 999px;
    border: 1px solid;
    text-transform: capitalize;
    letter-spacing: 0.3px;
  }
  .action-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 9px;
    border-radius: 999px;
    background: #e8f0fe;
    color: #1a3a6b;
    border: 1px solid #c2d1ef;
  }
  .flag-action {
    background: #fef3e2;
    color: #7b4f12;
    border-color: #e8c87a;
  }
  .flag-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 9px;
    border-radius: 999px;
    background: #fef3e2;
    color: var(--gold);
    border: 1px solid #e8c87a;
  }
  .dup-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 9px;
    border-radius: 999px;
    background: #fff4e5;
    color: #c25e00;
    border: 1px solid #f4c484;
  }
  .actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
  .btn-approve, .btn-reject {
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 999px;
    padding: 6px 16px;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn-approve:hover, .btn-reject:hover { opacity: 0.82; }
  .btn-approve { background: var(--navy); color: #fff; }
  .btn-reject { background: #f3f4f6; color: var(--muted); }
  .decision {
    font-size: 13px;
    font-weight: 700;
    border-radius: 999px;
    padding: 5px 14px;
    flex-shrink: 0;
  }
  .decision.approved { background: #e8f5e9; color: #1b5e20; }
  .decision.rejected { background: #fce8e8; color: #7d1a1a; }
  .content {
    font-size: 14px;
    color: var(--ink);
    line-height: 1.6;
    white-space: pre-wrap;
    max-height: 120px;
    overflow-y: auto;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    color: var(--muted);
    font-family: monospace;
  }
  .meta-item.warn { color: #c25e00; }
  .flag-reason {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 12.5px;
    color: #7b4f12;
    background: #fef3e2;
    border-radius: 8px;
    padding: 8px 12px;
    line-height: 1.4;
  }
</style>
