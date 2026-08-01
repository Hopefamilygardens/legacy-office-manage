import JSZip from 'jszip';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ImportJob, KnowledgeType, PreparedImport, ProposedBrainUpdate } from '$lib/importer/types';

const JOB_PREFIX = 'local-chatgpt-';
const TARGET_BRAIN_PATH = 'brain/operations/IMPORTED_CHATGPT_KNOWLEDGE.md';
const BRAIN_ROOT = path.resolve(process.cwd(), 'brain');

interface ExtractedKnowledge {
  id: string;
  type: KnowledgeType;
  content: string;
  sourceReference: string;
  sourceTimestamp?: string;
  flaggedForReview: boolean;
  flagReason?: string;
}

interface BrainIndex {
  filePath: string;
  normalizedContent: string;
}

type ChatGptMessageContent = { parts?: string[]; text?: string } | string | undefined;

interface ChatGptConversation {
  id?: string;
  title?: string;
  create_time?: number | string;
  update_time?: number | string;
  mapping?: Record<string, { message?: { author?: { role?: string }; content?: ChatGptMessageContent; create_time?: number | string } }>;
}

export function isLocalChatGptJob(jobId: string): boolean {
  return jobId.startsWith(JOB_PREFIX);
}

export function createChatGptJob(prepared: PreparedImport): Promise<ImportJob> {
  return buildJob(prepared);
}

export async function commitApprovedUpdates(job: ImportJob): Promise<number> {
  const approved = job.proposed_updates.filter((u) => u.reviewer_decision === 'approved');
  if (approved.length === 0) return 0;

  const fullPath = path.resolve(process.cwd(), TARGET_BRAIN_PATH);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });

  const createdAt = new Date().toISOString();
  const lines: string[] = [];
  lines.push('');
  lines.push(`## ChatGPT Import ${createdAt}`);
  lines.push('');
  lines.push(`- Job ID: ${job.id}`);
  lines.push(`- Source File: ${job.source_file_name}`);
  lines.push(`- Source Reference: ${job.source_reference}`);
  lines.push('');

  for (const update of approved) {
    const item = update.knowledge_item;
    lines.push(`### ${item.type.toUpperCase()} — ${item.id}`);
    lines.push('');
    lines.push(item.content);
    lines.push('');
    lines.push(`- Source: ${item.source_reference}`);
    if (item.source_timestamp) lines.push(`- Source Timestamp: ${item.source_timestamp}`);
    if (item.flagged_for_review) {
      lines.push(`- Flagged: yes${item.flag_reason ? ` (${item.flag_reason})` : ''}`);
    }
    lines.push('');
  }

  await fs.appendFile(fullPath, lines.join('\n'), 'utf8');
  return approved.length;
}

async function buildJob(prepared: PreparedImport): Promise<ImportJob> {
  const jobId = `${JOB_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  const sourceFile = prepared.original_file_name ?? 'chatgpt-export';

  const rawText = await resolveConversationJson(prepared);
  const conversations = parseConversations(rawText);
  const extracted = extractKnowledge(conversations, prepared.source_reference);
  const brainIndex = await readBrainIndex();
  const proposed = compareWithBrain(jobId, extracted, brainIndex);

  return {
    id: jobId,
    source_type: 'chatgpt-export',
    source_file_name: sourceFile,
    source_reference: prepared.source_reference,
    submitted_at: now,
    updated_at: now,
    stage: 'pending-approval',
    stage_message: `Parsed ${conversations.length} conversations and generated ${proposed.length} proposed update${proposed.length === 1 ? '' : 's'}.`,
    proposed_updates: proposed
  };
}

async function resolveConversationJson(prepared: PreparedImport): Promise<string> {
  if (prepared.content_type === 'structured' && prepared.content) {
    return prepared.content;
  }

  if (prepared.content_type === 'binary' && prepared.content_base64) {
    const zip = await JSZip.loadAsync(Buffer.from(prepared.content_base64, 'base64'));
    const fileName = Object.keys(zip.files).find((name) => name.toLowerCase().endsWith('conversations.json'));
    if (!fileName) throw new Error('ChatGPT export ZIP is missing conversations.json.');
    return zip.files[fileName].async('text');
  }

  throw new Error('ChatGPT import payload is missing content.');
}

function parseConversations(raw: string): ChatGptConversation[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('ChatGPT export does not contain valid JSON.');
  }
  if (!Array.isArray(parsed)) throw new Error('Expected ChatGPT conversations JSON to be an array.');
  return parsed as ChatGptConversation[];
}

function extractKnowledge(conversations: ChatGptConversation[], sourceReference: string): ExtractedKnowledge[] {
  const items: ExtractedKnowledge[] = [];
  const seen = new Set<string>();

  for (const convo of conversations) {
    const conversationId = convo.id ?? `conversation-${items.length + 1}`;
    const timestamp = normalizeTimestamp(convo.update_time ?? convo.create_time);
    const lines = extractConversationLines(convo);

    for (const line of lines) {
      const normalized = normalizeText(line);
      if (!normalized || seen.has(normalized) || normalized.length < 24) continue;
      seen.add(normalized);

      const type = classifyKnowledgeType(line);
      const content = convo.title ? `[${convo.title}] ${line}` : line;
      items.push({
        id: `${conversationId}-${items.length + 1}`,
        type,
        content,
        sourceReference: `${sourceReference}#${conversationId}`,
        sourceTimestamp: timestamp,
        flaggedForReview: type === 'unknown',
        flagReason: type === 'unknown' ? 'Unable to confidently classify this knowledge item.' : undefined
      });

      if (items.length >= 200) return items;
    }
  }

  return items;
}

