# Current-State Systems Discovery — Legacy OS

> **Status:** Complete discovery snapshot as of 2026-08-01.
> **Scope:** Everything observable inside this repository only. Nothing is inferred from external systems.
> **Authority:** Read-only analysis. No integrations were built or modified.

---

## How to Read This Document

Each section follows this template:

| Field | Meaning |
|---|---|
| **Name** | System or process identifier |
| **Purpose** | What it is meant to do |
| **Evidence** | File locations with direct repository citations |
| **Status** | `implemented` · `partial` · `planned` · `referenced only` · `unknown` |
| **Inputs** | Data or events that flow in |
| **Outputs** | Data or events that flow out |
| **Data stored / accessed** | Persistence layer, if any |
| **Authority / approval** | Who must approve changes or actions |
| **Dependencies** | What it relies on |
| **Known gaps / risks** | Gaps, unknowns, or concerns visible from repository evidence |

---

## Part 1 — Systems Found in Repository

---

### 1. Legacy Office Manager PWA (Frontend Application)

| Field | Detail |
|---|---|
| **Name** | Legacy Office Manager PWA |
| **Purpose** | Progressive Web App UI for the owner (Dustin Hope) to manage daily operations — morning brief, AI Q&A, navigation to nine product sections. Described as "Your AI Office Employee." |
| **Evidence** | `README.md`, `package.json`, `src/app.html`, `src/routes/+layout.svelte`, `static/manifest.webmanifest`, `src/service-worker.ts`, `src/app.css` |
| **Status** | **partial** — Command Center is functional; all other nine section routes render a `SectionPlaceholder` "coming online" message |
| **Inputs** | User text input (Ask Bar), voice recording (browser microphone), HTTP GET responses from n8n Daily Brief endpoint |
| **Outputs** | HTTP POST requests to n8n AI endpoint, HTTP POST (multipart/form-data) to n8n Voice endpoint, rendered UI |
| **Data stored / accessed** | Browser cache only (service worker caches static assets). No local database. No server-side session or auth store. |
| **Authority / approval** | Owner (Dustin Hope). No login/auth layer present in repo. |
| **Dependencies** | n8n cloud instance (`hope2026os.app.n8n.cloud`); browser `MediaRecorder` API for voice; Google Fonts CDN for Inter and Playfair Display |
| **Known gaps / risks** | No authentication or authorization layer; no `.env.example`; adapter-auto deployment target is unspecified; no CI/CD workflow present in `.github/workflows/`; PWA icons (`/icons/icon-192.png`, `/icons/icon-512.png`) referenced in manifest but not found in `static/` |

---

### 2. n8n Daily Brief Webhook

| Field | Detail |
|---|---|
| **Name** | n8n Daily Brief API (`/legacy-os-brief`) |
| **Purpose** | Assembles and returns a structured daily brief for the Command Center. Includes overdue tasks, tasks due today, pending approvals, leads requiring attention, communications summary, executive memory summary, calendar summary, suggested actions, and an AI-generated office manager summary. |
| **Evidence** | `src/lib/config.ts` (URL: `https://hope2026os.app.n8n.cloud/webhook/legacy-os-brief`), `src/lib/api.ts` (`fetchBrief()`), `src/lib/types.ts` (`BriefResponse` interface), `src/routes/+page.svelte` |
| **Status** | **referenced only** — endpoint URL is hardcoded; the n8n workflow itself lives outside this repository |
| **Inputs** | HTTP GET with `?view=command` query parameter |
| **Outputs** | JSON: `{ success, generated_at, daily_brief: { headlines, overdue_tasks, tasks_due_today, pending_approvals, leads_requiring_attention }, communications_summary, executive_memory_summary, calendar_summary, suggested_actions, office_manager_summary }` |
| **Data stored / accessed** | Unknown — all data storage and business logic live in the n8n cloud instance, not in this repo |
| **Authority / approval** | No auth token or API key present in frontend code; endpoint is unauthenticated from the frontend's perspective (as observed in repo) |
| **Dependencies** | n8n cloud; underlying data sources aggregated by n8n (tasks, calendar, leads, communications — specifics unknown from this repo) |
| **Known gaps / risks** | No authentication visible in the frontend call; error message in the UI says "the n8n backend may be waking up," suggesting it may be on a free/sleeping plan; no retry logic beyond a manual button; `executive_memory_summary` is typed in `BriefResponse` but never rendered in the UI |

---

### 3. n8n Office Manager AI Webhook

