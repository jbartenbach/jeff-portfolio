# Short Haul Compliance

Short Haul is a compliance feature that determines whether a driver qualifies for short-haul operational status based on location, duty time, and regulatory constraints.

It is evaluated per work shift and can generate warnings, status flags, and compliance decisions depending on configuration.

---

## Overview

Short Haul evaluation considers:

- Home terminal assignment
- Start and end location validation
- 150 air-mile radius compliance
- Work shift duration limits
- User-reported overrides
- Engine-calculated GPS validation

---

## Configuration

Short Haul behavior is controlled by **settings**, and can be overridden per request.

### Short Haul Settings

| Setting | Type | Description |
|--------|------|-------------|
| `ShortHaulMode` | `Off`, `Monitor`, `Strict` | Controls how Short Haul is evaluated and enforced. |
| `ShortHaulTerminalMilesThreshold` | Decimal (miles) | Maximum allowed distance from the home terminal when starting or ending a work shift. Used to determine whether a driver is considered at their home terminal. |
| `ShortHaulAirMileRadiusWarningMiles` | Decimal (miles) | Distance threshold from the 150 air-mile boundary at which a warning is generated. Set to `0` to disable proximity warnings. |

---

## Short Haul Modes

HOS Codex supports **three operational modes**:

---

### 1. OFF

Short Haul evaluation is disabled.

- No short-haul status is calculated
- No short-haul enforcement is applied
- Short-haul checks are not executed for compliance decisions
- Warnings and violations related to short haul are not generated

Use this mode when short haul is not applicable to the driver, or when short haul status is not relevant to the integration, even if the driver may technically qualify under regulatory rules.

---

### 2. MONITOR

Short Haul is evaluated, but enforcement is not applied.

- Driver is evaluated for short-haul eligibility
- Warnings are generated (e.g., radius, missing home terminal, time limits)
- Violations are not reported
- GPS-based and user-reported issues are tracked for visibility only

Use this mode when you want visibility into short-haul behavior without impacting compliance decisions.

---

### 3. STRICT

Short Haul is fully enforced.

- Driver must meet all short-haul requirements to maintain status
- Violations are enforced and recorded
- Drivers may be excluded from short-haul status if conditions fail:
    - Not starting at home terminal
    - Not ending at home terminal (when shift ends)
    - Exceeding 150 air-mile radius
    - Exceeding work shift time limits
- All applicable warnings and violations are recorded

Use this mode when short haul must be enforced as part of compliance decisions.

---

## Evaluation Rules

A driver is considered eligible for Short Haul only if all applicable conditions are met (depending on mode).

### Required Conditions (STRICT mode)

- Must start at home terminal (within configured threshold)
- Must end at home terminal (when shift is complete)
- Must remain within 150 air-mile radius
- Must not exceed work shift time limits
- Must not trigger invalid GPS-based radius detection

---

## Radius Validation

Two independent radius checks are performed:

### 1. User-Reported Radius Override

- Triggered by event:
    - `event-type.outside-short-haul-radius`

If present:
- Driver is immediately marked outside short haul radius
- Warning: `warning.short-haul.user-reported-outside-air-mile-radius`

---

### 2. GPS-Based Radius Validation

- Uses calculated Haversine distance from home terminal
- Radius limit: **150 air miles**

If exceeded:
- Driver is excluded from short haul (STRICT mode)
- Warning: `warning.short-haul.detected-outside-air-mile-radius`

---

## Work Shift Validation

Short haul requires compliance with work shift constraints:

- Uses 14-hour work shift clock
- If unavailable:
    - Warning: `warning.short-haul.work-shift-time-unavailable`

If exceeded:
- Warning: `warning.short-haul.exceeded-work-shift-limit`
- Driver is excluded from short haul (STRICT mode)

---

## Home Terminal Validation

Home terminal status is evaluated at both start and end of work shift.

### Start Validation
- Missing location → warning
- Outside threshold → `warning.short-haul.started-away-from-home-terminal`

### End Validation
- Missing location → warning
- Outside threshold → `warning.short-haul.ended-away-from-home-terminal`

Threshold is controlled by:

- `ShortHaulTerminalMilesThreshold`

---

## Warning Behavior

Warnings behave differently depending on mode:

| Mode | Warnings | Violations |
|------|----------|------------|
| OFF | No | No |
| MONITOR | Yes | No |
| STRICT | Yes | Yes |

---

## Approaching Radius Warning

Drivers nearing the 150-mile boundary receive a predictive warning:

- Warning: `warning.short-haul.approaching-air-mile-radius-limit`
- Triggered when within configured warning buffer
- Controlled by `ShortHaulAirMileRadiusWarningMiles`
- Includes:
    - distance to home terminal
    - remaining miles to boundary

---

## Mode Override (Per Request)

Short haul mode can be overridden per API request.

This allows:

- Global default behavior via Settings API
- Per-driver or per-calculation overrides via:
    - Summary API
    - Report API

Example use cases:

- Fleet default = STRICT
- Specific driver = MONITOR (audit mode)
- Temporary override during evaluation or migration

---

## Summary

Short haul evaluation is a layered system combining:

- Regulatory constraints (14-hour / duty limits)
- Geographic validation (150 air miles)
- Operational configuration (STRICT / MONITOR / OFF)
- Event-based overrides
- Home terminal anchoring