function extractConversationLines(convo: ChatGptConversation): string[] {
  const mapping = convo.mapping ?? {};
  const nodes = Object.values(mapping)
    .map((entry) => entry.message)
    .filter((message): message is NonNullable<typeof message> => Boolean(message));

  nodes.sort((a, b) => toUnixSeconds(a.create_time) - toUnixSeconds(b.create_time));

  const lines: string[] = [];
  for (const message of nodes) {
    const role = message.author?.role;
    if (role !== 'assistant' && role !== 'user') continue;

    const value = extractMessageText(message.content);
    if (!value) continue;

    for (const part of value.split(/\n+/)) {
      const trimmed = part.trim().replace(/^[-*]\s+/, '');
      if (trimmed.length >= 24 && !trimmed.startsWith('```')) lines.push(trimmed);
    }
  }

  return lines;
}

function extractMessageText(content: ChatGptMessageContent): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content.parts)) return content.parts.filter((part): part is string => typeof part === 'string').join('\n');
  if (typeof content.text === 'string') return content.text;
  return '';
}

function classifyKnowledgeType(text: string): KnowledgeType {
  const lower = text.toLowerCase();
  if (/(we decided|decision|approved|agreed|final choice|resolved)/.test(lower)) return 'decision';
  if (/(step|process|procedure|workflow|how to|checklist|runbook)/.test(lower)) return 'process';
  if (/(policy|rule|must|compliance|requirement)/.test(lower)) return 'policy';
  if (/(prefer|preference|usually|tend to)/.test(lower)) return 'preference';
  if (/(project|milestone|deadline|roadmap)/.test(lower)) return 'project';
  if (/(contact|email|phone|reach|stakeholder)/.test(lower)) return 'contact';
  if (lower.length >= 30) return 'fact';
  return 'unknown';
}

async function readBrainIndex(): Promise<BrainIndex[]> {
  const files = await listMarkdownFiles(BRAIN_ROOT);
  const out: BrainIndex[] = [];
  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    out.push({
      filePath: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
      normalizedContent: normalizeText(content)
    });
  }
  return out;
}

async function listMarkdownFiles(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(full)));
      continue;
    }
    if (entry.isFile() && full.toLowerCase().endsWith('.md')) files.push(full);
  }

  return files;
}

function compareWithBrain(jobId: string, items: ExtractedKnowledge[], brainIndex: BrainIndex[]): ProposedBrainUpdate[] {
  const updates: ProposedBrainUpdate[] = [];

  for (const item of items) {
    const normalized = normalizeText(item.content);
    if (!normalized) continue;

    const duplicate = brainIndex.find((brain) => normalized.length > 0 && brain.normalizedContent.includes(normalized));
    const action: ProposedBrainUpdate['action'] = duplicate ? 'flag' : 'add';

    updates.push({
      id: `${jobId}-update-${updates.length + 1}`,
      job_id: jobId,
      action,
      target_brain_path: TARGET_BRAIN_PATH,
      knowledge_item: {
        id: item.id,
        type: item.type,
        content: item.content,
        source_type: 'chatgpt-export',
        source_reference: item.sourceReference,
        source_timestamp: item.sourceTimestamp,
        flagged_for_review: item.flaggedForReview || Boolean(duplicate),
        flag_reason: item.flagReason ?? (duplicate ? 'Potential duplicate found in existing Brain content.' : undefined)
      },
      duplicate_of: duplicate?.filePath,
      reviewer_decision: 'pending'
    });
  }

  return updates;
}

function normalizeTimestamp(value: number | string | undefined): string | undefined {
  if (value == null) return undefined;
  const unix = toUnixSeconds(value);
  if (!Number.isFinite(unix) || unix <= 0) return undefined;
  return new Date(unix * 1000).toISOString();
}

function toUnixSeconds(value: number | string | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 1_000_000_000_000 ? value / 1000 : value;
  }
  if (typeof value === 'string' && value.trim()) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric > 1_000_000_000_000 ? numeric / 1000 : numeric;
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return parsed / 1000;
  }
  return 0;
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
