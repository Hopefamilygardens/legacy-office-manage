// Shared browser-side utilities for reading files in connectors.

// Read a File as UTF-8 text.
export function readFileAsText(file: File): Promise<string> {
  return file.text();
}

// Read a File as a base64-encoded string (without data URL prefix).
// Used for binary formats like PDF, DOCX, and XLSX that n8n must parse.
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Strip the "data:<mime>;base64," prefix — send only the raw base64.
      const comma = dataUrl.indexOf(',');
      resolve(comma !== -1 ? dataUrl.slice(comma + 1) : dataUrl);
    };
    reader.onerror = () => reject(new Error('Failed to read file: ' + file.name));
    reader.readAsDataURL(file);
  });
}

// Validate that the file has one of the expected extensions.
// Returns a user-facing error message, or null if valid.
export function validateExtension(file: File, extensions: string[]): string | null {
  const lower = file.name.toLowerCase();
  const match = extensions.some((ext) => lower.endsWith(ext));
  if (!match) {
    return `Unsupported file type. Expected: ${extensions.join(', ')}`;
  }
  return null;
}

// Generate a source reference string from a connector name and file name.
export function buildSourceReference(connectorName: string, fileName: string): string {
  return `${connectorName}:${fileName}`;
}
