import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsBase64, validateExtension } from '../utils';

// Handles PDF documents. The file is sent as base64 to n8n, which uses a
// PDF parsing node to extract text before passing to the knowledge pipeline.
export const pdfConnector: ImportConnector = {
  source_type: 'pdf',
  display_name: 'PDF',
  description: 'Import knowledge from any PDF document. n8n extracts text and feeds it through the knowledge pipeline.',
  icon: '📄',
  accepts_file: true,
  file_extensions: ['.pdf'],
  accepts_text: false,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    if (!input.file) throw new Error('PDF connector requires a file.');
    const file = input.file;
    const err = validateExtension(file, ['.pdf']);
    if (err) throw new Error(err);

    const base64 = await readFileAsBase64(file);
    return {
      source_type: 'pdf',
      source_reference: `pdf:${file.name}`,
      source_timestamp: new Date().toISOString(),
      content_type: 'binary',
      content_base64: base64,
      original_file_name: file.name,
      metadata: {
        format: 'pdf',
        connector: 'pdf',
        file_size_bytes: String(file.size)
      }
    };
  }
};
