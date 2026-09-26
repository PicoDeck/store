# Visual critic reviews of the web store

These are independent reviews of the web pages at <https://picos.jeffory.dev>,
run on 17 September 2026 with the `visual-critic` skill. Each critic was a
separate agent that saw only labelled screenshots and a fixed brief. It was
never told what the site is for, how it was built, or what anyone suspected.
Each report here is the critic's own text, unedited.

The loop ran for its limit of five passes. After each review the site was
fixed and every screen was captured again.

| Pass | Critic | Screens | Overall | Fixes made in response |
|------|--------|---------|---------|------------------------|
| [1](01-report.md) | Antigravity, Gemini 3.8 Flash | 10 | 3/10 | `f253b53` |
| [2](02-report.md) | Antigravity, Gemini 3.8 Flash | 12 | 5/10 | `121fa1e` |
| [3](03-report.md) | Antigravity, Gemini 3.8 Flash | 12 | 7/10 | `1c1ffc4` |
| [4](04-report.md) | Antigravity, Gemini 3.8 Flash | 12 | 5/10 | `afdb688` |
| [5](05-report.md) | Claude Opus | 12 | 5/10 | `858b152`, `d49fd4b` |

The loop's pass mark is an overall score of 8 with no screen below 7. No pass
reached it.

## Reading the scores

Passes 1 to 4 and pass 5 were judged by different critics, so their scores
don't compare directly. The Flash critic's scores swung between passes, and
pass 4 contains two findings that are not in its screenshots. It reports a
"publishing.guide" typo that the page never had. It also reports a 200px jump
in the header nav, which in fact sits at the same place on every page; what
did move was the guide's body column. The Opus critic measured from the pixels
instead, and its findings held up when checked.

## What is still open

Pass 5's list, after the fixes in `858b152`, leaves these for a product decision:

- **App artwork.** `app.json` now accepts optional `icon` and `screenshots`,
  but no published app uses them yet, so cards show a monogram tile.
- **The catalogue reads as seed data.** All three apps are first-party games.
- **Wayfinding on the long publishing guide.** It has no contents list or
  in-page links.
- **Framing.** The critic read the site as a documentation site that lists
  downloads rather than a store.

## What was not kept

The screenshots from every pass were lost with the session's temporary
directory, and can't be retaken because the site has changed since. So was
the full text of an earlier baseline run, where one agent reviewed the site
itself without the skill. Only a summary of that run survives: it scored the
site 6.5/10 and was the first to find the broken category filter.
