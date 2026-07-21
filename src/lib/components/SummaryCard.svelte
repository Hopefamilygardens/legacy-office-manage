<script lang="ts">
  import { toParagraphs } from '$lib/format';
  export let title: string = 'Office Manager Summary';
  export let text: string = '';
  export let generatedAt: string = '';

  $: paragraphs = toParagraphs(text);
</script>

<section class="summary">
  <header class="summary-head">
    <div class="crest" aria-hidden="true">LB</div>
    <div>
      <h2>{title}</h2>
      {#if generatedAt}<p class="stamp">Updated {generatedAt}</p>{/if}
    </div>
  </header>
  <div class="summary-body">
    {#if paragraphs.length}
      {#each paragraphs as p}
        {#if p.kind === 'bullet'}
          <div class="bullet"><span class="dot">&bull;</span><span>{p.text}</span></div>
        {:else}
          <p>{p.text}</p>
        {/if}
      {/each}
    {:else}
      <p class="empty">Your summary will appear here once the brief loads.</p>
    {/if}
  </div>
</section>

<style>
  .summary {
    background: linear-gradient(135deg, var(--navy-900), var(--navy-700));
    color: var(--cream-50);
    border-radius: var(--radius);
    padding: 1.4rem 1.5rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--navy-800);
  }
  .summary-head {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: 0.9rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid rgba(224, 180, 83, 0.25);
  }
  .crest {
    flex: none;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--gold-400), var(--gold-600));
    color: var(--navy-900);
    font-weight: 800;
  }
  .summary-head h2 {
    color: var(--white);
    font-size: 1.15rem;
  }
  .stamp {
    margin: 0.15rem 0 0;
    color: var(--gold-400);
    font-size: 0.76rem;
  }
  .summary-body p {
    margin: 0 0 0.6rem;
    line-height: 1.65;
    color: var(--cream-100);
  }
  .summary-body p:last-child {
    margin-bottom: 0;
  }
  .bullet {
    display: flex;
    gap: 0.55rem;
    line-height: 1.6;
    margin: 0 0 0.45rem;
    color: var(--cream-100);
  }
  .dot {
    color: var(--gold-400);
    font-weight: 700;
  }
  .empty {
    color: rgba(245, 239, 225, 0.6);
  }
</style>
