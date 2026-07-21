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

  const ownerFirstName = 'Dustin';
  function greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

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
    answers = [{ question: e.detail.question, answer: e.detail.answer, ok: e.detail.ok }, ...answers];
  }

  onMount(load);
</script>

<svelte:head>
  <title>Command Center — Legacy Office Manager</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- Family hero (approved Shell presentation): cream left-fade over family image -->
<section
  class="hero"
  style="background-image:linear-gradient(90deg, rgba(246,241,232,0.92) 0%, rgba(246,241,232,0.55) 32%, rgba(246,241,232,0.12) 52%, rgba(246,241,232,0) 66%), url('/images/legacy-family-hero.png');"
>
  <div class="hero-copy">
    <div class="hero-h serif">Hi, {ownerFirstName}.</div>
    <p class="hero-p">I'm your Legacy Office Manager — I handle the office work so you can focus on what matters most.</p>
  </div>
</section>

<div class="below">
  <!-- Morning Brief card -->
  <section class="summary">
    <div class="badge-ic" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M12 3l1.9 4.5L18.5 9l-3.5 3 1 5-4-2.6L8 17l1-5-3.5-3 4.6-1.5z"/></svg>
    </div>
    <div style="flex:1">
      <h3 class="serif greet">{greeting()}, {ownerFirstName}.</h3>
      <p class="intro">Here's what I have for you today.</p>
      {#if brief && brief.office_manager_summary}
        <SummaryCard text={brief.office_manager_summary} generatedAt={brief.generated_at} />
      {/if}
      <div class="divider"></div>
      <div class="q">What would you like to work on first?</div>
    </div>
  </section>

  <!-- Primary voice / ask control (voice → editable transcript → AI → confirmation) -->
  <div class="ask-wrap">
    <AskBar view="command" on:answer={onAnswer} />
  </div>

  {#each answers as a}
    <div class="answer-wrap"><AnswerCard question={a.question} answer={a.answer} ok={a.ok} /></div>
  {/each}

  <!-- Daily Brief + Suggested Actions -->
  {#if loading}
    <div class="grid">
      {#each Array(4) as _}<div class="skeleton"></div>{/each}
    </div>
  {:else if loadError}
    <div class="notice error"><p>{loadError}</p><button class="retry" on:click={load}>Try again</button></div>
  {:else if brief}
    <div class="sa-label">Daily Brief</div>
    <div class="grid">
      <BriefSection title="Overdue Tasks" icon="&#9888;" accent="danger" count={brief.daily_brief.overdue_tasks.count} items={brief.daily_brief.overdue_tasks.items} />
      <BriefSection title="Due Today" icon="&#128197;" accent="gold" count={brief.daily_brief.tasks_due_today.count} items={brief.daily_brief.tasks_due_today.items} />
      <BriefSection title="Pending Approvals" icon="&#9989;" accent="navy" count={brief.daily_brief.pending_approvals.count} items={brief.daily_brief.pending_approvals.items} />
      <BriefSection title="Leads Needing Attention" icon="&#128200;" accent="success" count={brief.daily_brief.leads_requiring_attention.count} items={brief.daily_brief.leads_requiring_attention.items} />
      <BriefSection title="Messages to Reply" icon="&#9993;" accent="navy" count={brief.communications_summary.count} items={brief.communications_summary.items} />
      <BriefSection title="Schedule" icon="&#128336;" accent="gold" count={brief.calendar_summary.count} items={brief.calendar_summary.items} />
    </div>

    {#if brief.suggested_actions && brief.suggested_actions.length}
      <div class="sa-label">Suggested Actions</div>
      <div class="grid">
        <BriefSection title="Recommended Next Steps" icon="&#10024;" accent="success" count={brief.suggested_actions.length} items={brief.suggested_actions} />
      </div>
    {/if}

    {#if brief.generated_at}<p class="generated">Brief generated {brief.generated_at}</p>{/if}
  {/if}

  <div class="foot">
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>
    Your data is secure. Private. Never shared.
  </div>
</div>

<style>
  .hero{position:relative;min-height:272px;display:flex;align-items:center;background-color:#e4c39a;background-size:cover;background-position:center right;}
  .hero-copy{position:relative;z-index:1;padding:0 52px;max-width:560px;}
  .hero-h{font-size:60px;font-weight:800;color:var(--navy);line-height:1;letter-spacing:-1px;}
  .hero-p{font-size:19px;color:var(--navy);line-height:1.5;max-width:400px;margin-top:16px;}
  .below{padding:17px 52px 40px;display:flex;flex-direction:column;gap:26px;}
  .summary{background:#fff;border-radius:16px;box-shadow:var(--shadow-md);max-width:940px;padding:26px 28px;display:flex;gap:18px;}
  .badge-ic{width:46px;height:46px;min-width:46px;border-radius:50%;background:var(--navy);display:flex;align-items:center;justify-content:center;}
  .badge-ic svg{width:22px;height:22px;stroke:var(--gold-soft);fill:none;stroke-width:1.6;}
  .greet{font-size:22px;color:var(--navy);font-weight:700;margin-bottom:6px;}
  .intro{font-size:15px;color:var(--ink);line-height:1.55;margin-bottom:8px;}
  .divider{height:1px;background:var(--line);margin:16px 0 12px;}
  .q{font-size:15.5px;color:var(--navy);font-weight:600;}
  .ask-wrap{max-width:940px;}
  .answer-wrap{max-width:940px;}
  .sa-label{font-size:16px;font-weight:700;color:var(--navy);}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px;max-width:940px;}
  .skeleton{height:150px;border-radius:16px;background:linear-gradient(100deg,var(--cream) 30%,#ece2cd 50%,var(--cream) 70%);background-size:200% 100%;animation:shimmer 1.4s ease-in-out infinite;border:1px solid var(--line);}
  @keyframes shimmer{to{background-position:-200% 0;}}
  .notice{background:#fff;border:1px solid var(--line);border-radius:16px;padding:1.5rem;text-align:center;box-shadow:var(--shadow-sm);max-width:940px;}
  .notice.error{border-left:5px solid var(--danger);}
  .retry{margin-top:.75rem;border:none;border-radius:999px;padding:.5rem 1.3rem;background:var(--navy);color:#fff;font-weight:600;cursor:pointer;}
  .generated{color:var(--muted);font-size:.8rem;text-align:center;}
  .foot{display:flex;align-items:center;justify-content:center;gap:8px;color:#8a7a63;font-size:13px;padding-top:6px;}
  @media (max-width:860px){
    .hero{min-height:150px;}
    .hero-copy{padding:0 22px;max-width:100%;}
    .hero-h{font-size:34px;}
    .hero-p{font-size:15px;max-width:100%;}
    .below{padding:16px 16px 30px;gap:18px;}
    .summary,.ask-wrap,.answer-wrap,.grid,.notice{max-width:100%;}
  }
</style>
