<script lang="ts">
  import { toParagraphs } from '$lib/format';
  export let question: string = '';
  export let answer: string = '';
  export let ok: boolean = true;

  $: paragraphs = toParagraphs(answer);
</script>

<article class="answer-card" class:warn={!ok}>
  <div class="answer-head">
    <span class="badge">Office Manager</span>
    {#if question}
      <p class="q">You asked: {question}</p>
    {/if}
  </div>
  <div class="answer-body">
    {#if paragraphs.length}
      {#each paragraphs as p}
        {#if p.kind === 'bullet'}
          <div class="bullet"><span class="dot">&bull;</span><span>{p.text}</span></div>
        {:else}
          <p>{p.text}</p>
        {/if}
      {/each}
    {:else}
      <p class="empty">No response text returned.</p>
    {/if}
  </div>
</article>

<style>
  .answer-card {
    background: var(--white);
    border: 1px solid var(--line);
    border-left: 5px solid var(--gold-500);
    border-radius: var(--radius-sm);
    padding: 1rem 1.2rem;
    box-shadow: var(--shadow-sm);
  }
  .answer-card.warn {
    border-left-color: var(--danger);
  }
  .answer-head {
    margin-bottom: 0.5rem;
  }
  .badge {
    display: inline-block;
    background: var(--navy-900);
    color: var(--cream-100);
    border-radius: 999px;
    padding: 0.15rem 0.7rem;
    font-size: 0.72rem;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: 700;
  }
  .q {
    color: var(--ink-500);
    font-size: 0.85rem;
    margin: 0.5rem 0 0;
    font-style: italic;
  }
  .answer-body p {
    margin: 0 0 0.55rem;
    line-height: 1.6;
    color: var(--ink-900);
  }
  .answer-body p:last-child {
    margin-bottom: 0;
  }
  .bullet {
    display: flex;
    gap: 0.5rem;
    line-height: 1.6;
    margin: 0 0 0.4rem;
    color: var(--ink-900);
  }
  .dot {
    color: var(--gold-600);
    font-weight: 700;
  }
  .empty {
    color: var(--ink-500);
  }
</style>
