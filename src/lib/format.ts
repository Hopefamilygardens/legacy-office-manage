// Presentation-only text helpers. No business logic here.
// The n8n backend sometimes returns Markdown-flavored text (###, **, lists).
// The UI must show clean, human-readable text with no visible Markdown symbols.

// Strip common Markdown symbols from a single string, leaving readable text.
export function stripMarkdown(input: unknown): string {
  if (input == null) return '';
  let s = typeof input === 'string' ? input : String(input);
  // Remove code fences and inline backticks.
  s = s.replace(/```[a-zA-Z]*\n?/g, '').replace(/`+/g, '');
  // Strip heading hashes at line starts (### Title -> Title).
  s = s.replace(/^\s{0,3}#{1,6}\s*/gm, '');
  // Bold / italic markers (**text**, __text__, *text*, _text_).
  s = s.replace(/\*\*(.*?)\*\*/g, '$1');
  s = s.replace(/__(.*?)__/g, '$1');
  s = s.replace(/\*(.*?)\*/g, '$1');
  s = s.replace(/(^|\s)_(.*?)_(\s|$)/g, '$1$2$3');
  // Markdown links [label](url) -> label.
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  // Blockquote markers and stray list bullets used inline.
  s = s.replace(/^\s{0,3}>\s?/gm, '');
  // Horizontal rules.
  s = s.replace(/^\s*([-*_])\1{2,}\s*$/gm, '');
  // Collapse 3+ blank lines.
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

export interface Paragraph {
  kind: 'text' | 'bullet';
  text: string;
}

// Turn a Markdown-ish summary string into clean paragraphs and bullet lines
// for structured rendering (no raw ### or ** reaching the DOM).
export function toParagraphs(input: unknown): Paragraph[] {
  const clean = stripMarkdown(input);
  if (!clean) return [];
  const lines = clean.split('\n');
  const out: Paragraph[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const bullet = line.match(/^[-*•]\s+(.*)$/) || line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet) {
      out.push({ kind: 'bullet', text: bullet[1].trim() });
    } else {
      out.push({ kind: 'text', text: line });
    }
  }
  return out;
}

// Best-effort human label for an arbitrary brief/action item.
export function itemLabel(item: unknown): string {
  if (item == null) return '';
  if (typeof item === 'string') return stripMarkdown(item);
  const o = item as Record<string, unknown>;
  const candidate =
    o.title || o.name || o.subject || o.summary || o.label || o.description || o.action || o.text;
  if (typeof candidate === 'string') return stripMarkdown(candidate);
  return stripMarkdown(JSON.stringify(item));
}

// Secondary detail line for an item, when present.
export function itemDetail(item: unknown): string {
  if (item == null || typeof item !== 'object') return '';
  const o = item as Record<string, unknown>;
  const candidate = o.detail || o.due || o.due_date || o.from || o.status || o.priority || o.when;
  if (typeof candidate === 'string') return stripMarkdown(candidate);
  return '';
}
