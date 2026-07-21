<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  import VoiceButton from './VoiceButton.svelte';
  import { askOfficeManager } from '$lib/api';

  export let view: string = 'command';
  const dispatch = createEventDispatcher();

  let text = '';
  let busy = false;
  let error = '';
  let fromVoice = false;
  let textareaEl: HTMLTextAreaElement | null = null;

  async function send() {
    const message = text.trim();
    if (!message || busy) return;
    busy = true;
    error = '';
    try {
      const res = await askOfficeManager(message, { view: view });
      dispatch('answer', { question: message, answer: res.answer, ok: res.ok });
      text = '';
      fromVoice = false;
    } catch (e) {
      error = 'The Office Manager AI is unavailable right now.';
    } finally {
      busy = false;
    }
  }

  async function onVoice(e: CustomEvent) {
    // Editable transcript: populate the field and let the user review/edit
    // before sending. Human confirmation stays in the loop.
    text = e.detail.text;
    fromVoice = true;
    await tick();
    if (textareaEl) {
      textareaEl.focus();
      textareaEl.selectionStart = textareaEl.selectionEnd = text.length;
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
</script>

<div class="ask-card">
  <div class="ask-head">
    <div>
      <h2>Ask your Office Manager</h2>
      <p class="ask-sub">Speak or type. Review before you send — nothing happens without your confirmation.</p>
    </div>
  </div>

  <div class="ask-body">
    <div class="voice-col">
      <VoiceButton view={view} on:transcript={onVoice} />
    </div>

    <div class="input-col">
      <textarea
        bind:this={textareaEl}
        bind:value={text}
        on:keydown={onKey}
        placeholder="Ask about today's schedule, approvals, leads, or dictate a note..."
        rows="3"
      ></textarea>
      <div class="ask-actions">
        {#if fromVoice}
          <span class="transcript-flag">Transcript ready — edit if needed</span>
        {:else}
          <span class="hint">Press Enter to send &middot; Shift+Enter for a new line</span>
        {/if}
        <button class="send-btn" on:click={send} disabled={busy}>
          {busy ? 'Thinking...' : 'Ask'}
        </button>
      </div>
    </div>
  </div>

  {#if error}
    <p class="ask-error" role="alert">{error}</p>
  {/if}
</div>

<style>
  .ask-card {
    background: linear-gradient(180deg, var(--white), var(--cream-50));
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 1.25rem 1.35rem;
    box-shadow: var(--shadow-md);
  }
  .ask-head h2 {
    font-size: 1.15rem;
  }
  .ask-sub {
    margin: 0.25rem 0 0;
    color: var(--ink-500);
    font-size: 0.88rem;
  }
  .ask-body {
    display: flex;
    gap: 1.25rem;
    align-items: stretch;
    margin-top: 1rem;
  }
  .voice-col {
    flex: none;
    display: flex;
    align-items: center;
    padding-right: 1.25rem;
    border-right: 1px solid var(--line);
  }
  .input-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    min-width: 0;
  }
  textarea {
    width: 100%;
    resize: vertical;
    min-height: 70px;
    background: var(--white);
    color: var(--ink-900);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    padding: 0.75rem 0.9rem;
    font: inherit;
    font-size: 1rem;
    box-sizing: border-box;
  }
  textarea:focus {
    border-color: var(--gold-500);
  }
  .ask-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .hint {
    color: var(--ink-500);
    font-size: 0.78rem;
  }
  .transcript-flag {
    color: var(--gold-600);
    font-size: 0.8rem;
    font-weight: 600;
  }
  .send-btn {
    border: none;
    border-radius: 999px;
    padding: 0.6rem 1.6rem;
    font-weight: 700;
    font-size: 0.95rem;
    background: linear-gradient(135deg, var(--navy-700), var(--navy-900));
    color: var(--white);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
  }
  .send-btn:hover {
    background: var(--navy-800);
  }
  .send-btn:disabled {
    background: var(--ink-500);
    cursor: wait;
  }
  .ask-error {
    color: var(--danger);
    font-size: 0.86rem;
    margin: 0.75rem 0 0;
  }
  @media (max-width: 640px) {
    .ask-body {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .voice-col {
      border-right: none;
      padding-right: 0;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--line);
      width: 100%;
      justify-content: center;
    }
    .input-col {
      width: 100%;
    }
  }
</style>
