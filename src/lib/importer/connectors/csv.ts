import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsText, validateExtension } from '../utils';

// Handles CSV files. The raw text is sent to n8n, which parses rows and
// maps column headers to knowledge structure.
export const csvConnector: ImportConnector = {
  source_type: 'csv',
  display_name: 'CSV',
  description: 'Import structured data from a CSV file. n8n maps rows to knowledge items.',
  icon: '📋',
  accepts_file: true,
  file_extensions: ['.csv'],
  accepts_text: true,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    const now = new Date().toISOString();

    if (input.text && !input.file) {
      return {
        source_type: 'csv',
        source_reference: 'csv:pasted',
        source_timestamp: now,
        content_type: 'text',
        content: input.text,
        metadata: { format: 'csv', connector: 'csv', input_method: 'text' }
      };
    }

    if (!input.file) throw new Error('CSV connector requires a file or pasted CSV text.');
    const file = input.file;
    const err = validateExtension(file, ['.csv']);
    if (err) throw new Error(err);

    const text = await readFileAsText(file);
    return {
      source_type: 'csv',
      source_reference: `csv:${file.name}`,
      source_timestamp: now,
      content_type: 'text',
      content: text,
      original_file_name: file.name,
      metadata: { format: 'csv', connector: 'csv', input_method: 'file' }
    };
  }
};
