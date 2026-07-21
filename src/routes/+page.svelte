<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchBrief } from '$lib/api';
  import type { BriefResponse } from '$lib/types';
  import BriefSection from '$lib/components/BriefSection.svelte';
  import SummaryCard from '$lib/components/SummaryCard.svelte';
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
  <title>Command Center — Legacy Office Manager</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- Hero -->
<section class="hero">
  <div class="hero-text">
    <p class="eyebrow">Legacy Builders &middot; Office Manager</p>
    <h1 class="serif">Run your business.<br /><span class="gold">Be home for what matters.</span></h1>
    <p class="lede">
      Your family-run command center. Ask by voice or type, review your daily brief,
      and stay in control — every action waits for your confirmation.
    </p>
  </div>
  <div class="hero-actions">
    <button class="refresh" on:click={load} disabled={loading}>
      {loading ? 'Refreshing...' : 'Refresh brief'}
    </button>
  </div>
</section>

<!-- Primary voice / ask control -->
<div class="ask-wrap">
  <AskBar view="command" on:answer={onAnswer} />
</div>

<!-- AI answers -->
{#each answers as a}
  <div class="answer-wrap">
    <AnswerCard question={a.question} answer={a.answer} ok={a.ok} />
  </div>
{/each}

<!-- Brief -->
{#if loading}
  <div class="skeleton-grid">
    {#each Array(4) as _}
      <div class="skeleton"></div>
    {/each}
  </div>
{:else if loadError}
  <div class="notice error">
    <p>{loadError}</p>
    <button class="retry" on:click={load}>Try again</button>
  </div>
{:else if brief}
  {#if brief.office_manager_summary}
    <div class="summary-wrap">
      <SummaryCard text={brief.office_manager_summary} generatedAt={brief.generated_at} />
    </div>
  {/if}

  <h2 class="section-title">Daily Brief</h2>
  <div class="grid">
    <BriefSection
      title="Overdue Tasks"
      icon="&#9888;"
      accent="danger"
      count={brief.daily_brief.overdue_tasks.count}
      items={brief.daily_brief.overdue_tasks.items}
    />
    <BriefSection
      title="Due Today"
      icon="&#128197;"
      accent="gold"
      count={brief.daily_brief.tasks_due_today.count}
      items={brief.daily_brief.tasks_due_today.items}
    />
    <BriefSection
      title="Pending Approvals"
      icon="&#9989;"
      accent="navy"
      count={brief.daily_brief.pending_approvals.count}
      items={brief.daily_brief.pending_approvals.items}
    />
    <BriefSection
      title="Leads Needing Attention"
      icon="&#128200;"
      accent="success"
      count={brief.daily_brief.leads_requiring_attention.count}
      items={brief.daily_brief.leads_requiring_attention.items}
    />
  </div>

  <h2 class="section-title">Communications</h2>
  <div class="grid">
    <BriefSection
      title="Messages to Reply"
      icon="&#9993;"
      accent="navy"
      count={brief.communications_summary.count}
      items={brief.communications_summary.items}
    />
    <BriefSection
      title="Schedule"
      icon="&#128336;"
      accent="gold"
      count={brief.calendar_summary.count}
      items={brief.calendar_summary.items}
    />
  </div>

  {#if brief.suggested_actions && brief.suggested_actions.length}
    <h2 class="section-title">Suggested Actions</h2>
    <div class="grid">
      <BriefSection
        title="Recommended Next Steps"
        icon="&#10024;"
        accent="success"
        count={brief.suggested_actions.length}
        items={brief.suggested_actions}
      />
    </div>
  {/if}

  {#if brief.generated_at}
    <p class="generated">Brief generated {brief.generated_at}</p>
  {/if}
{/if}

<style>
  .hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    background:
      radial-gradient(600px 240px at 90% 0%, rgba(224, 180, 83, 0.14), transparent 70%),
      linear-gradient(135deg, var(--navy-900), var(--navy-700));
    color: var(--cream-50);
    border-radius: var(--radius);
    padding: 2rem 2rem 1.75rem;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--navy-800);
  }
  .eyebrow {
    margin: 0 0 0.5rem;
    color: var(--gold-400);
    font-size: 0.78rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 700;
  }
  .hero h1 {
    color: var(--white);
    font-size: clamp(1.6rem, 4vw, 2.5rem);
    line-height: 1.15;
    margin: 0;
  }
  .hero .gold {
    color: var(--gold-400);
  }
  .lede {
    margin: 0.9rem 0 0;
    max-width: 52ch;
    color: var(--cream-100);
    line-height: 1.6;
    font-size: 0.98rem;
  }
  .hero-actions {
    flex: none;
  }
  .refresh {
    border: none;
    border-radius: 999px;
    padding: 0.65rem 1.4rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--gold-400), var(--gold-600));
    color: var(--navy-900);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    white-space: nowrap;
  }
  .refresh:hover {
    filter: brightness(1.05);
  }
  .refresh:disabled {
    opacity: 0.7;
    cursor: wait;
  }
  .ask-wrap {
    margin: 1.4rem 0;
  }
  .answer-wrap {
    margin-bottom: 0.9rem;
  }
  .summary-wrap {
    margin-bottom: 1.5rem;
  }
  .section-title {
    font-size: 1.05rem;
    color: var(--navy-900);
    margin: 1.6rem 0 0.9rem;
    padding-bottom: 0.4rem;
    border-bottom: 2px solid var(--gold-500);
    display: inline-block;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 1rem;
  }
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }
  .skeleton {
    height: 150px;
    border-radius: var(--radius);
    background: linear-gradient(100deg, var(--cream-100) 30%, var(--cream-200) 50%, var(--cream-100) 70%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border: 1px solid var(--line);
  }
  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
  .notice {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 1.5rem;
    text-align: center;
    box-shadow: var(--shadow-sm);
  }
  .notice.error {
    border-left: 5px solid var(--danger);
  }
  .retry {
    margin-top: 0.75rem;
    border: none;
    border-radius: 999px;
    padding: 0.5rem 1.3rem;
    background: var(--navy-900);
    color: var(--white);
    font-weight: 600;
    cursor: pointer;
  }
  .generated {
    color: var(--ink-500);
    font-size: 0.8rem;
    margin-top: 1.5rem;
    text-align: center;
  }
  @media (max-width: 640px) {
    .hero {
      flex-direction: column;
      align-items: stretch;
      padding: 1.5rem 1.25rem;
    }
    .hero-actions {
      display: flex;
    }
    .refresh {
      width: 100%;
    }
  }
</style>
