import type { ImportConnector } from '../connector';
import type { ConnectorInput, PreparedImport } from '../types';
import { readFileAsBase64, validateExtension } from '../utils';

// Handles Microsoft Excel XLSX files. The file is sent as base64 to n8n,
// which uses a spreadsheet parsing node to extract rows and sheet data.
export const xlsxConnector: ImportConnector = {
  source_type: 'xlsx',
  display_name: 'XLSX (Excel)',
  description: 'Import knowledge from a Microsoft Excel spreadsheet. n8n extracts rows from all sheets.',
  icon: '📊',
  accepts_file: true,
  file_extensions: ['.xlsx'],
  accepts_text: false,
  is_available: true,

  async prepare(input: ConnectorInput): Promise<PreparedImport> {
    if (!input.file) throw new Error('XLSX connector requires a file.');
    const file = input.file;
    const err = validateExtension(file, ['.xlsx']);
    if (err) throw new Error(err);

    const base64 = await readFileAsBase64(file);
    return {
      source_type: 'xlsx',
      source_reference: `xlsx:${file.name}`,
      source_timestamp: new Date().toISOString(),
      content_type: 'binary',
      content_base64: base64,
      original_file_name: file.name,
      metadata: {
        format: 'xlsx',
        connector: 'xlsx',
        file_size_bytes: String(file.size)
      }
    };
  }
};
