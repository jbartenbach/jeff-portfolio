# Compliance Calculation Request

The compliance calculation endpoint accepts a request containing driver information, compliance settings, and historical activity.

HOS Codex is a stateless compliance engine. The API does not store driver history between requests. Each request must include sufficient historical activity to calculate compliance correctly.

For most U.S. property carrier scenarios, providing at least 14 days of history is recommended to ensure accurate cycle calculations, restart detection, shift construction, and violation analysis.

## Request Example

~~~json
{
  "driver_id": "J73",
  "ruleset": "ruleset.us.interstate.property.7day",
  "calculation_end_utc": "2026-05-31T03:00:00Z",
  "start_of_day_offset": "0:00:00:00",
  "iana_id": "America/Los_Angeles",
  "home_terminal": {
    "location_id": "ED",
    "name": "Edmonds",
    "latitude": 47.8112,
    "longitude": -122.3769,
    "city": "Edmonds",
    "state": "WA",
    "postal_code": "98020",
    "country": ""
  },
  "settings": null,
  "events": [
    {
      "timestamp_utc": "2026-05-23T06:00:00Z",
      "event_type": "event-type.duty-status-change",
      "event_code": "",
      "ruleset": "",
      "duty_status": "duty-status.off",
      "exemption": "",
      "origin": "origin.manual",
      "odometer": 0,
      "engine_hours": 0,
      "event_id": "",
      "location": null
    }
  ]
}
~~~

## Properties

### driver_id

Unique identifier for the driver.

### ruleset

Default ruleset used to perform the compliance calculation.

The API will attempt to determine the driver’s active ruleset from the supplied event history. If the active ruleset cannot be determined from the events, the value provided here will be used.

If your drivers may operate under multiple rulesets, ruleset change events can be included in the event history. In that case, the request-level ruleset acts as the starting or fallback ruleset when necessary.

Customer-specific values may be normalized into the HOS Codex compliance model.

### calculation_end_utc

The point in time at which compliance should be calculated.

All timestamps must be provided in UTC.

### start_of_day_offset

Offset from midnight used to determine the start of the driver's reporting day.

The offset is applied to local midnight in the driver's time zone. For example, a value of 06:00 causes the reporting day to begin at 6:00 AM local time instead of 12:00 AM.

This value affects daily calculations and reporting boundaries.

Examples:

- 00:00 = Day starts at midnight
- 06:00 = Day starts at 6:00 AM
- 08:00 = Day starts at 8:00 AM

Format:

Use an offset in HH:mm format.

Example:

~~~text
06:00
~~~

If omitted or invalid, a value of 00:00 (midnight) is assumed.

### iana_id

IANA time zone identifier used for local time calculations.

Examples:

~~~text
America/Los_Angeles
America/Chicago
America/New_York
~~~

### home_terminal

Optional home terminal location.

Used for short-haul calculations and terminal-based reporting.

See Locations.md for additional details.

### settings

Optional request-specific settings.

When omitted or null, the default customer configuration is used.

Settings may be supplied to override the default configuration for a single request.

See Settings API for details.

### events

Driver history used to calculate compliance.

Events may be supplied in any order and are automatically sorted by timestamp before processing.

See Events.md for detailed event documentation.

## Time Handling

- All timestamps must be supplied in UTC.
- Local time calculations are performed using the supplied IANA time zone.
- Events do not need to be submitted in chronological order.

## Data Normalization

HOS Codex uses a normalized compliance model.

Customer-specific values such as:

- Event types
- Duty statuses
- Exemptions
- Rulesets
- Origins
- Other domain-specific values

may be mapped into the internal model without requiring changes to your existing system.

## Available Compliance APIs

HOS Codex provides two compliance calculation endpoints.

### compliance/summary

Returns the driver's current compliance state.

This endpoint is optimized for operational use cases where only the driver's current status is needed.

The response includes information such as:

- Current compliance status
- Current exemption status
- Available drive time
- Available on-duty time
- Current clock values
- Active ruleset information
- Other current compliance metrics

### compliance/report

Returns a detailed compliance report.

In addition to the current compliance summary, this endpoint provides historical compliance information for each applicable ruleset.

For each ruleset, the response includes:

- Current ruleset summary
- Historical work shifts
- Historical cycle days
- Historical violations
- Historical warnings
- Other compliance activity within the current cycle window

This endpoint is typically used for compliance analysis, auditing, reporting, diagnostics, and ERODS-style workflows.