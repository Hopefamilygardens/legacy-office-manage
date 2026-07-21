<script lang="ts">
  export let title: string;
  export let count: number = 0;
  export let items: unknown[] = [];

  function label(item: unknown): string {
    if (item == null) return '';
    if (typeof item === 'string') return item;
    const o = item as Record<string, unknown>;
    const candidate =
      o.title || o.name || o.subject || o.summary || o.label || o.description;
    return typeof candidate === 'string' ? candidate : JSON.stringify(item);
  }
</script>

<section class="brief-section">
  <header class="brief-section-head">
    <h3>{title}</h3>
    <span class="badge">{count}</span>
  </header>
  {#if items && items.length > 0}
    <ul>
      {#each items.slice(0, 6) as item}
        <li>{label(item)}</li>
      {/each}
    </ul>
  {:else}
    <p class="empty">Nothing here right now.</p>
  {/if}
</section>

<style>
  .brief-section {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 1rem 1.2rem;
  }
  .brief-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brief-section-head h3 {
    margin: 0;
    font-size: 1rem;
  }
  .badge {
    background: #2563eb;
    color: white;
    border-radius: 999px;
    padding: 0.1rem 0.6rem;
    font-size: 0.8rem;
  }
  ul {
    margin: 0.6rem 0 0;
    padding-left: 1.1rem;
  }
  li {
    margin: 0.25rem 0;
  }
  .empty {
    color: #6b7280;
    margin: 0.6rem 0 0;
    font-size: 0.9rem;
  }
</style>
