# HOS Codex Test Kit

This Test Kit provides a set of prebuilt scenarios for evaluating the HOS Codex API.

It is designed to help you quickly test and understand how the system behaves using real-world driver activity patterns.

The kit includes example requests, expected responses, and scenario explanations for both:

- compliance/summary
- compliance/report

---

## ⚠️ Test Environment Notice

This is a test environment.

The API may experience a cold start if it has not been used recently.

During cold start:

- The first request may take longer than normal
- Once warmed up, responses will be significantly faster
- If the system has been idle for a period of time, performance may temporarily slow again

This is expected behavior in the test environment and does not reflect production performance.

---

## Browser table viewer

Open [`table.html`](./table.html) (locally: `/Jeffwa-TestKit/table.html` with `npm run dev`).

Pick a sample scenario and click **Fetch & fill tables** to call the live test API and render clocks, exemptions, violations, and report history in tables.

The page loads `ApiKey.txt` and the sample request JSON from this folder. API calls go through the `/hoscodex` proxy (Vite locally, Netlify in production) because the API does not allow direct browser CORS.

---

## Getting Started (Postman)

This Test Kit is designed for use with Postman.

### Required Setup

Before running any requests, import both:

- The Postman collection
- The Postman environment

The environment file is required. It contains:

- API base URLs (test environment)
- Authentication token
- Preconfigured variables used by the requests

Without the environment, requests will not execute correctly.

---

## Authentication

All requests use the following header:

X-Api-Token: your-api-token

This is already configured in the provided Postman environment.

If you need to set it manually, ensure it is included in every request.

---

## API Documentation (Swagger)

Full API documentation is available here:

https://test.api.hoscodex.com/swagger

This includes all endpoints, request schemas, and response structures.

---

## How to Use This Kit

1. Import both the Postman collection and environment files
2. Open the imported collection in Postman
3. Select a sample scenario request
4. Ensure the correct environment is selected (Test environment)
5. Send the request using the preconfigured setup
6. Compare the response with the included expected output
7. Review the accompanying .md file for context and explanation

---

## What’s Included

This Test Kit contains:

- Prebuilt driver scenarios
- Example request payloads
- Expected API responses
- Scenario-specific documentation (.md files)
- Coverage for both summary and report endpoints

Each scenario is designed to demonstrate a specific behavior of the compliance engine.

---

## Endpoints

### compliance/summary
Returns the driver’s current compliance state, including clocks, availability, and real-time status.

### compliance/report
Returns a full historical compliance view, including:

- Work shifts
- Cycle days
- Violations
- Warning states
- Ruleset history

---

## Notes

- This is a test environment only
- Data is not persisted between requests
- Responses reflect current product behavior and may evolve over time