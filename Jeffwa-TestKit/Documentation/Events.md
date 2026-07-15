## Example Event Payload

```json
{
  "timestamp_utc": "2026-05-30T16:00:00Z",
  "event_type": "event-type.duty-status-change",
  "event_code": "",
  "ruleset": "",
  "duty_status": "duty-status.on-duty",
  "exemption": "",
  "origin": "origin.manual",
  "odometer": 0,
  "engine_hours": 0,
  "event_id": "",
  "location": {
    "location_id": "ED",
    "name": "Edmonds",
    "latitude": 47.8112,
    "longitude": -122.3769,
    "city": "Edmonds",
    "state": "WA",
    "postal_code": "98020",
    "country": ""
  }
}
```

# Event Field Resolution Rules

HOS Codex supports both **typed fields** and a generic `event_code` field to allow flexible integration without requiring data restructuring.

---

## Core Rule

If both a typed field and `event_code` are provided, the typed field always takes precedence.

---

## Resolution Behavior by Event Type

### event-type.duty-status-change — Change in duty status

- Primary field: `duty_status`
- Fallback field: `event_code`

---

### event-type.exemption-applied — Apply exemption

- Primary field: `exemption`
- Fallback field: `event_code`

---

### event-type.ruleset-change — Ruleset change

- Primary field: `ruleset`
- Fallback field: `event_code`

---

### event-type.home-terminal-change — Home terminal change

- Uses: `location`

---

### event-type.outside-short-haul-radius — Outside short-haul radius event

- Uses: `location`
- This is optional if you want to control the 150 air mile radius.  HOS Codex can be configured to monitor it for you (see Short Haul)

---

## Event Type Matrix

Each event type defines which fields are required and which are optional.

| Event Type | Description | Required Fields | Optional Fields |
|------------|-------------|-----------------|------------------|
| event-type.duty-status-change | Change in duty status | `timestamp_utc`, `event_type`, (`duty_status` OR `event_code`) | `location`, `origin`, `odometer`, `engine_hours`, `event_id` |
| event-type.exemption-applied | Apply exemption | `timestamp_utc`, `event_type`, (`exemption` OR `event_code`) | `location`, `origin`, `event_id` |
| event-type.ruleset-change | Ruleset change | `timestamp_utc`, `event_type`, (`ruleset` OR `event_code`) | `location`, `origin`, `event_id` |
| event-type.home-terminal-change | Home terminal change | `timestamp_utc`, `event_type`, `location` | `event_code`, `origin`, `event_id` |
| event-type.outside-short-haul-radius | Outside short-haul radius event | `timestamp_utc`, `event_type` | `event_code`, `origin`, `odometer`, `engine_hours`, `event_id`, `location` |