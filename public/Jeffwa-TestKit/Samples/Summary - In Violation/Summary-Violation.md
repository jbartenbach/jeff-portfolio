# In Violation Sample

This sample demonstrates a driver who is currently in violation at the time of the compliance calculation.

The sample is intended for use with the compliance/summary endpoint and focuses on the driver's current compliance state rather than historical compliance analysis.

## Purpose

This sample can be used to verify:

- Violation detection
- Current compliance status
- Clock calculations
- Remaining availability calculations
- Active ruleset determination
- Current exemption status

## Notes

This sample is intentionally focused on the driver's current compliance state.

It is not intended to demonstrate:

- Historical work shifts
- Historical cycle days
- Violation history
- Warning history
- Recovery scenarios
- Detailed compliance reporting

For examples of historical compliance analysis, work shifts, cycle days, and violation timelines, see the report-focused samples and use the compliance/report endpoint.

## Expected Result

The calculated driver state should indicate that the driver is currently in violation.

The response should contain one or more active violations along with the associated compliance information and clock values that explain the driver's current status.