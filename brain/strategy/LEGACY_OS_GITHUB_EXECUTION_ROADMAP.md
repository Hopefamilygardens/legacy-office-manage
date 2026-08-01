# Legacy OS — GitHub Copilot Execution Roadmap

**Document type:** Strategy  
**Status:** Active — Awaiting Owner Review  
**Applies to:** GitHub Copilot agents, repository contributors, n8n backend owners, and any AI working within Legacy OS  
**Constitutional authority:** This document operates under and does not modify the Legacy OS AI Operating Constitution v1.0.  
**Brain authority:** This document does not replace any other Brain document. It records strategy for GitHub-based execution only.

---

## Notice on Missing Documents

The problem statement references three files that do not exist in this repository at the time this roadmap was written:

- `.github/copilot-instructions.md` — **does not exist**
- `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md` — **does not exist**

These gaps are recorded as blockers in Section 10. They must be created before agents can be given accurate standing instructions. All findings in this document are based exclusively on files that were read and verified in the repository.

---

## Section 1 — Current Verified Repository State

The following is a verified description of this repository based on direct file inspection. Claims in this section are facts, not assumptions.

### Repository Identity

- **Repository:** `Hopefamilygardens/legacy-office-manage`
- **Application name:** Legacy Office Manager
- **Owner:** Dustin Hope
- **Stack:** SvelteKit 4, TypeScript 5, Vite 5, PWA (service worker + web manifest)
- **Package name:** `legacy-office-manager` (version `0.0.1`, private)
- **Git history:** Two commits as of roadmap creation (`bffa370`, `76bb4da`)
- **Deployment adapter:** `@sveltejs/adapter-auto` (target environment unknown; not configured in this repository)

### Brain Structure (Verified)

| Path | Status |
|---|---|
| `brain/README.md` | Exists — defines Brain purpose and authority |
| `brain/constitution/LEGACY_OS_CONSTITUTION.md` | Exists — v1.0, full governing document (~653 lines) |
| `brain/strategy/` | Did not exist before this document was created |
| `brain/operations/` | Does not exist |

### Application Structure (Verified)

| Route | Status | Notes |
|---|---|---|
| `/` (Command Center) | Implemented | Fetches brief from n8n, AskBar, voice input, answer display |
| `/leads` | Placeholder | `SectionPlaceholder` component, no data |
| `/projects` | Placeholder | `SectionPlaceholder` component, no data |
| `/schedule` | Placeholder | `SectionPlaceholder` component, no data |
| `/estimate-requests` | Placeholder | `SectionPlaceholder` component, no data |
| `/daily-reports` | Placeholder | `SectionPlaceholder` component, no data |
| `/employees` | Placeholder | `SectionPlaceholder` component, no data |
| `/customers` | Placeholder | `SectionPlaceholder` component, no data |
| `/documents` | Placeholder | `SectionPlaceholder` component, no data |
| `/settings` | Placeholder | `SectionPlaceholder` component, no data |

### Source Modules (Verified)

| File | Purpose |
|---|---|
| `src/lib/config.ts` | n8n endpoint URLs (hardcoded, not environment-switched) |
| `src/lib/api.ts` | `fetchBrief`, `askOfficeManager` — two public API calls |
| `src/lib/voice.ts` | Browser MediaRecorder, uploads audio to n8n transcription endpoint |
| `src/lib/types.ts` | TypeScript interfaces for `BriefResponse`, `AiResponse`, `VoiceResponse` |
| `src/lib/format.ts` | Presentation helpers: `stripMarkdown`, `toParagraphs`, `itemLabel`, `itemDetail` |

### Backend (Verified — URLs Only, Behavior Unverified)

All backend logic lives in n8n. The three configured endpoints are:

```
https://hope2026os.app.n8n.cloud/webhook/legacy-os-brief
https://hope2026os.app.n8n.cloud/webhook/legacy-office-manager-ai
https://hope2026os.app.n8n.cloud/webhook/legacy-os-voice-transcribe
```

**Important:** GitHub Copilot cannot access, read, verify, or modify these endpoints. Whether they are running or returning correct data is unknown from within this repository.

### Key Architectural Observations (Verified)

