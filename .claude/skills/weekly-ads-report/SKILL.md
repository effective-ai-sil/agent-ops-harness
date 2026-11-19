---
name: weekly-ads-report
description: Builds the weekly paid-ads performance report for a client and judges it against agreed pass lines. Use for "how are the ads going", "weekly ads report", "did we hit target this week".
---

# Weekly ads report

An example skill. A skill is the single place the method for one recurring job lives, so the job runs the same way every week and every lesson learned has somewhere to go.

## Done means
A report file exists at `reports/<client>/<yyyy.mm.dd>-weekly.md`. Every number in it was pulled this session from the ad platform and the client's own lead records, and each pass line shows PASS or FAIL.

## Inputs
- Client slug, and the reporting week (Monday to Sunday in the client's time zone)
- The pass lines agreed with the client (e.g. cost per lead below $X, at least N leads)

## Steps
1. **Pull, don't remember.** Fetch spend, clicks and conversions for the week from the platform API. Never reuse figures from an earlier session.
2. **Reconcile with the client's own records.** Count leads from the client's system for the same window. If platform conversions and real leads differ by more than 20%, say so in the report. Do not average them.
3. **Use one unit before comparing.** Before showing any week-on-week change, check that both weeks use the same currency, time zone and conversion definition.
4. **Judge against the pass lines.** PASS or FAIL for each line. A miss inside normal noise is reported as noise, not as a crisis.
5. **One recommendation at most.** If a change is proposed (a pause, a budget move, a negative keyword), backtest it on the last 30 days first and quote the result.
6. **Write the report** using the template below.

## Verification gate (before saying "done")
- Recount the two headline numbers from the source a second time, with a different query or script than the one that produced them.
- Open the saved file and confirm it is at the stated path.

## Never
- Make a live account change from this skill. Changes go through the change process: dry run, human approval, read back.
- Send the report to the client. A human reviews it and sends it.

## Template
```
Week: <dates> | Client: <name>
Spend: $ | Leads (client records): | Cost per lead: $
Pass lines: <line> PASS/FAIL ...
What changed and why (2-3 lines)
Recommendation (optional, with backtest result)
Data sources: <platform + client system, pulled <time>>
```

## Lessons folded in
- 2026-xx: Week-on-week change shown across two different conversion definitions. Fixed: step 3 added.
- 2026-xx: Report quoted platform conversions that the client could not match. Fixed: step 2 now reconciles with client records.
