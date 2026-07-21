import { ENDPOINTS } from './config';
import type { VoiceResponse } from './types';

// Voice is a first-class input. This module records a voice note in the browser
// and sends it to the n8n Voice Transcription endpoint. No transcription logic
// runs in the frontend; it only captures audio and relays it.
export function isVoiceSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof MediaRecorder !== 'undefined'
  );
}

export class VoiceRecorder {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  async start(): Promise<void> {
    if (!isVoiceSupported()) {
      throw new Error('Voice recording is not supported in this browser.');
    }
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.chunks = [];
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
    this.recorder.start();
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.recorder) {
        reject(new Error('Recorder not started'));
        return;
      }
      const rec = this.recorder;
      rec.onstop = () => {
        const type = rec.mimeType || 'audio/webm';
        const blob = new Blob(this.chunks, { type: type });
        this.cleanup();
        resolve(blob);
      };
      rec.stop();
    });
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
    }
    this.stream = null;
    this.recorder = null;
  }
}

export async function transcribe(
  blob: Blob,
  opts: { view?: string; session_id?: string } = {}
): Promise<VoiceResponse> {
  const form = new FormData();
  const ext = blob.type.indexOf('ogg') !== -1 ? 'ogg' : 'webm';
  form.append('audio', blob, 'voice-note.' + ext);
  form.append('view', opts.view || 'command');
  form.append('session_id', opts.session_id || 'web-ui');
  form.append('client_ts', new Date().toISOString());
  const res = await fetch(ENDPOINTS.voice, { method: 'POST', body: form });
  const data = (await res.json()) as VoiceResponse;
  return data;
}
