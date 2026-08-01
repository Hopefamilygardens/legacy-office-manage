import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsBase64, validateExtension } from '../utils';

// Handles Microsoft Word DOCX files. The file is sent as base64 to n8n,
// which uses a DOCX-to-text extraction node before the knowledge pipeline.
export const docxConnector: ImportConnector = {
  source_type: 'docx',
  display_name: 'DOCX (Word)',
  description: 'Import knowledge from a Microsoft Word document. n8n extracts the document text.',
  icon: '📝',
  accepts_file: true,
  file_extensions: ['.docx'],
  accepts_text: false,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    if (!input.file) throw new Error('DOCX connector requires a file.');
    const file = input.file;
    const err = validateExtension(file, ['.docx']);
    if (err) throw new Error(err);

    const base64 = await readFileAsBase64(file);
    return {
      source_type: 'docx',
      source_reference: `docx:${file.name}`,
      source_timestamp: new Date().toISOString(),
      content_type: 'binary',
      content_base64: base64,
      original_file_name: file.name,
      metadata: {
        format: 'docx',
        connector: 'docx',
        file_size_bytes: String(file.size)
      }
    };
  }
};