- The Constitution principle "Frontend presents. Backend thinks." is implemented. All intelligence lives in n8n; the frontend only renders.
- Voice input follows the Constitution principle "Voice Is a Primary Interface." The `VoiceButton` component records audio, uploads it to n8n, and the editable transcript is returned to the user before sending — preserving "AI Prepares. Humans Decide."
- The `SectionPlaceholder` component explicitly tells the user "being connected to the Legacy Office Manager backend" — indicating the sections are intentionally deferred, not forgotten.
- No automated test suite exists in this repository.
- No CI/CD configuration (`.github/workflows/`) exists in this repository.
- `src/lib/config.ts` contains hardcoded production URLs. There is no environment-variable switching or staging configuration.

### What Is Absent (Verified Gaps)

- No `.github/copilot-instructions.md`
- No `brain/operations/` directory or discovery documents
- No roadmap, architecture, or project files in Brain prior to this document
- No test framework
- No deployment configuration
- No environment variable management
- No error monitoring or logging configuration
- No authentication layer in the frontend

---

## Section 2 — What GitHub Copilot Can Do Directly

The following actions are within GitHub Copilot's direct capability inside this repository. No external credentials or services are required.

**Repository and code operations:**
- Read, analyze, and understand all files in this repository
- Create, edit, and delete files in `src/`, `brain/`, `static/`, and configuration files
- Implement SvelteKit routes, Svelte components, TypeScript modules, and CSS
- Modify `src/lib/config.ts` (e.g., add environment variable support for endpoints)
- Add TypeScript interfaces to `src/lib/types.ts`
- Extend `src/lib/format.ts` with additional presentation helpers
- Create or update `src/lib/api.ts` with new fetch functions
- Add or extend `src/routes/` pages using existing patterns
- Refactor components and fix frontend bugs

**Brain and documentation operations:**
- Create new Brain documents in the correct directory structure
- Update existing Brain documents with verified information
- Add `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md` when given verified system information
- Add `brain/strategy/`, `brain/architecture/`, `brain/projects/`, and similar directories
- Write and maintain `.github/copilot-instructions.md` so future agents have standing context
- Update this roadmap after each merged pull request (per Section 13)

**Quality and process operations:**
- Run `npm run check` (svelte-check) to verify TypeScript and component correctness
- Create and manage pull requests
- Write commit messages that are traceable to Constitution compliance
- Review diffs and identify regressions before committing
- Write or update inline code comments where the existing codebase uses them

**Assumption flag:** The above assumes GitHub Copilot agents in this environment have access to a working shell with Node.js and `npm`. This has not been tested in production.

---

## Section 3 — What GitHub Copilot Cannot Do Directly

The following are outside the direct capability of GitHub Copilot operating within this repository.

**Backend and infrastructure:**
- Access, read, inspect, debug, or modify n8n workflows at `hope2026os.app.n8n.cloud`
- Verify that any of the three n8n webhooks are running or returning correct data
- Create or configure n8n workflows, credentials, or webhooks
- Deploy this application to any hosting platform
- Configure environment variables at the hosting layer
- Create or manage DNS entries, SSL certificates, or network routing

**External services (no credentials or API access):**
- Access QuickBooks data or create QuickBooks integrations
- Access Gmail, Google Workspace, or Google Calendar
- Access Microsoft 365, Microsoft Copilot, or Microsoft Teams
- Access OpenAI APIs directly (Codex, ChatGPT, GPT-4, Whisper)
- Access Google Gemini APIs
- Access any SMS, phone, or calling service

**User environment and hardware:**
- Test voice recording (requires a microphone and a real browser session)
- Test PWA installation (requires a real device)
- Verify mobile layout in real field conditions

**Organizational knowledge:**
- Access Dustin's prior ChatGPT conversation history
- Access prior planning documents stored outside this repository
- Verify business decisions that have never been recorded in the Brain

**Critical boundary:** GitHub Copilot operates only on what exists in this repository. Everything outside the repository boundary — running services, credentials, conversation history, external data — is unknown until explicitly provided or recorded in the Brain.

---

## Section 4 — What Requires External APIs, Services, Credentials, or Other Agents

The following capabilities require resources outside this repository. Each item identifies what is needed and why it cannot be completed by GitHub Copilot alone.

