---
name: project-reporting-week
description: Client reporting weeks run Monday to Sunday in NZ time.
type: project
---

All client reports use a Monday-to-Sunday week in Pacific/Auckland time.

**Why:** ad platforms default to the account's time zone and lead systems often store UTC, so a week defined loosely produced numbers that didn't match between sources.

**How to apply:** set the window explicitly in every query, and state it in the report header.
