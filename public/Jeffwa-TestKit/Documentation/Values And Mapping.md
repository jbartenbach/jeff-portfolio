# Mappings

HOS Codex uses a normalized set of values for event types, duty statuses, exemptions, rulesets, event origins, violations, clocks, warnings, and other compliance-related data.

The Mappings API allows you to define aliases for any of the values listed below. Once an alias is configured, you may use the alias value when submitting requests, and HOS Codex will return the alias value in responses.

Aliases may be either:

- String values
- Integer values

For example:

| HOS Codex Value | Alias |
|-----------------|--------|
| event-type.duty-status-change | 1 |
| duty-status.drive | 4 |
| ruleset.us.interstate.property.8day | US_PROP_8 |

HOS Codex uses a normalized set of values internally. The Mappings API allows you to map your existing values to the corresponding HOS Codex values without modifying the values already used by your application, database, or ELD platform.

---

## Event Types

| Code | Description |
|------|-------------|
| event-type.duty-status-change | Duty Status Change |
| event-type.exemption-applied | Apply Exemption |
| event-type.ruleset-change | Ruleset Change |
| event-type.home-terminal-change | Home Terminal Change |
| event-type.outside-short-haul-radius | Reported Outside Short-Haul Radius (See Short Haul doc) |

---

## Duty Statuses

| Code | Description |
|------|-------------|
| duty-status.on-duty | On Duty |
| duty-status.off | Off Duty |
| duty-status.sleeper-berth | Sleeper Berth |
| duty-status.drive | Driving |
| duty-status.personal-conveyance | Personal Conveyance |
| duty-status.yard-move | Yard Move |

---

## Exemptions

| Code | Description |
|------|-------------|
| exemption.adverse-conditions | Adverse Driving Conditions |
| exemption.16-hour | 16-Hour Exception |

---

## Rulesets

| Code | Description |
|------|-------------|
| ruleset.us.interstate.passenger.7day | U.S. Interstate Passenger (7-Day Cycle) |
| ruleset.us.interstate.passenger.8day | U.S. Interstate Passenger (8-Day Cycle) |
| ruleset.us.interstate.property.7day | U.S. Interstate Property (7-Day Cycle) |
| ruleset.us.interstate.property.8day | U.S. Interstate Property (8-Day Cycle) |
| ruleset.us.short-haul.7day | U.S. Short-Haul (7-Day Cycle) |
| ruleset.us.short-haul.8day | U.S. Short-Haul (8-Day Cycle) |

### Short Haul Ruleset Note

The `ruleset.us.short-haul.*` rulesets are provided as an **optional organizational convenience** for customers who prefer to separate Short Haul and Property configurations into distinct rulesets.

When using either Short Haul ruleset:

- The driver is still evaluated using **U.S. Property ruleset logic**
- Short Haul behavior is determined entirely by the **Short Haul settings (`ShortHaulMode`, thresholds, and warnings)**
- These rulesets do **not introduce separate compliance logic**

All U.S. Property drivers—regardless of whether they are assigned a Short Haul or Property ruleset—are evaluated for Short Haul based on the configured Short Haul settings.

---

## Cycles

| Code | Description |
|------|-------------|
| cycle.us.60hours.7days | 60 Hours in 7 Days |
| cycle.us.70hours.8days | 70 Hours in 8 Days |

---

## Event Origins

| Code | Description |
|------|-------------|
| origin.automatic | Automatically Generated |
| origin.manual | Manually Entered |
| origin.synchronized-from-vehicle | Synchronized from Vehicle |

---

# Additional Output Values

The following values may appear in API responses and may also be customized through the Mappings API.

---

## Compliance Statuses

| Code | Description |
|------|-------------|
| compliance-status.compliant | Driver is compliant |
| compliance-status.at-risk | Driver is approaching a violation |
| compliance-status.in-violation | Driver is currently in violation |

---

## Clock States