| Capability | Requires | Who Controls It |
|---|---|---|
| Daily Brief data | n8n webhook running and configured | n8n owner (Dustin / n8n.cloud) |
| AI question-and-answer | n8n AI workflow with OpenAI or equivalent | n8n + OpenAI credentials |
| Voice transcription | n8n voice workflow + Whisper or equivalent | n8n + speech API credentials |
| Leads, Projects, Schedule data | n8n routes + a data store (CRM, database, or spreadsheet) | n8n owner |
| QuickBooks integration | QuickBooks API credentials + n8n or direct integration | QuickBooks + n8n |
| Gmail / Google Workspace | Google OAuth credentials + n8n or direct integration | Google account owner |
| Microsoft 365 | Microsoft OAuth credentials + n8n or Graph API integration | Microsoft account owner |
| Deploying the PWA | Hosting provider account (Vercel, Netlify, Cloudflare Pages, etc.) | Hosting account owner |
| Environment variable management | Hosting platform settings | Hosting account owner |
| ChatGPT prior work import | Access to ChatGPT conversation exports or summaries | Dustin |
| Future Gemini integration | Google AI credentials | Google account owner |
| Error monitoring | Third-party service (Sentry, etc.) or n8n logging workflow | n8n owner |

**Assumption:** The n8n cloud account at `hope2026os.app.n8n.cloud` is accessible and controlled by Dustin. This is inferred from the endpoint URLs but has not been verified from within this repository.

---

## Section 5 — How GitHub Copilot Should Work with the Constitution and Brain

This section describes the required workflow for any GitHub Copilot agent operating in this repository.

### Before Any Task

1. **Read the Constitution** (`brain/constitution/LEGACY_OS_CONSTITUTION.md`) before forming a plan.
2. **Read the Brain README** (`brain/README.md`) to understand the Brain's authority and purpose.
3. **Read this roadmap** (`brain/strategy/LEGACY_OS_GITHUB_EXECUTION_ROADMAP.md`) to identify the active objective and the current step.
4. **Read any relevant Brain documents** for the work about to be performed.
5. **Read the application code** related to the task before making changes — do not assume state.

This sequence follows the Constitutional principle "Read Before Write."

### During Any Task

- Apply the compliance hierarchy: Purpose → Philosophy → Constitutional Principle → Implementation.
- If a proposed action cannot be traced to a constitutional principle, pause and explain why before proceeding.
- Do not create a second source of truth. If information belongs in the Brain, put it in the Brain.
- Do not modify the Constitution. If a constitutional gap is identified, record it as a proposed amendment with justification — do not silently rewrite.
- State clearly when a capability or result is unverified. Do not claim completion without evidence.
- Human approval is required for consequential changes (see Section 11).

### After Any Task

- Write back verified results, decisions, or confirmed system state to the appropriate Brain document.
- Update the completion queue in Section 12 of this roadmap if a feature moved from partial to complete.
- Update this roadmap's active step if the step was completed.
- Commit messages must be descriptive and traceable. Example: `feat(leads): implement live leads section, wires to n8n /legacy-os-leads endpoint`.

### What Copilot Must Never Do

- Claim an n8n workflow is working without observing a real response
- Fabricate knowledge that was never recorded in the Brain
- Silently treat a recommendation as an approved decision
- Replace or rewrite the Constitution
- Create duplicate sources of truth (two documents claiming to be the single authority on the same topic)
- Mark a step complete in this roadmap without meeting its acceptance criteria

---

## Section 6 — Recommended Agent Roles Within GitHub

The following agent roles are recommended for this repository. These are not yet configured (`.github/copilot-instructions.md` does not exist). Creating that file is Step 1 of the roadmap.

### Coding Agent

**Scope:** All changes to `src/` and associated configuration files.  
**Standing instructions:**
- Read the Constitution and this roadmap before each session.
- Follow the `SectionPlaceholder` pattern to add new routes; never remove the placeholder until the backend endpoint is confirmed working.
- Run `npm run check` before proposing a pull request.
- Do not hardcode backend URLs; use `src/lib/config.ts`.
- Do not add npm dependencies unless explicitly approved.

### Documentation Agent

**Scope:** All files in `brain/`, `README.md`, and `.github/`.  
**Standing instructions:**
- Read the Brain README and Constitution before writing any document.
- New Brain documents must declare: purpose, status (draft/active/archived), and whether content is verified, estimated, or needs verification.
- Do not summarize the Constitution — link to it.
- Do not create a second source of truth.

