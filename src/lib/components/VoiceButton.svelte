<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { VoiceRecorder, isVoiceSupported, transcribe } from '$lib/voice';

  export let view: string = 'command';
  export let sessionId: string = 'web-ui';

  const dispatch = createEventDispatcher();
  let recorder: VoiceRecorder | null = null;
  let recording = false;
  let busy = false;
  let error = '';
  const supported = isVoiceSupported();

  async function startRecording() {
    error = '';
    try {
      recorder = new VoiceRecorder();
      await recorder.start();
      recording = true;
    } catch (e) {
      error = 'Microphone unavailable. Check browser permissions.';
      recording = false;
    }
  }

  async function stopRecording() {
    if (!recorder) return;
    recording = false;
    busy = true;
    try {
      const blob = await recorder.stop();
      const result = await transcribe(blob, { view: view, session_id: sessionId });
      if (result.ok && result.transcript) {
        dispatch('transcript', { text: result.transcript });
      } else {
        error = result.message || 'Could not transcribe that recording.';
      }
    } catch (e) {
      error = 'Transcription failed. Please try again or type instead.';
    } finally {
      busy = false;
      recorder = null;
    }
  }

  function toggle() {
    if (busy) return;
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }
</script>

{#if supported}
  <div class="voice-wrap">
    <button
      class="voice-btn"
      class:recording={recording}
      class:busy={busy}
      on:click={toggle}
      disabled={busy}
      aria-label={recording ? 'Stop recording and send' : 'Start voice input'}
    >
      <span class="mic-glyph" aria-hidden="true">
        {#if busy}
          <span class="spinner"></span>
        {:else}
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
            <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11z" />
          </svg>
        {/if}
      </span>
    </button>
    <span class="voice-label">
      {#if busy}
        Transcribing...
      {:else if recording}
        Listening — tap to stop
      {:else}
        Speak
      {/if}
    </span>
  </div>
{:else}
  <span class="voice-unsupported">Voice input isn't supported in this browser.</span>
{/if}

{#if error}
  <p class="voice-error" role="alert">{error}</p>
{/if}

<style>
  .voice-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }
  .voice-btn {
    width: 76px;
    height: 76px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    display: grid;
    place-items: center;
    color: var(--navy-900);
    background: linear-gradient(135deg, var(--gold-400), var(--gold-600));
    box-shadow: var(--shadow-md), inset 0 0 0 2px rgba(255, 255, 255, 0.3);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  .voice-btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg), inset 0 0 0 2px rgba(255, 255, 255, 0.4);
  }
  .voice-btn:active {
    transform: translateY(0);
  }
  .voice-btn.recording {
    color: var(--white);
    background: linear-gradient(135deg, #d1493c, var(--danger));
    animation: pulse 1.4s ease-in-out infinite;
  }
  .voice-btn.busy {
    background: var(--navy-600);
    color: var(--white);
    cursor: wait;
  }
  .mic-glyph {
    display: grid;
    place-items: center;
  }
  .voice-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--ink-700);
  }
  .voice-unsupported {
    color: var(--ink-500);
    font-size: 0.85rem;
  }
  .voice-error {
    color: var(--danger);
    font-size: 0.85rem;
    margin: 0.4rem 0 0;
    text-align: center;
  }
  .spinner {
    width: 26px;
    height: 26px;
    border: 3px solid rgba(255, 255, 255, 0.4);
    border-top-color: var(--white);
    border-radius: 999px;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes pulse {
    0%,
    100% {
      box-shadow: var(--shadow-md), 0 0 0 0 rgba(178, 58, 46, 0.5);
    }
    50% {
      box-shadow: var(--shadow-md), 0 0 0 12px rgba(178, 58, 46, 0);
    }
  }
</style>
