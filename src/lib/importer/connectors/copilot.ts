import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsText, readFileAsBase64, validateExtension } from '../utils';

// Handles Microsoft Copilot (Microsoft 365) conversation and content exports.
// JSON format: Copilot conversation history export
// DOCX format: Copilot-generated document exports
export const copilotConnector: ImportConnector = {
  source_type: 'copilot-export',
  display_name: 'Microsoft Copilot Export',
  description: 'Import conversations or documents from a Microsoft Copilot export (.json or .docx).',
  icon: '🪟',
  accepts_file: true,
  file_extensions: ['.json', '.docx'],
  accepts_text: false,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    if (!input.file) throw new Error('Microsoft Copilot connector requires a file.');
    const file = input.file;
    const err = validateExtension(file, ['.json', '.docx']);
    if (err) throw new Error(err);

    const now = new Date().toISOString();

    if (file.name.toLowerCase().endsWith('.docx')) {
      const base64 = await readFileAsBase64(file);
      return {
        source_type: 'copilot-export',
        source_reference: `copilot-export:${file.name}`,
        source_timestamp: now,
        content_type: 'binary',
        content_base64: base64,
        original_file_name: file.name,
        metadata: { format: 'docx', connector: 'copilot' }
      };
    }

    const text = await readFileAsText(file);
    return {
      source_type: 'copilot-export',
      source_reference: `copilot-export:${file.name}`,
      source_timestamp: now,
      content_type: 'structured',
      content: text,
      original_file_name: file.name,
      metadata: { format: 'json', connector: 'copilot' }
    };
  }
};
