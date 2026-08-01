# Legacy OS Constitution

> **Status:** Placeholder — this document must be completed before this repository is used in production.

This Constitution is the highest authority for the Legacy Office Manager repository and Brain. All agents, contributors, and automated processes must read and comply with this document before making any changes.

---

## Preamble

The Legacy Office Manager exists to serve Hope Family Gardens with reliable, well-governed software. This Constitution establishes the rules and principles that ensure every contribution maintains quality, consistency, and institutional integrity.

---

## Article I — Governing Principles

1. **Read before write.** Always read the relevant Brain documents before making changes.
2. **Single source of truth.** Do not duplicate authoritative knowledge. Record it once in the appropriate Brain location.
3. **Minimal change.** Make only the changes required for the assigned task.
4. **No silent amendments.** Never silently change the Constitution or any authoritative Brain document. Changes must be communicated and recorded.
5. **Transparency.** Clearly report files changed, tests performed, and anything not verified.

---

## Article II — Brain Structure

The Brain (`brain/`) is organized into the following authoritative sections:

| Section | Purpose |
|---|---|
| `constitution/` | This document — the governing authority |
| `governance/` | Roles, responsibilities, and decision-making |
| `strategy/` | Vision, goals, and roadmaps |
| `operations/` | Processes and runbooks |
| `departments/` | Department-specific knowledge |
| `projects/` | Project documentation |
| `standards/` | Coding and process standards |
| `knowledge/` | Reference material and how-tos |
| `decisions/` | Decision records (ADRs) |
| `history/` | Historical context and lessons learned |
| `templates/` | Reusable document templates |
| `archive/` | Retired or superseded content |

---

## Article III — Agent Rules

All automated agents (Copilot, CI bots, etc.) must:

1. Read this Constitution before acting.
2. Read the relevant Brain section(s) before acting.
3. Make only the changes required for their assigned task.
4. Not duplicate knowledge already recorded in the Brain.
5. Not silently amend this Constitution.
6. Report all files changed, tests performed, and items not verified.

---

## Article IV — Amendment Process

Amendments to this Constitution must:

1. Be proposed in a pull request with a clear rationale.
2. Be reviewed and approved by a human maintainer.
3. Be recorded in `brain/decisions/` as a decision record.
4. Never be made silently or without attribution.

---

*This document was initialized as a placeholder. Complete it before this repository enters active use.*
