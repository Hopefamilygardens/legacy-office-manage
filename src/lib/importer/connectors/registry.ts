import type { ImportConnector } from '../connector';
import type { SourceType } from '../types';
import { chatgptConnector } from './chatgpt';
import { geminiConnector } from './gemini';
import { copilotConnector } from './copilot';
import { n8nConnector } from './n8n';
import { pdfConnector } from './pdf';
import { docxConnector } from './docx';
import { xlsxConnector } from './xlsx';
import { csvConnector } from './csv';
import { jsonConnector } from './json';
import { emailConnector } from './email';
import { voiceTranscriptConnector } from './voice';

// Future connector placeholder shape — used to show "coming soon" cards in the UI.
interface FutureConnector {
  source_type: SourceType;
  display_name: string;
  description: string;
  icon: string;
  is_available: false;
  unavailable_reason: string;
}

export const FUTURE_CONNECTORS: FutureConnector[] = [
  {
    source_type: 'image',
    display_name: 'Images',
    description: 'Import knowledge from images, diagrams, and scanned documents. Requires vision pipeline in n8n.',
    icon: '🖼️',
    is_available: false,
    unavailable_reason: 'Requires vision pipeline in n8n (planned)'
  }
];

// ─── Registry ─────────────────────────────────────────────────────────────────

// All production-ready connectors registered in order of UI appearance.
// To register a new connector: import it above and add it to this array.
const REGISTERED_CONNECTORS: ImportConnector[] = [
  chatgptConnector,
  geminiConnector,
  copilotConnector,
  n8nConnector,
  pdfConnector,
  docxConnector,
  xlsxConnector,
  csvConnector,
  jsonConnector,
  emailConnector,
  voiceTranscriptConnector
];

export class ConnectorRegistry {
  private readonly connectors: Map<SourceType, ImportConnector>;

  constructor(connectors: ImportConnector[]) {
    this.connectors = new Map(connectors.map((c) => [c.source_type, c]));
  }

  get(sourceType: SourceType): ImportConnector | undefined {
    return this.connectors.get(sourceType);
  }

  getAll(): ImportConnector[] {
    return Array.from(this.connectors.values());
  }

  getAvailable(): ImportConnector[] {
    return this.getAll().filter((c) => c.is_available);
  }
}

// Singleton registry used throughout the application.
export const connectorRegistry = new ConnectorRegistry(REGISTERED_CONNECTORS);
