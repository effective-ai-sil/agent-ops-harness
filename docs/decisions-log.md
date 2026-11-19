# Decisions log (format + examples)

Significant decisions only: ones with real alternatives, that constrain future work, or that would cost time to argue again. A short index (one line per decision) is searched first; the full entry is read only when needed.

---

## DEC-001 - 2026-xx-xx - Guards run as hooks, not as prompt instructions
**Decision:** Safety rules that can be checked mechanically (destructive commands, secrets, deploys, outbound sends) are enforced by PreToolUse hooks.
**Alternatives rejected:** (a) Rules in the system prompt only: compliance fell as the rule count grew. (b) A review step after the action: too late for irreversible actions.
**Why:** a hook fires at the moment of action, every time, whatever the model remembers.
**Revisit if:** hook latency becomes noticeable, or a rule needs judgement a regex can't express.

## DEC-002 - 2026-xx-xx - A lesson for one job lives in that job's skill
**Decision:** When a mistake is found, the fix is a step in the skill for that job, plus one line in the mistakes log. Always-on rules are kept for things that apply to every job.
**Alternatives rejected:** adding a new global rule per lesson. Rules piled up, and each new one diluted the others.
**Why:** fewer always-on rules, higher compliance. A step in the right skill is read exactly when it matters.
**Revisit if:** the same lesson appears in three or more skills (then it may be universal).