### Code Review Agent

**Scope:** Read-only review of pull request diffs.  
**Standing instructions:**
- Flag any change that creates a new backend URL outside `src/lib/config.ts`.
- Flag any change that removes human confirmation from the voice or AI input flow.
- Flag any change that would make a section permanently non-functional (e.g., removing `SectionPlaceholder` without a working replacement).
- Report only confirmed issues with repository evidence.

### Unknown / Not Yet Defined

The following roles have been discussed in the problem statement but are not yet configured or verified as available in this environment:

- GitHub Actions automation agents
- Agents with n8n access
- Agents that can write to external databases

---

## Section 7 — Step-by-Step Roadmap

Steps are ordered by dependency and constitutional priority. Steps are not assigned dates or durations. Completion is determined by acceptance criteria, not calendar.

---

### Step 1 — Create Agent Standing Instructions

**Objective:** Create `.github/copilot-instructions.md` so every Copilot agent session begins with correct context.

**What to do:**
- Create `.github/copilot-instructions.md`
- Include: repository purpose, mandatory pre-task reading list, what Copilot can and cannot change, coding standards, Brain update requirement, and a pointer to this roadmap
- Do not duplicate the Constitution; reference it

**Acceptance criteria:**
- File exists at `.github/copilot-instructions.md`
- File references the Constitution path
- File references this roadmap path
- File states the read-before-write requirement explicitly
- File has been reviewed and approved by Dustin before merge

**Dependencies:** None  
**Human approval required:** Yes — Dustin must approve the standing instructions before they govern future agents

---

### Step 2 — Create Current Systems Discovery Document

**Objective:** Record the verified state of all running systems in `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md`.

**What to do:**
- Create `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md`
- Record: n8n cloud instance URL and confirmed active webhooks, hosting platform and deployment URL (if known), any confirmed integrations (QuickBooks, Gmail, etc.), what is live versus planned
- Mark each item explicitly as: verified, estimated, or unknown

**Acceptance criteria:**
- File exists at `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md`
- Each system entry carries a confidence level
- No system is claimed operational without observable evidence
- File reviewed and approved by Dustin

**Dependencies:** Dustin must provide verified system information; GitHub Copilot cannot discover running n8n workflows from within this repository  
**Human approval required:** Yes — Dustin must provide facts and approve the document

---

### Step 3 — Add Environment Variable Support for Backend Endpoints

**Objective:** Replace the hardcoded production URLs in `src/lib/config.ts` with environment variable support so the application can target staging or development without code changes.

**What to do:**
- Update `src/lib/config.ts` to read from `import.meta.env.VITE_API_BASE` with the current production URL as the default fallback
- Update `README.md` to document the environment variable
- Do not remove the production default; it must work without configuration

**Acceptance criteria:**
- `src/lib/config.ts` reads from `import.meta.env.VITE_API_BASE` with a fallback
- Setting the environment variable to a different URL is sufficient to redirect all API calls
- `npm run check` passes
- No other files were modified

**Dependencies:** Step 1 (standing instructions)  
**Human approval required:** No — this is a safe non-breaking configuration improvement

---

### Step 4 — Implement the Leads Section

**Objective:** Replace `/leads` `SectionPlaceholder` with a functional view that displays leads data from the n8n backend.

**What to do:**
- Add a `/legacy-os-leads` endpoint definition to `src/lib/config.ts`
- Add a `fetchLeads` function to `src/lib/api.ts`
- Add a `LeadsResponse` interface to `src/lib/types.ts`
- Implement `src/routes/leads/+page.svelte` with loading, error, and empty states
- Follow the same data-fetching pattern as the Command Center

**Acceptance criteria:**
- Route renders without error in an empty-data state
- Route renders a meaningful list when backend returns lead records
- Error state is displayed gracefully if the backend is unreachable
- Voice/AskBar is accessible from this view (or a note is added to the completion queue that it is deferred)
- `npm run check` passes
- Backend endpoint must be confirmed operational in `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md` before this step is marked complete

**Dependencies:** Step 2 (confirmed backend endpoint for leads), Step 3 (environment config)  
**Human approval required:** Yes — Dustin must confirm the n8n leads endpoint is ready before this step begins

