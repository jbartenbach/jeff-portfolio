# Report - Warning

This demonstrates how the compliance/report endpoint behaves when a driver is in a warning state that follows a prior violation within the same day.

The goal of this sample is to help you understand how the system distinguishes between:

- real-time compliance state
- historical violations
- predictive warning states

---

## What This Sample Shows

In this scenario:

- The driver had a violation earlier in the day
- The driver is currently On Duty
- The driver is currently in a `compliance-status.at-risk` state
- The driver is approaching a new violation threshold

The response includes:

- The violation the driver is about to enter if driving continues
- The remaining time available before that violation occurs
- The driver’s current compliance state at the time of calculation

If the driver continues operating past the remaining available time, they will immediately transition into a new violation.

---

## Important Behavior Note

The compliance/summary portion of the response reflects only the current real-time state of the driver.

Because of this:

- It does not show historical violations
- It does not reconstruct past violations
- It only reflects the driver’s status at the calculation moment

This means the driver may appear compliant in the summary even though a violation occurred earlier in the day.

---

## Ruleset View

Each ruleset in the response represents the driver operating under a specific compliance rule set.

This is important because HOS Codex supports drivers who may operate under multiple rulesets across a cycle.

Each ruleset includes:

- The current state of that ruleset (`compliance-status.compliant`, `compliance-status.at-risk`, or `compliance-status.in-violation`)
- The calculated clocks for that ruleset
- The historical context required to evaluate compliance

---

## Ruleset History

Within each ruleset, the report includes a history of:

- Work shifts
- Cycle activity
- State transitions (including warnings and violations)

This provides visibility into how the driver reached their current compliance state under that specific ruleset.

---

## Cycle Breakdown

Each ruleset also includes a breakdown of activity by cycle day.

Each cycle day shows:

- Driver activity during that day
- Work shifts that occurred within that day
- Cycle time consumption
- Any warnings or violations associated with that day

---

## Why This Sample Exists

This sample is intended to demonstrate a specific behavior that often causes confusion:

A driver can be:

- In a warning state now
- Have a violation earlier in the day
- And still appear compliant in the real-time summary view

The compliance/report endpoint exists to provide the historical context needed to understand that progression.