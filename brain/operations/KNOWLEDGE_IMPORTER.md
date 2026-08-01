# Universal Knowledge Importer

**Status:** Framework implemented — connectors pending production n8n pipeline wiring  
**Constitutional authority:** Legacy OS AI Operating Constitution v1.0  
**Purpose:** Ingest organizational knowledge from external sources into the Legacy Brain with human supervision at every step

---

## Overview

The Universal Knowledge Importer is a production-ready framework for converting external documents, AI conversation exports, workflow exports, and data files into verified Brain knowledge entries.

No knowledge is written to the Brain automatically. Every import passes through a defined pipeline and ends with explicit human approval before any Brain modification occurs.

---

## The Pipeline

Every import — regardless of source type — follows this sequence without exception:

```
Import → Parse → Classify → Extract Knowledge → Compare with Brain
→ Detect Duplicates → Generate Proposed Updates → Human Approval → Commit to Brain
```

| Stage | What Happens | Where |
|---|---|---|
| **Import** | User selects source and uploads file or provides text | Browser |
| **Parse** | Raw content is extracted from the source format | n8n |
| **Classify** | Each item is categorized by knowledge type | n8n (AI) |
| **Extract Knowledge** | Discrete knowledge items are identified and isolated | n8n (AI) |
| **Compare with Brain** | Items are checked against existing Brain content | n8n |
| **Detect Duplicates** | Near-duplicate Brain entries are identified | n8n |
| **Generate Proposed Updates** | A structured list of proposed Brain changes is produced | n8n |
| **Human Approval** | Owner reviews and approves or rejects each proposed update | Browser |
| **Commit to Brain** | Approved updates are written to the Brain | n8n |

---

## Constitutional Rules

The following rules are non-negotiable and implemented in both the frontend and the n8n pipeline:

1. **Never overwrite Brain knowledge automatically.** All proposed updates require explicit human approval.
2. **Preserve source references.** Every knowledge item permanently records its origin.
3. **Preserve timestamps.** Original creation dates and import timestamps are maintained.
4. **Preserve original files.** Source files are referenced by name; they are not destroyed.
5. **Never duplicate existing knowledge.** Duplicate detection runs before any proposal is shown.
6. **Never invent information.** The AI may only extract what is present; it may not fabricate.
7. **Flag unknowns.** Any item the system cannot classify with high confidence is flagged for human review.

---

## Supported Source Types

| Source Type | Status | Accepted File Types | Notes |
|---|---|---|---|
| ChatGPT Export | Available | `.json`, `.zip` | OpenAI data export format |
| Gemini Export | Available | `.json` | Google AI Takeout format |
| Microsoft Copilot Export | Available | `.json`, `.docx` | Microsoft 365 export format |
| n8n Workflow Export | Available | `.json` | n8n workflow JSON |
| PDF | Available | `.pdf` | Any PDF document |
| DOCX | Available | `.docx` | Microsoft Word document |
| XLSX | Available | `.xlsx` | Microsoft Excel spreadsheet |
| CSV | Available | `.csv` | Comma-separated values |
| JSON | Available | `.json` | Generic JSON data |
| Email Export | Available | `.eml`, `.mbox` | Single message or mailbox export |
| Voice Transcript | Available | `.txt`, `.vtt`, `.srt` | Manual or auto-generated transcripts |
| Images | Future | — | Planned; requires vision pipeline in n8n |
| Additional Connectors | Future | — | Register in `connectors/registry.ts` |

---

## Architecture

The importer is built on three layers that observe the Constitutional principle "Frontend presents. Backend thinks."

### Layer 1 — Connector (Browser)

Location: `src/lib/importer/connectors/`

Each source type has a dedicated connector implementing the `ImportConnector` interface. The connector's responsibility is limited to browser-side work:
- Accept user file upload or text input
- Validate the input format
- Normalize and encode the content (`text`, `structured`, or `binary`/base64)
- Produce a `PreparedImport` object ready for the pipeline

**Adding a new connector:**
1. Create `src/lib/importer/connectors/<name>.ts`
2. Implement the `ImportConnector` interface from `src/lib/importer/connector.ts`
3. Register the connector instance in `src/lib/importer/connectors/registry.ts`

### Layer 2 — Import Engine (Browser Coordination)

Location: `src/lib/importer/engine.ts`

The `ImportEngine` class is the single entry point for all import operations in the application. It:
- Maintains the connector registry
- Delegates browser-side preparation to the appropriate connector
- Submits prepared imports to n8n via the importer API
- Retrieves pipeline status and proposed updates
- Submits human approval and rejection decisions
- Triggers final commit of approved updates to the Brain

### Layer 3 — n8n Pipeline (Backend Intelligence)

All parsing, classification, knowledge extraction, Brain comparison, duplicate detection, and commit operations live in n8n per the Constitutional principle "Frontend presents. Backend thinks."

---

## n8n Endpoints Required

The following n8n webhooks must be created to activate this system:

| Endpoint path | Method | Purpose |
|---|---|---|
| `/legacy-os-import-submit` | POST | Receive a `PreparedImport`, start the pipeline, return an `ImportJob` |
| `/legacy-os-import-status` | GET | Return the current `ImportJob` state including proposed updates |
| `/legacy-os-import-approve` | POST | Record approve/reject decision for one or all proposed updates |
| `/legacy-os-import-commit` | POST | Write all approved updates to the Brain and mark job committed |

---

## Frontend

The import interface is available at `/import` in the Legacy Office Manager.

It provides:
1. **Source selector** — Visual grid of connector cards; unavailable connectors are visibly disabled
2. **Input panel** — File upload area or text paste field depending on connector
3. **Pipeline tracker** — Live stage-by-stage progress visualization
4. **Approval queue** — Each proposed Brain update shown with approve/reject controls
5. **Mass approve** — Approve all pending updates at once
6. **Commit** — Final confirmation before Brain write

---

## TypeScript Module Index

| File | Purpose |
|---|---|
| `src/lib/importer/types.ts` | All shared TypeScript types |
| `src/lib/importer/connector.ts` | `ImportConnector` interface definition |
| `src/lib/importer/utils.ts` | Shared browser file-reading utilities |
| `src/lib/importer/connectors/*.ts` | One file per source type |
| `src/lib/importer/connectors/registry.ts` | Connector registry; edit to add new connectors |
| `src/lib/importer/engine.ts` | `ImportEngine` class |
| `src/lib/importer/api.ts` | n8n API calls for the import pipeline |
| `src/lib/importer/index.ts` | Barrel exports |

---

## Constitutional Compliance

| Constitutional Principle | Compliance |
|---|---|
| AI Prepares. Humans Decide. | No Brain write without explicit human approval |
| One Source of Truth, Many Views | Knowledge committed to Brain only; source files preserved as references |
| Reduce Cognitive Load | Pipeline surfaces what requires attention; owner reviews, not reconstructs |
| Preserve Organizational Knowledge | Source files, references, and timestamps permanently preserved |
| Read Before Write | Engine reads existing Brain content before proposing any update |
| Never Invent Information | AI extraction only; fabrication rules enforced in n8n prompt engineering |