| Field | Detail |
|---|---|
| **Name** | n8n Office Manager AI (`/legacy-office-manager-ai`) |
| **Purpose** | Receives a natural-language question from the user and returns an AI-generated answer. The backend decides context and authorization (per comment in `api.ts`). |
| **Evidence** | `src/lib/config.ts` (URL: `https://hope2026os.app.n8n.cloud/webhook/legacy-office-manager-ai`), `src/lib/api.ts` (`askOfficeManager()`), `src/lib/types.ts` (`AiResponse` interface), `src/lib/components/AskBar.svelte` |
| **Status** | **referenced only** — endpoint URL hardcoded; workflow lives outside this repo |
| **Inputs** | HTTP POST JSON: `{ message, view, id, type, session_id }` |
| **Outputs** | JSON: `{ ok, answer, session_id }` |
| **Data stored / accessed** | Session ID (`web-ui` default) passed in payload; whether sessions are persisted is unknown from this repo |
| **Authority / approval** | Human-in-the-loop enforced by UI: voice → editable transcript → user reviews → user presses "Ask". Nothing is sent without user action. |
| **Dependencies** | n8n cloud; underlying AI model unknown from this repo (could be OpenAI, Gemini, or other — not determinable here) |
| **Known gaps / risks** | No authentication on the endpoint from the frontend; `id` and `type` fields are passed as empty strings by default; AI model identity is opaque |

---

### 4. n8n Voice Transcription Webhook

| Field | Detail |
|---|---|
| **Name** | n8n Voice Transcription (`/legacy-os-voice-transcribe`) |
| **Purpose** | Accepts a raw audio recording (webm or ogg) from the browser and returns a transcript. No transcription logic runs in the frontend. |
| **Evidence** | `src/lib/config.ts` (URL: `https://hope2026os.app.n8n.cloud/webhook/legacy-os-voice-transcribe`), `src/lib/voice.ts` (`transcribe()`), `src/lib/types.ts` (`VoiceResponse` interface), `src/lib/components/VoiceButton.svelte` |
| **Status** | **referenced only** — endpoint URL hardcoded; workflow lives outside this repo |
| **Inputs** | HTTP POST multipart/form-data: `audio` (Blob, `voice-note.webm` or `voice-note.ogg`), `view`, `session_id`, `client_ts` (ISO timestamp) |
| **Outputs** | JSON: `{ ok, transcript, message?, error_code? }` |
| **Data stored / accessed** | Unknown — audio data is sent to n8n and not retained in the browser after the request |
| **Authority / approval** | Browser requests microphone permission before recording starts; user must tap the button to record and again to stop |
| **Dependencies** | n8n cloud; browser `MediaRecorder` API; speech-to-text service behind n8n (unknown from this repo) |
| **Known gaps / risks** | Transcription service identity is opaque; no authentication on the upload; audio is sent in full to an external service |

---

### 5. Browser Service Worker / PWA Cache

| Field | Detail |
|---|---|
| **Name** | PWA Service Worker |
| **Purpose** | Caches all static build assets for offline-first load. On fetch, serves from cache if available, otherwise falls through to network. |
| **Evidence** | `src/service-worker.ts`, `static/manifest.webmanifest` |
| **Status** | **implemented** |
| **Inputs** | SvelteKit build assets (JS, CSS, HTML, images) at install time; GET requests at runtime |
| **Outputs** | Cached responses served to the browser |
| **Data stored / accessed** | Browser `CacheStorage` only; versioned cache keyed by SvelteKit build version |
| **Authority / approval** | No special approval required; standard browser API |
| **Dependencies** | Browser PWA support; SvelteKit build pipeline |
| **Known gaps / risks** | Cache-first strategy means stale content can persist until a new build invalidates the version key; no background sync or push notification wiring |

---

### 6. Legacy Brain (Organizational Knowledge Base)

| Field | Detail |
|---|---|
| **Name** | Legacy Brain (`brain/`) |
| **Purpose** | Single source of truth for decisions, standards, strategy, and institutional knowledge. Governed by the Constitution. |
| **Evidence** | `brain/README.md`, `brain/constitution/LEGACY_OS_CONSTITUTION.md`, all `brain/*/README.md` files |
| **Status** | **partial** — folder structure and README placeholders exist for all sections; Constitution is present but marked as a placeholder that "must be completed before this repository is used in production"; no content files exist in any section beyond READMEs |
| **Inputs** | Human contributions, agent-generated documentation |
| **Outputs** | Guidance for all agents and contributors |
| **Data stored / accessed** | Markdown files in Git |
| **Authority / approval** | Constitution governs; amendments require PR + human maintainer review + ADR in `brain/decisions/` |
| **Dependencies** | GitHub repository |
| **Known gaps / risks** | Constitution is a placeholder — no active governance is in force; `brain/decisions/`, `brain/governance/`, `brain/strategy/`, `brain/departments/`, `brain/projects/`, `brain/standards/`, `brain/knowledge/`, `brain/history/`, `brain/templates/`, `brain/archive/` all contain only stub READMEs |

