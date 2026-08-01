// Universal Knowledge Importer — public API surface.
// Import from this module in application code.

export type {
  SourceType,
  PipelineStage,
  KnowledgeType,
  ReviewDecision,
  KnowledgeItem,
  ProposedBrainUpdate,
  ImportJob,
  ConnectorInput,
  PreparedImport,
  ImportSubmitResponse,
  ImportStatusResponse,
  ImportDecisionResponse
} from './types';

export { PIPELINE_STAGES, PIPELINE_STAGE_LABELS } from './types';
export type { ImportConnector } from './connector';
export { ImportEngine } from './engine';
export { connectorRegistry, ConnectorRegistry, FUTURE_CONNECTORS } from './connectors/registry';