---

### Step 5 — Implement the Projects Section

**Objective:** Replace `/projects` `SectionPlaceholder` with a functional view that displays project data from the n8n backend.

**What to do:**
- Follow the same pattern as Step 4 for projects
- Add endpoint, fetch function, TypeScript interface, and page component
- Include loading, error, and empty states

**Acceptance criteria:**
- Route renders without error in all data states
- `npm run check` passes
- Backend endpoint confirmed operational in `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md`

**Dependencies:** Step 4 (Leads provides the established pattern)  
**Human approval required:** Yes — n8n endpoint must be confirmed before this step begins

---

### Step 6 — Implement the Schedule Section

**Objective:** Replace `/schedule` `SectionPlaceholder` with a functional view that displays schedule and calendar data.

**What to do:**
- Follow the same pattern as Steps 4–5 for schedule
- This view may need integration with Google Calendar via n8n; confirm scope before building

**Acceptance criteria:**
- Route renders without error in all data states
- `npm run check` passes
- Backend endpoint confirmed operational

**Dependencies:** Steps 4–5, confirmed n8n schedule endpoint  
**Human approval required:** Yes — scheduling integration scope must be confirmed before building

---

### Step 7 — Implement the Estimate Requests Section

**Objective:** Replace `/estimate-requests` `SectionPlaceholder` with a functional view.

**Acceptance criteria:** Same pattern as Steps 4–6, with confirmed backend endpoint.

**Dependencies:** Steps 4–6  
**Human approval required:** Yes

---

### Step 8 — Implement the Daily Reports Section

**Objective:** Replace `/daily-reports` `SectionPlaceholder` with a functional view.

**Acceptance criteria:** Same pattern as Steps 4–7, with confirmed backend endpoint.

**Dependencies:** Steps 4–7  
**Human approval required:** Yes

---

### Step 9 — Implement the Employees Section

**Objective:** Replace `/employees` `SectionPlaceholder` with a functional view.

**Acceptance criteria:** Same pattern as Steps 4–8, with confirmed backend endpoint.  
**Note:** Employee data is operationally sensitive. Extra care is required for empty and error states.

**Dependencies:** Steps 4–8  
**Human approval required:** Yes

---

### Step 10 — Implement the Customers Section

**Objective:** Replace `/customers` `SectionPlaceholder` with a functional view.

**Acceptance criteria:** Same pattern, with confirmed backend endpoint. Relationship data must render cleanly in empty state per Constitution principle "Empty Data Is a Valid Operating State."

**Dependencies:** Steps 4–9  
**Human approval required:** Yes

---

### Step 11 — Implement the Documents Section

**Objective:** Replace `/documents` `SectionPlaceholder` with a functional view for document access and invoice AI.

**Note:** This section may involve document upload, retrieval, or AI-powered document reading. Scope must be confirmed before implementation. This step may be more complex than Steps 4–10.

**Acceptance criteria:**
- Route renders without error in all data states
- Document AI scope confirmed and documented in Brain before implementation begins
- `npm run check` passes

**Dependencies:** Steps 4–10, confirmed n8n document endpoint, confirmed document AI scope  
**Human approval required:** Yes — document AI scope must be explicitly approved

---

### Step 12 — Implement the Settings Section

**Objective:** Replace `/settings` `SectionPlaceholder` with a functional settings view.

**Note:** Settings scope is undefined. This step should not begin until the settings requirements are documented in the Brain.

**Acceptance criteria:**
- Settings scope documented in Brain before implementation
- Route renders without error
- `npm run check` passes

**Dependencies:** Steps 1–11, defined settings requirements  
**Human approval required:** Yes — settings scope must be approved before implementation

---

### Step 13 — Add CI/CD Pipeline

**Objective:** Add `.github/workflows/` with at minimum a `svelte-check` step that runs on every pull request.

**What to do:**
- Create `.github/workflows/ci.yml` with a job that runs `npm ci` and `npm run check`
- Optionally add a build step to catch build errors before merge

**Acceptance criteria:**
- Workflow runs on every pull request to the main branch
- `npm run check` failure blocks merge
- No test framework is added without separate approval