---

### 7. GitHub Copilot Agent Configuration

| Field | Detail |
|---|---|
| **Name** | Copilot Agent Instructions |
| **Purpose** | Instructs GitHub Copilot agents working in this repo to read the Constitution first, follow read-before-write, and report changes transparently. |
| **Evidence** | `.github/copilot-instructions.md` |
| **Status** | **implemented** |
| **Inputs** | Copilot agent invocations |
| **Outputs** | Behavioral constraints on agent actions |
| **Data stored / accessed** | None |
| **Authority / approval** | Human maintainer (must not be changed silently per Constitution Article IV) |
| **Dependencies** | GitHub Copilot |
| **Known gaps / risks** | Instructions are minimal and do not encode domain-specific rules beyond pointing at the Constitution; no `.github/agents/` files accessible |

---

## Part 2 — UI Sections Present But Not Yet Connected

The following nine routes exist as `SectionPlaceholder` stubs. Their backend integrations are not defined in this repository.

| Route | Section Title | Status |
|---|---|---|
| `/leads` | Leads | Placeholder |
| `/projects` | Projects | Placeholder |
| `/schedule` | Schedule | Placeholder |
| `/estimate-requests` | Estimate Requests | Placeholder |
| `/daily-reports` | Daily Reports | Placeholder |
| `/employees` | Employees | Placeholder |
| `/customers` | Customers | Placeholder |
| `/documents` | Documents | Placeholder |
| `/settings` | Settings | Placeholder |

Each of these is implied to connect to the n8n backend once built, per the placeholder message: "being connected to the Legacy Office Manager backend."

---

## Part 3 — Systems Mentioned But Not Found in Repository

The following systems are implied by data structure, comments, or UI labels in this repo but have **no implementation evidence** here. They presumably exist in the n8n cloud instance or external services.

| System | Where Referenced | Implication |
|---|---|---|
| Email / Communications Reading | `BriefResponse.communications_summary` in `types.ts`; "Messages to Reply" in `+page.svelte` | n8n reads inbound email or messages and surfaces a count and items |
| Calendar Integration | `BriefResponse.calendar_summary` in `types.ts`; "Schedule" section in brief UI | n8n reads a calendar source (Google Calendar, Outlook, or other) |
| Task / Project Management | `BriefResponse.daily_brief.overdue_tasks`, `tasks_due_today`, `pending_approvals` | n8n reads from a task or project management system |
| Lead Management | `BriefResponse.daily_brief.leads_requiring_attention` | n8n reads from a CRM or leads store |
| Executive Memory | `BriefResponse.executive_memory_summary` (typed but not rendered in UI) | Some persistent memory store behind n8n |
| AI Language Model | `askOfficeManager()` returns natural-language answers | An LLM (OpenAI, Gemini, or other) is called by n8n; identity unknown from this repo |
| Speech-to-Text Service | `transcribe()` in `voice.ts` | An STT service is called by n8n; identity unknown from this repo |
| Gmail / Google Workspace | Not referenced by name | Plausible source for email/calendar given n8n's Google integrations, but not confirmed in repo |
| Microsoft 365 / Copilot | Not referenced anywhere | No evidence in repo |
| Gemini | Not referenced anywhere | No evidence in repo |
| OpenAI / Codex | Not referenced anywhere | No evidence in repo |
| Google Contacts | Not referenced anywhere | No evidence in repo |
| Database / CRM | Not referenced anywhere | Must exist as n8n data sources, but identity unknown |

---

## Part 4 — Duplicate or Overlapping Capabilities

| Overlap | Description |
|---|---|
| Voice → Text → AI | The voice pathway (record → transcribe via n8n → editable transcript → AI via n8n) and the text pathway (type → AI via n8n) converge at the same AI endpoint. The two input modes are distinct but the back-end processing is shared. No duplication in the frontend code. |
| `executive_memory_summary` vs `office_manager_summary` | Both are in `BriefResponse`. `office_manager_summary` is rendered as a `SummaryCard`. `executive_memory_summary` is typed but never consumed by the UI. Potential overlap or dead field. |
| `headlines` in `DailyBrief` | `daily_brief.headlines` is typed as `unknown[]` but never rendered in the Command Center. May duplicate information shown in the brief grid cards. |

---

## Part 5 — Unknowns Requiring Verification

