<script lang="ts">
  import type { ImportConnector } from '$lib/importer';

  export let connector: ImportConnector;
  export let selected = false;
  export let onSelect: (c: ImportConnector) => void;
</script>

<button
  class="card"
  class:selected
  class:unavailable={!connector.is_available}
  disabled={!connector.is_available}
  on:click={() => connector.is_available && onSelect(connector)}
  title={connector.is_available ? connector.display_name : (connector.unavailable_reason ?? 'Coming soon')}
>
  <div class="icon">{connector.icon}</div>
  <div class="label">{connector.display_name}</div>
  <div class="desc">{connector.description}</div>
  {#if !connector.is_available}
    <div class="badge">Coming Soon</div>
  {/if}
</button>

<style>
  .card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    background: #fff;
    border: 2px solid var(--line);
    border-radius: 14px;
    padding: 18px 16px 14px;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    position: relative;
    width: 100%;
  }
  .card:hover:not(.unavailable) {
    border-color: var(--navy);
    box-shadow: var(--shadow-md);
  }
  .card.selected {
    border-color: var(--gold);
    background: #fdf8ef;
    box-shadow: 0 0 0 3px rgba(194,149,63,0.15);
  }
  .card.unavailable {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .icon {
    font-size: 22px;
    line-height: 1;
    margin-bottom: 2px;
  }
  .label {
    font-size: 14px;
    font-weight: 700;
    color: var(--navy);
    line-height: 1.2;
  }
  .desc {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.45;
  }
  .badge {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 10px;
    font-weight: 600;
    color: var(--muted);
    background: var(--line);
    border-radius: 999px;
    padding: 2px 8px;
    letter-spacing: 0.3px;
  }
</style>
