---
name: feedback-drafts-not-sends
description: Every outbound message (email, post, client report) is created as a draft for the owner to review and send.
type: feedback
---

The agent writes drafts. A human sends.

**Why:** the owner edits most client messages before they go, often cutting caveats or rewording. A message sent directly can't be taken back, and a record of "what was sent" is wrong if it was taken from the draft rather than the sent copy.

**How to apply:** create drafts only. When recording what a client was told, read the sent copy, not the draft. The `outbound-email` action rule enforces this at the tool call.
