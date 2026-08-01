import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsText, validateExtension } from '../utils';

// Handles email export files in EML (single message) or MBOX (mailbox) format.
// The raw text is sent to n8n, which parses headers, threads, and body content.
export const emailConnector: ImportConnector = {
  source_type: 'email-export',
  display_name: 'Email Export',
  description: 'Import knowledge from email exports. Accepts .eml (single message) or .mbox (mailbox) files.',
  icon: '✉️',
  accepts_file: true,
  file_extensions: ['.eml', '.mbox'],
  accepts_text: false,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    if (!input.file) throw new Error('Email connector requires a file.');
    const file = input.file;
    const lower = file.name.toLowerCase();
    const err = validateExtension(file, ['.eml', '.mbox']);
    if (err) throw new Error(err);

    const text = await readFileAsText(file);
    const format = lower.endsWith('.mbox') ? 'mbox' : 'eml';

    return {
      source_type: 'email-export',
      source_reference: `email-export:${file.name}`,
      source_timestamp: new Date().toISOString(),
      content_type: 'text',
      content: text,
      original_file_name: file.name,
      metadata: { format, connector: 'email' }
    };
  }
};
