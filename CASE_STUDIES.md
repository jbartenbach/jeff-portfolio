# Case studies (site)

## Template (Google Doc)

The on-site case study layout follows the same section flow as the shared template:

**[Case Study (Template)](https://docs.google.com/document/d/1FXnJ26Nbs4B8df3SsC2hplmi_CUbLlfk1tx4dIEBpac/edit?usp=sharing)**

Mapped sections in code (`src/content/caseStudies.ts` → `sections[]`):

| Template (typical) | Field in code |
| --- | --- |
| Overview | `overview` |
| Context | `context` |
| The challenge | `challenge` |
| Goals & success metrics | `goals` |
| My role | `role` |
| Process | `process` |
| Solution | `solution` |
| Outcomes & impact | `outcomes` |
| Learnings | `learnings` |

Each study also has a **header block** (title, subtitle, dek, meta rows) and optional **summary strip** (key numbers).

## Published example

**[case study: Wink (Google Doc)](https://docs.google.com/document/d/1Yz-tNZc85uEUszsqKSGWyz5nFh1-1EMbjfhSkPn1omU/edit?usp=sharing)** — paste final copy into `caseStudiesBySlug.wink` in `src/content/caseStudies.ts` to match the doc word-for-word.

## Routes

- `/work` — index of all case studies (published + “coming soon” placeholders)
- `/work/:slug` — individual case study (e.g. `/work/wink`)

## Adding a new case study

1. Add an entry to `caseStudyList` in `src/content/caseStudies.ts` and set `published: true` when ready.
2. Add a full `CaseStudy` object to `caseStudiesBySlug` with the same `slug`.
3. Optionally update the homepage “Selected work” cards in `src/pages/PortfolioHome.tsx` (or drive them from `caseStudyList` later).

Paste copy from your Google Doc into `paragraphs` / `bullets` to stay aligned with the template.
