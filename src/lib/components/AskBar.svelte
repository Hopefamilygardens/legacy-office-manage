<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import VoiceButton from './VoiceButton.svelte';
  import { askOfficeManager } from '$lib/api';

  export let view: string = 'command';
  const dispatch = createEventDispatcher();

  let text = '';
  let busy = false;
  let error = '';

  async function send() {
    const message = text.trim();
    if (!message || busy) return;
    busy = true;
    error = '';
    try {
      const res = await askOfficeManager(message, { view: view });
      dispatch('answer', { question: message, answer: res.answer, ok: res.ok });
      text = '';
    } catch (e) {
      error = 'The Office Manager AI is unavailable right now.';
    } finally {
      busy = false;
    }
  }

  function onVoice(e: CustomEvent) {
    text = e.detail.text;
    send();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
</script>

<div class="ask-bar">
  <textarea
    bind:value={text}
    on:keydown={onKey}
    placeholder="Ask your office manager, or use voice..."
    rows="2"
  ></textarea>
  <div class="ask-actions">
    <VoiceButton view={view} on:transcript={onVoice} />
    <button class="send-btn" on:click={send} disabled={busy}>
      {busy ? 'Thinking...' : 'Ask'}
    </button>
  </div>
</div>
{#if error}
  <p class="ask-error" role="alert">{error}</p>
{/if}

<style>
  .ask-bar {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 1rem;
  }
  textarea {
    width: 100%;
    resize: vertical;
    background: #0b1220;
    color: #e2e8f0;
    border: 1px solid #1f2937;
    border-radius: 8px;
    padding: 0.6rem;
    font: inherit;
    box-sizing: border-box;
  }
  .ask-actions {
    display: flex;
    gap: 0.6rem;
    align-items: center;
  }
  .send-btn {
    border: none;
    border-radius: 999px;
    padding: 0.6rem 1.3rem;
    font-weight: 600;
    background: #16a34a;
    color: white;
    cursor: pointer;
  }
  .send-btn:disabled {
    background: #6b7280;
    cursor: wait;
  }
  .ask-error {
    color: #f87171;
    font-size: 0.85rem;
  }
</style>
