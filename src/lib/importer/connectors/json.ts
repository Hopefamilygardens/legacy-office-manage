import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsText, validateExtension } from '../utils';

// Handles generic JSON files. The raw JSON is sent to n8n, which uses
// a flexible extraction strategy based on the detected structure.
export const jsonConnector: ImportConnector = {
  source_type: 'json',
  display_name: 'JSON',
  description: 'Import knowledge from any JSON file. n8n detects the structure and extracts relevant data.',
  icon: '{ }',
  accepts_file: true,
  file_extensions: ['.json'],
  accepts_text: true,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    const now = new Date().toISOString();

    if (input.text && !input.file) {
      // Validate that pasted text is parseable JSON before submitting.
      try {
        JSON.parse(input.text);
      } catch {
        throw new Error('Pasted content is not valid JSON.');
      }
      return {
        source_type: 'json',
        source_reference: 'json:pasted',
        source_timestamp: now,
        content_type: 'structured',
        content: input.text,
        metadata: { format: 'json', connector: 'json', input_method: 'text' }
      };
    }

    if (!input.file) throw new Error('JSON connector requires a file or pasted JSON.');
    const file = input.file;
    const err = validateExtension(file, ['.json']);
    if (err) throw new Error(err);

    const text = await readFileAsText(file);
    // Validate JSON before sending.
    try {
      JSON.parse(text);
    } catch {
      throw new Error('File does not contain valid JSON: ' + file.name);
    }

    return {
      source_type: 'json',
      source_reference: `json:${file.name}`,
      source_timestamp: now,
      content_type: 'structured',
      content: text,
      original_file_name: file.name,
      metadata: { format: 'json', connector: 'json', input_method: 'file' }
    };
  }
};
