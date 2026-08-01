<script lang="ts">
  import type { PipelineStage } from '$lib/importer';
  import { PIPELINE_STAGES, PIPELINE_STAGE_LABELS } from '$lib/importer';

  export let stage: PipelineStage;

  const displayStages: PipelineStage[] = PIPELINE_STAGES.filter((s) => s !== 'error');

  function stageIndex(s: PipelineStage): number {
    return displayStages.indexOf(s);
  }

  $: currentIndex = stageIndex(stage === 'error' ? 'import' : stage);
</script>

<div class="pipeline" role="list" aria-label="Import pipeline progress">
  {#each displayStages as s, i}
    {@const done = i < currentIndex}
    {@const active = i === currentIndex}
    <div
      class="step"
      class:done
      class:active
      role="listitem"
      aria-current={active ? 'step' : undefined}
    >
      <div class="dot">
        {#if done}
          <svg viewBox="0 0 16 16" width="10" height="10" fill="none">
            <path d="M3 8l3.5 3.5 6.5-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {:else if active}
          <div class="pulse"></div>
        {:else}
          <div class="empty"></div>
        {/if}
      </div>
      {#if i < displayStages.length - 1}
        <div class="connector-line" class:filled={done || active}></div>
      {/if}
      <span class="lbl">{PIPELINE_STAGE_LABELS[s]}</span>
    </div>
  {/each}

  {#if stage === 'error'}
    <div class="error-row">
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 13v1"/>
      </svg>
      Pipeline error — check job details below
    </div>
  {/if}
</div>

<style>
  .pipeline {
    display: flex;
    align-items: flex-start;
    gap: 0;
    overflow-x: auto;
    padding: 4px 0 8px;
  }
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex-shrink: 0;
  }
  .dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid var(--line);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    transition: background 0.2s, border-color 0.2s;
  }
  .done .dot {
    background: var(--navy);
    border-color: var(--navy);
  }
  .active .dot {
    background: var(--gold);
    border-color: var(--gold);
  }
  .pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    animation: pulse 1.2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .empty {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--line);
  }
  .connector-line {
    position: absolute;
    top: 10px;
    left: calc(50% + 11px);
    width: calc(100% - 22px);
    height: 2px;
    background: var(--line);
    z-index: 0;
    min-width: 36px;
  }
  .connector-line.filled {
    background: var(--navy);
  }
  .lbl {
    font-size: 10.5px;
    color: var(--muted);
    margin-top: 6px;
    text-align: center;
    white-space: nowrap;
    max-width: 64px;
  }
  .done .lbl, .active .lbl {
    color: var(--navy);
    font-weight: 600;
  }
  .active .lbl {
    color: var(--gold);
  }
  .error-row {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--danger);
    font-size: 13px;
    font-weight: 600;
    padding: 6px 0 0 8px;
    flex-shrink: 0;
  }
</style>
