---
name: feedback-verify-by-running
description: "Verified" means the changed thing was executed, rendered, queried or read back, never just read.
type: feedback
---

A change counts as verified only when the artefact it changed was observed with something that can see the change: run the script, render the page, query the table, read back the setting from the live system.

**Why:** reading code or a config file and concluding "this should work" let real defects through. One example: a report's headline number looked right in the code but was wrong in the output, because the time zone was applied twice.

**How to apply:** before writing "done" or "verified", name the artefact that changed and the observation that proves it. If no observation is possible, say "not verified" and say why.
