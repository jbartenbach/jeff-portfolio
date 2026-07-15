# Full Cycle

This sample demonstrates a complete 7-day driver cycle using the HOS Codex API.

It is a baseline dataset designed to be used with either:

- compliance/summary
- compliance/report

The request includes full-cycle history, even though the compliance/summary endpoint does not require this level of detail.

This is intentional.

The same request can be used to evaluate both real-time compliance behavior and full historical reporting.

---

## Scenario Overview

In this sample:

- The driver operates continuously over a full 7-day cycle
- The dataset includes complete historical activity for the cycle window
- No edge cases are included
- No warnings or violations are present
- No sleeper berth or split-rest logic is involved
- The driver remains fully compliant throughout the cycle

---

## Endpoint Usage

### compliance/summary

When used with compliance/summary, this request will return:

- Current compliance state
- Current available clocks
- Current ruleset status
- Real-time driver availability

In this context, most historical data is not required, but is included to provide consistency with the report format.

---

### compliance/report

When used with compliance/report, this request will return:

- Full 7-day cycle history
- Work shift breakdowns
- Cycle day aggregation
- Historical compliance state under the active ruleset

This is the primary endpoint for analyzing how compliance evolved over time.

---

## Key Concept

This sample demonstrates that:

> The same dataset can power both real-time compliance (summary) and historical analysis (report).

The difference lies in how the data is interpreted, not in how the request is structured.

---

## What to Look For

When reviewing this sample:

- Ensure cycle continuity across all 7 days
- Confirm work shifts are correctly segmented
- Verify consistent compliance state across both endpoints
- Observe how summary focuses only on the current state
- Observe how report reconstructs full historical context