**Dependencies:** Steps 1–12 (CI is more valuable after core features exist)  
**Human approval required:** No — CI is a quality gate, not a business change

---

### Step 14 — Record Operational Brain Documents

**Objective:** After all sections are live and verified, create operational Brain documents for each major department.

**What to do:**
- For each implemented section (Leads, Projects, Schedule, etc.), create a Brain document recording: what the section does, what data it consumes, what the backend endpoint is, what empty/error states look like, and open questions
- File these in `brain/operations/` using descriptive names

**Acceptance criteria:**
- Each active route has a corresponding Brain document
- Each document declares verification status
- No document duplicates the Constitution

**Dependencies:** Steps 4–12 complete  
**Human approval required:** No — documentation does not change production behavior

---

## Section 8 — Active Objective

> **Active Objective: Step 1 — Create Agent Standing Instructions**

All future GitHub Copilot sessions should target this objective first. No other steps should begin until Step 1 is merged and approved. This follows the Constitutional principle "One Bird at a Time."

Step 1 is the prerequisite for every other step because standing instructions ensure all future agents begin with the same context, reducing drift, duplication, and misaligned work.

---

## Section 9 — Acceptance Criteria Summary

Each step's acceptance criteria are stated in Section 7. This section provides a quick reference.

| Step | One-line Acceptance Criteria |
|---|---|
| 1 | `.github/copilot-instructions.md` exists, references Constitution and this roadmap, approved by Dustin |
| 2 | `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md` exists with verified system facts approved by Dustin |
| 3 | `src/lib/config.ts` reads from environment variable with production fallback; `npm run check` passes |
| 4 | Leads route renders in all data states; n8n endpoint confirmed; `npm run check` passes |
| 5 | Projects route renders in all data states; n8n endpoint confirmed; `npm run check` passes |
| 6 | Schedule route renders in all data states; n8n endpoint confirmed; `npm run check` passes |
| 7 | Estimate Requests route renders in all data states; n8n endpoint confirmed; `npm run check` passes |
| 8 | Daily Reports route renders in all data states; n8n endpoint confirmed; `npm run check` passes |
| 9 | Employees route renders in all data states; n8n endpoint confirmed; `npm run check` passes |
| 10 | Customers route renders in all data states; n8n endpoint confirmed; `npm run check` passes |
| 11 | Documents route renders in all data states; document AI scope approved; `npm run check` passes |
| 12 | Settings scope approved; Settings route renders; `npm run check` passes |
| 13 | CI workflow runs `npm run check` on every PR; no build failures at time of creation |
| 14 | All active routes have corresponding Brain documents with declared verification status |

---

## Section 10 — Dependencies and Blockers

### Hard Blockers (Work Cannot Proceed Without These)

