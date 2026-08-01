import type { SourceType, ConnectorInput, PreparedImport } from './types';

// The interface every source-type connector must implement.
//
// To add a new connector:
//   1. Create src/lib/importer/connectors/<name>.ts
//   2. Export a const that satisfies ImportConnector
//   3. Register it in src/lib/importer/connectors/registry.ts
export interface ImportConnector {
  readonly source_type: SourceType;
  readonly display_name: string;
  readonly description: string;
  // Emoji or short identifier displayed on the connector card.
  readonly icon: string;
  readonly accepts_file: boolean;
  // Extensions the file picker should accept, e.g. ['.json', '.zip'].
  readonly file_extensions: string[];
  // True when raw text paste is a valid input for this connector.
  readonly accepts_text: boolean;
  // False for planned but not-yet-implemented connectors.
  readonly is_available: boolean;
  readonly unavailable_reason?: string;

  // Reads the raw input in the browser and returns a normalized PreparedImport.
  // Must not contact n8n or any external service.
  // Must throw a descriptive Error if the input cannot be prepared.
  prepare(input: ConnectorInput): Promise<PreparedImport>;
}