| Unknown | Where to Look |
|---|---|
| Authentication model | Is the n8n webhook protected? Is there a token, shared secret, or IP allowlist? Not present in frontend code. Must check n8n workflow configuration. |
| AI model identity | Which LLM powers `/legacy-office-manager-ai`? Must check n8n workflow. |
| Speech-to-text provider | Which STT service powers `/legacy-os-voice-transcribe`? Must check n8n workflow. |
| Email source | Which email account or service is read for `communications_summary`? Must check n8n. |
| Calendar source | Which calendar service is read for `calendar_summary`? Must check n8n. |
| Task / project data source | Where are tasks, approvals, and project data stored? Must check n8n. |
| CRM / lead source | Where are leads stored? Must check n8n. |
| Deployment target | `@sveltejs/adapter-auto` is used; actual deployment platform (Vercel, Netlify, Cloudflare Pages, etc.) is unspecified. |
| PWA icons | `manifest.webmanifest` references `/icons/icon-192.png` and `/icons/icon-512.png`; these files do not exist in `static/`. App may fail to install as a PWA. |
| n8n plan and uptime | The UI error message "the n8n backend may be waking up" suggests the n8n instance may be on a plan that sleeps; this is a reliability risk. |
| `executive_memory_summary` purpose | Field is typed but never displayed. Is it intentionally hidden or was it forgotten? |
| Owner identity hardcoding | `ownerFirstName = 'Dustin'` is hardcoded in `+page.svelte` and `'DH'` / `'Dustin Hope'` in `+layout.svelte`. No auth/user context is fetched. |

---

## Part 6 — Proposed System Boundaries

Based solely on evidence in this repository, the following boundary model is proposed. This is descriptive, not prescriptive — it reflects what the code implies, not a recommended architecture.

```
┌─────────────────────────────────────────────────────────────────┐
│                      LEGACY BRAIN (brain/)                       │
│  Organizational knowledge, Constitution, governance, decisions.  │
│  Markdown files in Git. Governs agents and contributors.         │
└──────────────────────────────┬──────────────────────────────────┘
                               │ (read-before-write rule)
┌──────────────────────────────▼──────────────────────────────────┐
│              LEGACY OS APPLICATION (this repo / src/)            │
│  SvelteKit PWA. Renders UI. Captures voice and text.             │
│  Contains NO business logic. Calls n8n webhooks only.            │
│  Routes: Command Center (live) + 9 placeholder sections.         │
└──────────┬──────────────────────────────────────┬───────────────┘
           │ GET /legacy-os-brief                 │ POST /legacy-office-manager-ai
           │ POST /legacy-os-voice-transcribe     │
           ▼                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│         LEGACY OFFICE MANAGER ORCHESTRATOR (n8n Cloud)           │
│  hope2026os.app.n8n.cloud — all business logic lives here.       │
│  Workflows: Daily Brief assembly, AI Q&A routing,                │
│  Voice transcription, (implied) email / calendar / CRM reads.    │
└──────┬──────────────┬────────────────┬───────────────┬──────────┘
       │              │                │               │
       ▼              ▼                ▼               ▼
 ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
 │ AI / LLM │  │   STT    │  │ Calendar /   │  │  Tasks / CRM │
 │(unknown) │  │(unknown) │  │ Email source │  │  (unknown)   │
 └──────────┘  └──────────┘  │  (unknown)   │  └──────────────┘
                              └──────────────┘

 ┌─────────────────────────────────────────────────────────────────┐
 │              EXTERNAL AI / SERVICE PROVIDERS                     │
 │  (All behind n8n — identities unknown from this repo)           │
 │  Possibly: OpenAI, Gemini, Google STT, Google Calendar,         │
 │  Google Workspace, or Microsoft 365. None confirmed.            │
 └─────────────────────────────────────────────────────────────────┘
```

### Boundary Definitions

| Boundary | Responsibility |
|---|---|
| **Legacy Brain** | Organizational memory. All agents read it before acting. No runtime dependency on the app or n8n. |
| **Legacy OS Application** | Pure frontend. Renders data returned by n8n. Captures user input (voice, text). Enforces human-in-the-loop before sending to AI. No business logic. |
| **Legacy Office Manager Orchestrator (n8n)** | All automation, data aggregation, AI routing, and integration logic. The single backend. Not in this repo. |
| **External AI/Service Providers** | LLM, STT, calendar, email, CRM, etc. Consumed by n8n. Not directly accessible from the frontend. |

---

## Part 7 — Files Changed by This Report

| File | Action |
|---|---|
| `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md` | Created (this file) |

No application code was modified. No integrations were built or changed.

---

*Discovery performed by GitHub Copilot agent, 2026-08-01. All findings are based on repository evidence only.*