| Code | Description |
|------|-------------|
| clock-state.active | Clock is currently counting down |
| clock-state.inactive | Clock is not currently applicable |
| clock-state.break-taken | Required break has been satisfied |

---

## Exemption Revocation Reasons

| Code | Description |
|------|-------------|
| exemption.revoke.unknown | Exemption revoked for an unspecified reason |
| exemption.revoke.16hr.insufficient-prior-work-shift-history | Insufficient work shift history to determine eligibility |
| exemption.revoke.16hr.did-not-start-at-assigned-terminal | Driver did not start at the assigned home terminal |
| exemption.revoke.16hr.did-not-end-at-assigned-terminal | Driver did not end at the assigned home terminal |
| exemption.revoke.16hr.prior-sixteen-hour-exemption-detected | Prior 16-hour exemption already detected |
| exemption.revoke.16hr.no-assigned-home-terminal | No assigned home terminal |
| exemption.revoke.16hr.repeated-sixteen-hour-exemption | 16-hour exemption used too frequently |
| exemption.revoke.16hr.sixteen-hour-exemption-not-used | Conditions for the exemption were not met |

---

## Warning Codes

| Code | Description |
|------|-------------|
| warning.insufficient-cycle-history | Insufficient cycle history available |
| warning.unknown-events | One or more events could not be interpreted |
| warning.unknown-exemptions | One or more exemptions could not be interpreted |
| warning.16hr-exemption | 16-hour exemption is active |
| warning.adverse-conditions | Adverse driving conditions exemption is active |
| warning.short-haul.violation-detected | Short-haul violation detected |
| warning.short-haul.work-shift-time-unavailable | Work shift duration could not be determined |
| warning.short-haul.exceeded-work-shift-limit | Short-haul work shift limit exceeded |
| warning.short-haul.user-reported-outside-air-mile-radius | Driver reported travel beyond the short-haul radius |
| warning.short-haul.detected-outside-air-mile-radius | System detected travel beyond the short-haul radius |
| warning.short-haul.missing-home-terminal | Home terminal is not assigned |
| warning.short-haul.missing-starting-location | Starting location is unavailable |
| warning.short-haul.started-away-from-home-terminal | Driver started away from the assigned home terminal |
| warning.short-haul.missing-ending-location | Ending location is unavailable |
| warning.short-haul.ended-away-from-home-terminal | Driver ended away from the assigned home terminal |
| warning.short-haul.approaching-air-mile-radius-limit | Approaching short-haul radius limit |

---

## Violations

| Code | Description |
|------|-------------|
| violation.us.property.11hour | Property Carrier 11-Hour Driving Limit |
| violation.us.property.14hour | Property Carrier 14-Hour On-Duty Limit |
| violation.us.property.rest-break | Property Carrier 30-Minute Break Requirement |
| violation.us.passenger.10hour | Passenger Carrier 10-Hour Driving Limit |
| violation.us.passenger.15hour | Passenger Carrier 15-Hour On-Duty Limit |
| violation.us.cycle.7day | 60-Hour / 7-Day Cycle Limit |
| violation.us.cycle.8day | 70-Hour / 8-Day Cycle Limit |

---

## Clocks

| Code | Description |
|------|-------------|
| clock.us.property.11hour | Property Carrier Driving Time Remaining |
| clock.us.property.14hour | Property Carrier On-Duty Time Remaining |
| clock.us.property.rest-break | Time Remaining Until Required Break |
| clock.us.passenger.10hour | Passenger Carrier Driving Time Remaining |
| clock.us.passenger.15hour | Passenger Carrier On-Duty Time Remaining |
| clock.us.cycle.7day | Remaining Time in 60-Hour / 7-Day Cycle |
| clock.us.cycle.8day | Remaining Time in 70-Hour / 8-Day Cycle |

---

## Restart Types

| Code | Description |
|------|-------------|
| restart.workshift | Work Shift Reset |
| restart.sleeper-berth-provision | Sleeper Berth Provision Reset |
| restart.cycle | Cycle Restart |