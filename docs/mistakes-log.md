# Mistakes log (format + examples)

One line per real mistake. The log is not the fix: the **Fixed in** column must point to a changed skill step, hook or rule. A periodic review looks for the same mistake appearing twice, which means the fix didn't hold.

| # | Date | What happened | Root cause | Fixed in |
|---|---|---|---|---|
| 1 | 2026-xx-xx | Said "saved the plan file" when no write had happened | Completion claim made while narrating, before the tool call | Global rule: a "saved/created" claim must match a write already made this turn |
| 2 | 2026-xx-xx | Week-on-week change compared two different conversion definitions | No unit check before the comparison | `weekly-ads-report` step 3 |
| 3 | 2026-xx-xx | A guard was added but never shown blocking anything | No negative test | Rule: every new guard ships with a test that proves the block (see `test/`) |
