import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsText, validateExtension } from '../utils';

// Handles Google Gemini AI conversation exports (Google Takeout JSON format).
export const geminiConnector: ImportConnector = {
  source_type: 'gemini-export',
  display_name: 'Gemini Export',
  description: 'Import conversations from a Google Gemini data export (JSON format from Google Takeout).',
  icon: '✦',
  accepts_file: true,
  file_extensions: ['.json'],
  accepts_text: false,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    if (!input.file) throw new Error('Gemini connector requires a file.');
    const file = input.file;
    const err = validateExtension(file, ['.json']);
    if (err) throw new Error(err);

    const text = await readFileAsText(file);
    return {
      source_type: 'gemini-export',
      source_reference: `gemini-export:${file.name}`,
      source_timestamp: new Date().toISOString(),
      content_type: 'structured',
      content: text,
      original_file_name: file.name,
      metadata: { format: 'json', connector: 'gemini' }
    };
  }
};
