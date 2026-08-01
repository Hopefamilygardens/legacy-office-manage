import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsText, validateExtension } from '../utils';

// Handles n8n workflow export files.
// n8n exports workflows as JSON. The n8n pipeline will extract embedded
// business logic, decision nodes, and operational knowledge.
export const n8nConnector: ImportConnector = {
  source_type: 'n8n-workflow',
  display_name: 'n8n Workflow',
  description: 'Import knowledge embedded in n8n workflow exports (.json). Extracts business logic and decision patterns.',
  icon: '⚙️',
  accepts_file: true,
  file_extensions: ['.json'],
  accepts_text: true,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    const now = new Date().toISOString();

    if (input.text && !input.file) {
      return {
        source_type: 'n8n-workflow',
        source_reference: 'n8n-workflow:pasted',
        source_timestamp: now,
        content_type: 'structured',
        content: input.text,
        metadata: { format: 'json', connector: 'n8n', input_method: 'text' }
      };
    }

    if (!input.file) throw new Error('n8n connector requires a file or pasted JSON.');
    const file = input.file;
    const err = validateExtension(file, ['.json']);
    if (err) throw new Error(err);

    const text = await readFileAsText(file);
    return {
      source_type: 'n8n-workflow',
      source_reference: `n8n-workflow:${file.name}`,
      source_timestamp: now,
      content_type: 'structured',
      content: text,
      original_file_name: file.name,
      metadata: { format: 'json', connector: 'n8n', input_method: 'file' }
    };
  }
};