| Blocker | Blocked Step(s) | Resolution |
|---|---|---|
| `.github/copilot-instructions.md` does not exist | All steps (agents lack context) | Dustin approves Step 1 |
| `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md` does not exist | Steps 4–14 (can't confirm endpoint readiness) | Dustin provides verified system facts; Step 2 created |
| n8n webhooks for each section not confirmed | Steps 4–12 individually | Dustin verifies each n8n route before its step begins |

### Soft Dependencies (Recommended Before Starting)

| Dependency | Affected Steps | Notes |
|---|---|---|
| Environment variable support | Steps 4–12 | Step 3 should be merged before any backend-connected section is built |
| Defined settings requirements | Step 12 | Settings cannot be built without knowing what they control |
| Document AI scope definition | Step 11 | Documents section may be significantly more complex than other sections |

### External Unknowns (Cannot Be Resolved From This Repository)

| Unknown | Impact |
|---|---|
| n8n workflow health and data structure for each section | Steps 4–12 cannot begin safely without this |
| Hosting platform and deployment URL | Step 3 environment variable naming should match what the host supports |
| QuickBooks integration status and API shape | Not required for any current step; becomes relevant when financial data enters the frontend |
| Microsoft 365 or Gmail integration status | Not required for any current step; relevant when communications enter the frontend |
| Voice transcription endpoint reliability | Command Center has this working structurally; actual reliability is unverified |

---

## Section 11 — Human Approval Points

The following decisions require Dustin's explicit approval before work proceeds. These are not suggestions — they are Constitutional compliance requirements ("AI Prepares. Humans Decide.").

| Approval Point | When | Why |
|---|---|---|
| Step 1 standing instructions | Before merging `.github/copilot-instructions.md` | Governs all future agent behavior |
| Step 2 systems discovery | Before merging operational facts | Determines what is recorded as verified organizational knowledge |
| Each section backend endpoint | Before beginning Steps 4–12 | Ensures GitHub Copilot is not building against an unconfirmed backend |
| Document AI scope (Step 11) | Before beginning Step 11 | Documents section may involve sensitive data and complex AI |
| Settings scope (Step 12) | Before beginning Step 12 | Settings may control user accounts, credentials, or integrations |
| Any npm dependency addition | Before merging | Avoids supply chain risk; follows Constitution's "Integrate Before Rebuilding" |
| Any change to the Constitution | Any time | Constitutional amendments require deliberate review |
| Any change to this roadmap's active objective | Any time | One bird at a time; redirection requires deliberate approval |

---

## Section 12 — Completion Queue for Partially Implemented Features

The following features are partially implemented as of this roadmap's creation. They are working structurally but lack functional backend data or verification.

| Feature | Current State | What Is Complete | What Is Missing |
|---|---|---|---|
| Command Center brief | Partial | Fetches from n8n, renders brief cards, handles loading/error/empty | n8n brief endpoint behavior unverified from this repository |
| AskBar / AI question-answer | Partial | Voice recording, editable transcript, send to n8n, displays answer | n8n AI endpoint behavior unverified; answer quality unknown |
| Voice transcription | Partial | Browser MediaRecorder implemented, uploads to n8n | n8n voice endpoint behavior unverified |
| SummaryCard | Partial | Renders AI summary text with Markdown stripping | Depends on n8n returning `office_manager_summary` field |
| Leads section | Stub | Route exists, `SectionPlaceholder` displays | No data, no fetch function, no n8n endpoint confirmed |
| Projects section | Stub | Route exists, `SectionPlaceholder` displays | No data, no fetch function, no n8n endpoint confirmed |
| Schedule section | Stub | Route exists, `SectionPlaceholder` displays | No data, no fetch function, no n8n endpoint confirmed |
| Estimate Requests section | Stub | Route exists, `SectionPlaceholder` displays | No data, no fetch function, no n8n endpoint confirmed |
| Daily Reports section | Stub | Route exists, `SectionPlaceholder` displays | No data, no fetch function, no n8n endpoint confirmed |
| Employees section | Stub | Route exists, `SectionPlaceholder` displays | No data, no fetch function, no n8n endpoint confirmed |
| Customers section | Stub | Route exists, `SectionPlaceholder` displays | No data, no fetch function, no n8n endpoint confirmed |
| Documents section | Stub | Route exists, `SectionPlaceholder` displays | No data, no fetch function, no n8n endpoint confirmed, document AI scope undefined |
| Settings section | Stub | Route exists, `SectionPlaceholder` displays | Requirements undefined |
| CI/CD pipeline | None | Nothing | `.github/workflows/` does not exist |

**Rule:** Do not remove a `SectionPlaceholder` until the replacement is verified functional with real data.

---

## Section 13 — Process for Keeping This Roadmap Updated After Every Merged Pull Request

The following process must be followed after every pull request is merged to the main branch.

### Update Trigger

Any merged pull request that advances a roadmap step, resolves a blocker, or adds a new partial feature must be followed by a roadmap update commit.

### Update Steps

1. **Open this roadmap** (`brain/strategy/LEGACY_OS_GITHUB_EXECUTION_ROADMAP.md`).
2. **Update Section 12** (Completion Queue):
   - If a feature moved from stub to partial, update its row accordingly.
   - If a feature moved from partial to complete, remove it from the queue and note it as complete in Section 1.
3. **Update Section 7** (the relevant step):
   - If the step was completed, add a note at the top of that step: `Status: Complete — merged in PR #[number]`
   - If new sub-tasks were discovered, add them as sub-bullets under the step.
4. **Update Section 8** (Active Objective):
   - If the active step was completed, advance the active objective to the next step.
   - Do not change the active objective for any other reason without Dustin's approval.
5. **Update Section 10** if a blocker was resolved or a new blocker was discovered.
6. **Commit the roadmap update** with a clear message: `docs(brain): update roadmap after PR #[number] — [short description]`
7. **Do not open a separate PR for roadmap-only updates** unless the roadmap changes are substantial. Minor post-merge updates may be pushed directly to the working branch or as a follow-on commit.

### What Not to Do

- Do not rewrite completed steps to make them appear incomplete.
- Do not advance the active objective without meeting acceptance criteria.
- Do not add speculative steps to the roadmap without recording them as "proposed" and getting approval.
- Do not edit Section 1 (verified repository state) without re-verifying the repository. Assumptions are not facts.

---

## Section 14 — Process for Importing Prior ChatGPT Work

Dustin has accumulated planning, decisions, and organizational thinking in prior ChatGPT conversations. That material is not currently in this repository. The following process must be followed to import it safely, without inventing, losing, or duplicating decisions.

### Why This Process Matters

The Constitution states: "Build From Structured Knowledge, Not Raw Conversations." Raw conversations contain repetition, evolving thoughts, and temporary ideas. They are valuable source material but they are not the operational reference. The process below follows the constitutional flow: Conversation → Extraction → Categorization → Verification → Permanent Knowledge → Deliverable.

### Import Process

**Step A — Preserve the source.** Before any extraction or summarization, save the original conversation text as-is. Do not modify it. Store it in a private location (not in this public repository unless Dustin approves). The original must remain recoverable.

**Step B — Extract independent concepts.** Read through the conversation and identify each independent concept: a decision, a principle, a project idea, a system requirement, a constraint, a past failure, a relationship, or a resolved question. Each concept should become its own record.

**Step C — Apply confidence labels.** For each extracted concept, label it as one of:
- **Confirmed** — Dustin explicitly approved this; there is clear evidence
- **Estimated** — Dustin discussed this but it was not finalized
- **Needs verification** — This was mentioned but may be outdated or context-dependent

**Step D — Check against existing Brain documents.** Before writing any new record, compare it against what already exists in the Brain. If the concept already exists and is consistent, do not create a duplicate. If it contradicts existing knowledge, record the contradiction explicitly and ask Dustin to resolve it.

**Step E — Write to the correct Brain location.** 
- Decisions about how the organization works → `brain/constitution/` (proposed amendments, or operational standards if below constitutional level)
- Running systems and verified integrations → `brain/operations/`
- Strategy and priorities → `brain/strategy/`
- Project-specific context → `brain/projects/` (create if needed)
- Architecture decisions → `brain/architecture/` (create if needed)

**Step F — Do not invent.** If a concept was present in conversation but its resolution is unclear, record it as "Needs verification" with the original language preserved. Do not guess what the decision was.

**Step G — Submit for review.** All imported Brain documents require Dustin's review before they are marked "Active." A document that has not been reviewed carries status "Draft."

**Step H — Archive the source.** Once extraction is complete and verified, record in `brain/operations/CURRENT_SYSTEMS_DISCOVERY.md` or a relevant Brain document that the import was completed, what was covered, and what remained unresolved.

### What to Avoid

- Do not extract everything at once. Start with the most consequential decisions (business model, architectural choices, active projects) and work forward.
- Do not merge extracted knowledge with existing documents without explicitly noting the merge.
- Do not treat an early-conversation idea as a final decision if the conversation shows it was later changed.
- Do not create new documents for things already in the Constitution.

---

## Section 15 — Single Next Recommended Task

After this roadmap is reviewed and approved by Dustin, the single next recommended task is:

> **Create `.github/copilot-instructions.md`**

This is Step 1 of the roadmap. It has no dependencies, costs no backend work, and immediately improves the quality and consistency of every future GitHub Copilot session in this repository. Without it, future agents begin each session without context about the Constitution, the Brain, the active objective, or the boundaries of their authority.

The deliverable is a single markdown file that tells every Copilot agent what to read first, what it can change, what it cannot change, and where to record results. It is the cheapest improvement available and has the highest leverage over every subsequent step.

**Proposed next action:** Dustin reviews this roadmap, approves or amends the standing instructions scope, and authorizes a pull request for Step 1.

---

*This document was created as part of the initial Brain strategy layer. It must not become a second source of truth. The Constitution governs. The Brain records. This roadmap coordinates execution.*
