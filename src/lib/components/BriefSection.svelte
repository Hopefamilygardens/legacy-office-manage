<script lang="ts">
  import { itemLabel, itemDetail } from '$lib/format';
  export let title: string;
  export let count: number = 0;
  export let items: unknown[] = [];
  export let accent: string = 'gold';
  export let icon: string = '';

  $: shown = (items || []).slice(0, 6);
</script>

<section class="card accent-{accent}">
  <header class="card-head">
    <div class="card-title">
      {#if icon}<span class="icon" aria-hidden="true">{icon}</span>{/if}
      <h3>{title}</h3>
    </div>
    <span class="badge" class:zero={!count}>{count}</span>
  </header>
  {#if shown.length > 0}
    <ul>
      {#each shown as item}
        <li>
          <span class="label">{itemLabel(item)}</span>
          {#if itemDetail(item)}
            <span class="detail">{itemDetail(item)}</span>
          {/if}
        </li>
      {/each}
    </ul>
    {#if items.length > shown.length}
      <p class="more">+{items.length - shown.length} more</p>
    {/if}
  {:else}
    <p class="empty">All clear — nothing needs attention here.</p>
  {/if}
</section>

<style>
  .card {
    background: var(--white);
    border: 1px solid var(--line);
    border-top: 4px solid var(--gold-500);
    border-radius: var(--radius);
    padding: 1.1rem 1.25rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }
  .card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  .accent-navy {
    border-top-color: var(--navy-700);
  }
  .accent-danger {
    border-top-color: var(--danger);
  }
  .accent-success {
    border-top-color: var(--success);
  }
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
  }
  .card-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
  }
  .icon {
    font-size: 1.1rem;
  }
  .card-title h3 {
    font-size: 1rem;
    color: var(--navy-900);
  }
  .badge {
    flex: none;
    background: var(--navy-900);
    color: var(--white);
    border-radius: 999px;
    min-width: 26px;
    text-align: center;
    padding: 0.1rem 0.55rem;
    font-size: 0.82rem;
    font-weight: 700;
  }
  .badge.zero {
    background: var(--cream-200);
    color: var(--ink-500);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  li {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 0.55rem 0.65rem;
    background: var(--cream-50);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
  }
  .label {
    color: var(--ink-900);
    font-size: 0.92rem;
    line-height: 1.35;
  }
  .detail {
    color: var(--ink-500);
    font-size: 0.78rem;
  }
  .more {
    margin: 0.6rem 0 0;
    color: var(--ink-500);
    font-size: 0.8rem;
  }
  .empty {
    color: var(--ink-500);
    margin: 0.2rem 0 0;
    font-size: 0.88rem;
  }
</style>
