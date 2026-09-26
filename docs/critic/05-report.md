# Visual critique — PicOS App Store (site), iteration 5

Reviewed from screenshots only. Measurements below were taken from the pixels
(crops enlarged 200–400%, colour sampling, left-edge detection).

## 1. Per-screenshot scores

- **01-listing-default-desktop.png — 5/10** — Clean, legible, obviously an app list, but it shows three apps with no icon or screenshot between them, an unlabelled metadata token run, and roughly a third of the viewport left empty below the fold-height content.
- **02-listing-filter-tools-desktop.png — 4/10** — The empty state is present and polite, yet it advises "clear the search" when no search is active, and it is reached from five of seven filter chips that lead nowhere.
- **03-app-detail-doom-desktop.png — 4/10** — The page a visitor lands on to decide whether to install shows no picture of the app, repeats size and version three times, files a SHA-256 checksum under "Compatibility", and leaves the right column dead for 280px below its only card.
- **04-status-desktop.png — 6/10** — Purpose is immediately clear and the status wording is honest; undermined by a fourth stat tile that puts a clock in the headline slot and wraps its label to an orphan line, and by the same third-of-a-screen emptiness.
- **05-publish-desktop.png — 5/10** — Well-written instructions, but the body column starts 139px right of the site title and footer rail (measured: H1 at x=389, header at x=250), so the page visibly steps in and back out.
- **06-listing-default-mobile.png — 5/10** — Stacks sensibly, but "UTC" is orphaned on its own line, metadata sits at ~11px, and "Details"/"Source" are bare text links roughly 20px tall next to a 38px button.
- **07-app-detail-doom-mobile.png — 5/10** — Full-width primary/secondary buttons are the strongest moment in the set, spoiled by a two-line ~10px hash with a ~22px "Copy" target and, again, no image of the app anywhere.
- **08-status-mobile.png — 6/10** — Reads well at 390px; the bottom row of stat tiles has mismatched content heights so the left tile is visibly half empty, and the clock tile still inverts number-and-label hierarchy.
- **09-publish-mobile.png — 4/10** — The JSON sample soft-wraps mid-value so `text",` lands alone at the left margin, misrepresenting the exact file the reader is being told to copy.
- **10-listing-filter-tools-mobile.png — 4/10** — The "no results" panel and the "Get your app listed" promo are the same white rounded card, so the system message does not read as a system message; same incorrect "clear the search" copy.
- **11-publish-mobile-fullpage.png — 4/10** — 3,813px of unbroken scroll with no sticky nav, no table of contents and no back-to-top; the rejection reference collapses so the defined term and the code quoted inside its definition are typographically identical.
- **12-publish-desktop-fullpage.png — 5/10** — Shows the full misalignment and a 21-row reference table with no column headers; the page ends on two sentences of "Updating" and drops straight into the footer with no next step.

## 2. Overall score

