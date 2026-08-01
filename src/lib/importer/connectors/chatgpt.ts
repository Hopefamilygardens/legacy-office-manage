import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsText, readFileAsBase64, validateExtension } from '../utils';

// Handles OpenAI ChatGPT data exports.
// JSON format:  export → conversations.json (array of conversation objects)
// ZIP format:   export → zip archive containing conversations.json and attachments
export const chatgptConnector: ImportConnector = {
  source_type: 'chatgpt-export',
  display_name: 'ChatGPT Export',
  description: 'Import conversations from a ChatGPT data export (conversations.json or ZIP archive).',
  icon: '🤖',
  accepts_file: true,
  file_extensions: ['.json', '.zip'],
  accepts_text: false,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    if (!input.file) throw new Error('ChatGPT connector requires a file.');
    const file = input.file;
    const err = validateExtension(file, ['.json', '.zip']);
    if (err) throw new Error(err);

    const now = new Date().toISOString();

    if (file.name.toLowerCase().endsWith('.zip')) {
      const base64 = await readFileAsBase64(file);
      return {
        source_type: 'chatgpt-export',
        source_reference: `chatgpt-export:${file.name}`,
        source_timestamp: now,
        content_type: 'binary',
        content_base64: base64,
        original_file_name: file.name,
        metadata: { format: 'zip', connector: 'chatgpt' }
      };
    }

    const text = await readFileAsText(file);
    return {
      source_type: 'chatgpt-export',
      source_reference: `chatgpt-export:${file.name}`,
      source_timestamp: now,
      content_type: 'structured',
      content: text,
      original_file_name: file.name,
      metadata: { format: 'json', connector: 'chatgpt' }
    };
  }
};
