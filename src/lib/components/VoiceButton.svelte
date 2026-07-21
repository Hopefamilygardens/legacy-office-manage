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
  <button
    class="voice-btn"
    class:recording={recording}
    class:busy={busy}
    on:click={toggle}
    disabled={busy}
    aria-label={recording ? 'Stop recording' : 'Start voice input'}
  >
    {#if busy}
      Transcribing...
    {:else if recording}
      Stop &amp; Send
    {:else}
      Speak
    {/if}
  </button>
{:else}
  <span class="voice-unsupported">Voice not supported here</span>
{/if}

{#if error}
  <p class="voice-error" role="alert">{error}</p>
{/if}

<style>
  .voice-btn {
    border: none;
    border-radius: 999px;
    padding: 0.6rem 1.1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    background: #2563eb;
    color: white;
  }
  .voice-btn.recording {
    background: #dc2626;
  }
  .voice-btn.busy {
    background: #6b7280;
    cursor: wait;
  }
  .voice-unsupported {
    color: #9ca3af;
    font-size: 0.85rem;
  }
  .voice-error {
    color: #f87171;
    font-size: 0.85rem;
    margin-top: 0.4rem;
  }
</style>