**5/10** — Everything is legible and nothing is broken, and the writing is unusually clear for a developer-facing index; contrast passes everywhere I sampled (body grey #5a5a5a and inline code #873e1b both exceed 7:1 on white). But it reads as a documentation site that happens to list downloads, not as a store: there is no app imagery on any screen, the listing and status pages leave a third of the desktop viewport blank, and the two pages a publisher and a shopper actually use each contain a copy or layout error that a careful reviewer would stop on.

## 3. Issues, most severe first

1. **No app imagery anywhere** — no icons, no screenshots, no device mockups; every app is a text block, so a visitor cannot tell what any app looks like on the PicoCalc before downloading. (01, 03, 06, 07)
2. **Publish page body column breaks the site's alignment rail** — H1 and all body copy sit 139px right of the site title and footer, which align at x≈250 on every other page; the page's left edge steps in and back out. (05, 12)
3. **Empty-state copy is wrong for the state shown** — "Try another category, or clear the search" is offered when the search box is empty; separately, five of the seven category chips lead to this dead end with no counts or disabled styling to warn the user. (02, 10)
4. **JSON sample soft-wraps on mobile** — `"long_description": "Optional detail text",` breaks across lines with `text",` at the left margin, corrupting the structure of a file the reader is meant to reproduce exactly. (09, 11)
5. **Tap targets below the 44px minimum on mobile** — "Details" and "Source" text links (~20px), the "Copy" button (~22px), "Show all apps" (~34px), "← All apps" (~20px). (06, 07, 10)
6. **Card metadata is an unlabelled token run** — "Games v1.0.1 PicOS 2.0 MB ★ 0" with only whitespace between four different kinds of value; "PicOS" in particular gives no clue it is the author. (01, 06)
7. **Default sort is "Most stars" while every app shows ★ 0** — the primary ordering control sorts by a field that is uniformly zero, so it appears to do nothing. (01, 03, 06)
8. **Redundant facts on the detail page** — size appears twice (button, Details card), version three times (title, Details "1.0.0 · release v1.0.0"). (03, 07)
9. **A checksum is filed under "Compatibility"** — SHA-256 of the ZIP is not compatibility information and does not belong in that group. (03, 07)
10. **Desktop pages end early and leave large voids** — ~300px of empty space above the footer on the listing, filter and status pages; on the detail page the right column stops 280px above the left one, leaving a visibly lopsided two-column layout. (01, 02, 03, 04)
11. **Weak hierarchy on the long guide** — section headings are barely larger than body text, the "▼ All rejection reasons" disclosure is a ~12px bold line with no button affordance, and its 21-row two-column table has no column headers. (05, 12)
12. **Fourth status tile breaks the pattern it sits in** — tiles 1–3 are a large number plus a two-word label; tile 4 is a clock plus a wrapping "last refresh, 16 Sep 2026 · every 30 min", with the date demoted below a time. (04, 08)
13. **Promotional box is styled as an app card** — the "Get your app listed" panel uses the same white rounded card as the app cards and sits in the same column, so it can be misread as a fourth listing. (01, 02, 10)
14. **No wayfinding on a very long mobile page** — the guide runs to 3,813px with a non-sticky nav and no in-page anchors. (11)
15. **Three competing actions per card** — a filled "Download ZIP" plus two identically weighted underlined links, with no visual distinction between the in-site "Details" and the off-site "Source". (01, 06)
16. **Orphaned line breaks in the sub-header** — "UTC" alone on line two of the meta line on both mobile listing states. (06, 10)
17. **The SHA-256 is set in plain sans** while every other code token on the site is orange monospace, so the one string most in need of character-level reading gets the least code-like treatment. (03, 07)
18. **The catalogue reads as seed data** — all three apps are authored "PicOS", all are "Games", all have zero stars, and the featured id is `com.id.doom`; a first-time visitor sees no third-party content at all. (01, 03)

## 4. Cross-screen issues

1. The content rail moves: listing, detail and status align H1 to the header at x≈256; the publish page insets it to x≈389 — the only page that does. (01, 04 vs 05, 12)
2. Footer behaviour differs by viewport: pinned to the bottom of the desktop viewport after a ~300px gap, but hugging the last content block on mobile. (01, 04 vs 08, 10)
3. Four different labels point at the same publishing guide — nav "Publish", callout "Read the publishing guide", footer "Publish your app", status page "publishing guide". (01, 02, 04, 08)
4. Three action tiers are used inconsistently for the same job: "Source on GitHub" is an outlined button on the detail page but a bare underlined "Source" link on the cards; "Show all apps" is outlined while the comparable "All" chip is a filled pill. (01, 02, 03)
5. Code-token styling is not one system: orange monospace for ids and paths, plain dark sans for the hash, the same orange mono for both a rejection code and the code quoted inside its own definition. (03, 11, 12)
6. Category vocabulary is presented two ways: Title Case chips ("Games", "Tools") on the listing, lowercase code values (`games, tools, system, demos, emulators, network`) in the guide, with nothing connecting them. (01, 05)
7. The nav changes form between viewports (underlined text links → full-width segmented control) and the active state changes with it (underline only → grey fill plus underline), so the two navs do not read as the same component. (01 vs 06)
8. Emptiness is systemic rather than per-page: three of the five desktop screens end in a large blank band, which makes the site as a whole feel unfinished regardless of which page you land on. (01, 02, 03, 04)

## 5. Inadequate screenshots

No capture was unusable — all are full, settled states at the stated viewports, and I scored all twelve.

Two gaps in the evidence limited the review, and a usable capture would show:

- **Mobile app detail below the fold** — 07 cuts off inside the SHA-256 block, so the mobile treatment of the "Details" card (Id, Version, Size, Last push) and the bottom of the page is never shown; a scrolled or full-page mobile detail capture would close this.
- **Search-active and interaction states** — no screenshot shows the search field with a query and results, nor any hover, focus or keyboard-focus ring on the chips, links and buttons; a capture with a typed query and one with a focused control would let the filter feedback loop and keyboard accessibility be judged rather than assumed.
