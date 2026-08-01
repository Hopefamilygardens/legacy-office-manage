import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsText, validateExtension } from '../utils';

// Handles voice transcript files in plain text, WebVTT (.vtt), or SubRip (.srt) format.
// Works with manual transcripts, AI-generated transcripts (Whisper, etc.), and captions.
export const voiceTranscriptConnector: ImportConnector = {
  source_type: 'voice-transcript',
  display_name: 'Voice Transcript',
  description: 'Import knowledge from a voice recording transcript (.txt, .vtt, .srt). Works with Whisper and manual transcripts.',
  icon: '🎙️',
  accepts_file: true,
  file_extensions: ['.txt', '.vtt', '.srt'],
  accepts_text: true,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    const now = new Date().toISOString();

    if (input.text && !input.file) {
      return {
        source_type: 'voice-transcript',
        source_reference: 'voice-transcript:pasted',
        source_timestamp: now,
        content_type: 'text',
        content: input.text,
        metadata: { format: 'txt', connector: 'voice', input_method: 'text' }
      };
    }

    if (!input.file) throw new Error('Voice transcript connector requires a file or pasted transcript text.');
    const file = input.file;
    const err = validateExtension(file, ['.txt', '.vtt', '.srt']);
    if (err) throw new Error(err);

    const lower = file.name.toLowerCase();
    const format = lower.endsWith('.vtt') ? 'vtt' : lower.endsWith('.srt') ? 'srt' : 'txt';
    const text = await readFileAsText(file);

    return {
      source_type: 'voice-transcript',
      source_reference: `voice-transcript:${file.name}`,
      source_timestamp: now,
      content_type: 'text',
      content: text,
      original_file_name: file.name,
      metadata: { format, connector: 'voice', input_method: 'file' }
    };
  }
};
