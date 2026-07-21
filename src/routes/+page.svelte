<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchBrief } from '$lib/api';
  import type { BriefResponse } from '$lib/types';
  import BriefSection from '$lib/components/BriefSection.svelte';
  import AskBar from '$lib/components/AskBar.svelte';
  import AnswerCard from '$lib/components/AnswerCard.svelte';

  let brief: BriefResponse | null = null;
  let loading = true;
  let loadError = '';
  let answers: { question: string; answer: string; ok: boolean }[] = [];

  async function load() {
    loading = true;
    loadError = '';
    try {
      brief = await fetchBrief('command');
    } catch (e) {
      loadError = 'Could not load your daily brief. The n8n backend may be waking up.';
    } finally {
      loading = false;
    }
  }

  function onAnswer(e: CustomEvent) {
    answers = [
      { question: e.detail.question, answer: e.detail.answer, ok: e.detail.ok },
      ...answers
    ];
  }

  onMount(load);
</script>

<svelte:head>
  <title>Command Center - Legacy Office Manager</title>
</svelte:head>

<section class="page-head">
  <h1>Command Center</h1>
  <button class="refresh" on:click={load} disabled={loading}>
    {loading ? 'Loading...' : 'Refresh'}
  </button>
</section>

<div class="ask-wrap">
  <AskBar view="command" on:answer={onAnswer} />
</div>

{#each answers as a}
  <div class="answer-wrap">
    <AnswerCard question={a.question} answer={a.answer} ok={a.ok} />
  </div>
{/each}

{#if loading}
  <p class="status">Loading your brief...</p>
{:else if loadError}
  <p class="status error">{loadError}</p>
{:else if brief}
  {#if brief.office_manager_summary}
    <div class="summary">
      <h2>Office Manager Summary</h2>
      <p>{brief.office_manager_summary}</p>
    </div>
  {/if}
  <div class="grid">
    <BriefSection
      title="Overdue Tasks"
      count={brief.daily_brief.overdue_tasks.count}
      items={brief.daily_brief.overdue_tasks.items}
    />
    <BriefSection
      title="Due Today"
      count={brief.daily_brief.tasks_due_today.count}
      items={brief.daily_brief.tasks_due_today.items}
    />
    <BriefSection
      title="Pending Approvals"
      count={brief.daily_brief.pending_approvals.count}
      items={brief.daily_brief.pending_approvals.items}
    />
    <BriefSection
      title="Leads Needing Attention"
      count={brief.daily_brief.leads_requiring_attention.count}
      items={brief.daily_brief.leads_requiring_attention.items}
    />
    <BriefSection
      title="Messages to Reply"
      count={brief.communications_summary.count}
      items={brief.communications_summary.items}
    />
    <BriefSection
      title="Schedule"
      count={brief.calendar_summary.count}
      items={brief.calendar_summary.items}
    />
  </div>
  {#if brief.generated_at}
    <p class="generated">Generated {brief.generated_at}</p>
  {/if}
{/if}

<style>
  .page-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h1 {
    margin: 0;
  }
  .refresh {
    border: none;
    border-radius: 999px;
    padding: 0.5rem 1.1rem;
    background: #1f2937;
    color: #e2e8f0;
    cursor: pointer;
  }
  .ask-wrap {
    margin: 1.2rem 0;
  }
  .answer-wrap {
    margin-bottom: 0.8rem;
  }
  .summary {
    background: #0b1220;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 1rem 1.2rem;
    margin-bottom: 1.2rem;
  }
  .summary h2 {
    margin: 0 0 0.5rem;
    font-size: 1.05rem;
  }
  .summary p {
    margin: 0;
    line-height: 1.5;
    white-space: pre-wrap;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
  .status {
    color: #9ca3af;
  }
  .status.error {
    color: #f87171;
  }
  .generated {
    color: #6b7280;
    font-size: 0.8rem;
    margin-top: 1rem;
  }
</style>
