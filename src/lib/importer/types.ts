// Universal Knowledge Importer — shared TypeScript types.
// These shapes are shared by connectors, the engine, the API layer, and the UI.

// ─── Source Types ────────────────────────────────────────────────────────────

export type SourceType =
  | 'chatgpt-export'
  | 'gemini-export'
  | 'copilot-export'
  | 'n8n-workflow'
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'csv'
  | 'json'
  | 'email-export'
  | 'voice-transcript'
  | 'image';

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export type PipelineStage =
  | 'import'
  | 'parse'
  | 'classify'
  | 'extract'
  | 'compare'
  | 'deduplicate'
  | 'propose'
  | 'pending-approval'
  | 'committed'
  | 'error';

export const PIPELINE_STAGES: PipelineStage[] = [
  'import',
  'parse',
  'classify',
  'extract',
  'compare',
  'deduplicate',
  'propose',
  'pending-approval',
  'committed'
];

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  import: 'Import',
  parse: 'Parse',
  classify: 'Classify',
  extract: 'Extract',
  compare: 'Compare',
  deduplicate: 'Deduplicate',
  propose: 'Propose',
  'pending-approval': 'Awaiting Approval',
  committed: 'Committed',
  error: 'Error'
};

// ─── Knowledge ────────────────────────────────────────────────────────────────

export type KnowledgeType =
  | 'decision'
  | 'fact'
  | 'process'
  | 'contact'
  | 'project'
  | 'policy'
  | 'preference'
  | 'unknown';

export type ReviewDecision = 'pending' | 'approved' | 'rejected';

// A single extracted knowledge item produced by the n8n Extract stage.
export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  content: string;
  source_type: SourceType;
  source_reference: string;
  source_timestamp?: string;
  flagged_for_review: boolean;
  flag_reason?: string;
}

// A proposed change to the Brain, awaiting human decision.
// Rule: never auto-commit. All updates require reviewer_decision === 'approved'.
export interface ProposedBrainUpdate {
  id: string;
  job_id: string;
  action: 'add' | 'flag';
  target_brain_path: string;
  knowledge_item: KnowledgeItem;
  // Populated when this item is a near-duplicate of an existing Brain entry.
  duplicate_of?: string;
  reviewer_decision: ReviewDecision;
  reviewer_notes?: string;
  reviewed_at?: string;
}

// ─── Import Job ───────────────────────────────────────────────────────────────

// An import job tracks one source document through the full pipeline.
export interface ImportJob {
  id: string;
  source_type: SourceType;
  source_file_name: string;
  source_reference: string;
  submitted_at: string;
  updated_at: string;
  stage: PipelineStage;
  stage_message?: string;
  proposed_updates: ProposedBrainUpdate[];
  error?: string;
}

// ─── Connector I/O ────────────────────────────────────────────────────────────

// Input provided by the user when starting an import.
export interface ConnectorInput {
  file?: File;
  url?: string;
  text?: string;
  metadata?: Record<string, string>;
}

// What a connector produces after browser-side normalization.
// This is the exact payload sent to the n8n import pipeline.
export interface PreparedImport {
  source_type: SourceType;
  source_reference: string;
  source_timestamp: string;
  // 'text' — plain text; 'structured' — JSON string; 'binary' — base64
  content_type: 'text' | 'structured' | 'binary';
  content?: string;
  content_base64?: string;
  original_file_name?: string;
  metadata: Record<string, string>;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ImportSubmitResponse {
  ok: boolean;
  job: ImportJob;
  error?: string;
}

export interface ImportStatusResponse {
  ok: boolean;
  job: ImportJob;
  error?: string;
}

export interface ImportDecisionResponse {
  ok: boolean;
  job?: ImportJob;
  error?: string;
}
