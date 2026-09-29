export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** ISO timestamp → "16 Sep 2026, 22:31 UTC"; anything unparseable is returned as-is. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = String(d.getUTCHours()).padStart(2, "0"), mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${hh}:${mm} UTC`;
}

export function timeTag(iso: string): string {
  return `<time datetime="${escapeHtml(iso)}">${escapeHtml(formatDate(iso))}</time>`;
}

export function safeUrl(value: string, fallback: string): string {
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return value;
  } catch {
    // fall through to fallback
  }
  return fallback;
}


/** The shared PicoDeck look (colours, fonts, pd- components), published by the
 *  website repo. v1 only ever gains classes, so linking it live is safe. */
export const BRAND = "https://picodeck.net/brand/v1";

// Store-specific layout. Components come from brand.css; this only arranges them,
// plus a readable fallback if brand.css cannot load.
const CSS = `
body{margin:0;background:#000;color:#fff;font:17px/1.55 system-ui,sans-serif}a{color:#8ca2ff}
[hidden]{display:none!important}
time{white-space:nowrap}
.store-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px 40px;padding-block:48px 28px}
.store-head .intro{margin-top:12px;max-width:44em;color:var(--pd-dim)}
.store-meta{display:flex;flex-wrap:wrap;gap:4px 24px;margin-top:10px;font-size:15px;color:var(--pd-dim)}
.store-nav{flex:none}
.crumb{font:400 16px/24px var(--pd-pixel);-webkit-font-smoothing:none}
.list-tools{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;padding-block:24px 12px}
.tools{display:flex;gap:8px}.tools input{width:280px;min-width:0}
.listing{padding-bottom:64px}
.pd-hints{background:#000;border-top:0}
.pd-hints>.pd-wrap{height:auto;padding-block:6px 20px;color:var(--pd-dim);font-size:13px}
.pd-row{scroll-margin:72px 0 56px}
.empty{padding:40px 12px;color:var(--pd-dim)}.empty strong{color:#fff}.empty .pd-btn{margin-top:20px}
.notice{margin-top:40px;max-width:52em}
.prose{max-width:48em;padding-bottom:64px}.prose>*+*{margin-top:16px}.prose h2{margin-top:48px;font:400 24px/32px var(--pd-pixel)}
.prose ol,.prose ul{padding-left:24px}.prose li+li{margin-top:8px}
.reasons-wrap>summary{cursor:pointer;display:inline-flex;align-items:center;min-height:40px;padding:0 16px;font:400 16px/1 var(--pd-pixel);background:var(--pd-btn);border:2px solid var(--pd-field-edge)}
.reasons-wrap[open]>summary{margin-bottom:12px}
.reasons{display:grid;grid-template-columns:max-content minmax(0,1fr);margin:0;border-top:2px solid var(--pd-rule)}
.reasons dt,.reasons dd{margin:0;padding:10px 0;border-bottom:2px solid var(--pd-rule)}.reasons dt{padding-right:24px;white-space:nowrap}
.reasons .head{font:400 16px/24px var(--pd-pixel);color:var(--pd-dim)}
.app-grid{display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:48px;align-items:start;padding-bottom:64px}
.app-main>*+*{margin-top:24px}
.app-head{display:flex;align-items:center;gap:24px}.app-head .store-meta{margin-top:6px}
.app-side{display:grid;gap:24px}
.facts{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:10px 24px;margin:0;font-size:15px}.facts dt{color:var(--pd-dim)}.facts dd{margin:0;min-width:0;overflow-wrap:anywhere;display:flex;align-items:center;gap:10px}
.shots{display:flex;flex-wrap:wrap;gap:12px}.shots img{max-width:100%;border:2px solid var(--pd-rule);image-rendering:pixelated}
.hashbox{display:flex;gap:12px;align-items:flex-start}.hash{flex:1;min-width:0;font:400 14px/1.6 var(--pd-mono);word-break:break-all;background:none;padding:0}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:40px}
.stat{padding:20px;border:2px solid var(--pd-rule)}.stat b{display:block;font:400 32px/40px var(--pd-pixel);-webkit-font-smoothing:none}.stat span{color:var(--pd-dim);font-size:15px}
.status-line{display:inline-flex;align-items:center;gap:10px;margin-top:12px;font:400 16px/24px var(--pd-pixel);color:var(--pd-ok)}.status-line.warn{color:var(--pd-warn)}
.status-line::before{content:"";width:14px;height:14px;background:currentColor}
.section{padding-bottom:64px}.section>*+*{margin-top:16px}.section h2{font:400 24px/32px var(--pd-pixel);margin-top:40px}
.scroll{overflow-x:auto;max-width:100%}
table{border-collapse:collapse;width:100%}td,th{text-align:left;padding:10px 16px;border-bottom:2px solid var(--pd-rule);vertical-align:top}td:first-child{white-space:nowrap}tr:last-child td{border-bottom:0}th{font:400 16px/24px var(--pd-pixel);color:var(--pd-dim)}
@media(max-width:899px){.app-grid{grid-template-columns:minmax(0,1fr)}}
@media(max-width:719px){.store-head{padding-block:32px 20px}.tools{flex:1 1 100%}.tools label{flex:1;min-width:0}.tools input{width:100%}.app-head{align-items:flex-start;gap:16px}.app-head .pd-icon-lg{width:64px;height:64px}.reasons{grid-template-columns:minmax(0,1fr)}.reasons dt{border-bottom:0;padding-bottom:2px}.reasons .head:last-of-type{display:none}.pd-actions .pd-btn{flex:1 1 100%}}
`;

// A white "P" in the device's 6x8 font on the launcher's header navy (same as picodeck.net/favicon.svg).
const FAVICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 9' shape-rendering='crispEdges'><rect width='9' height='9' fill='%23101439'/><path fill='%23fff' d='M2 1h4v1h-4zM2 2h1v1h-1zM6 2h1v1h-1zM2 3h1v1h-1zM6 3h1v1h-1zM2 4h4v1h-4zM2 5h1v1h-1zM2 6h1v1h-1zM2 7h1v1h-1z'/></svg>";

const NAV: Array<[string, string]> = [["/", "Apps"], ["/publish", "Publish"], ["/status", "Status"]];

export interface PageOptions {
  title: string;
  description: string;
  body: string;
  script?: string;
  /** Current store page, marked in the store tabs. */
  path?: string;
  /** Page heading and the HTML under it; without one the head shows a link back to the list. */
  heading?: string;
  intro?: string;
  /** Latest firmware version, shown as the status readout in the title bar. */
  firmware?: string;
  /** Render the body full width instead of inside the page column (the category bar spans the page). */
  wide?: boolean;
}

export function renderPage(opts: PageOptions): string {
  const tabs = NAV.map(([href, label]) => `<a class="pd-tab" href="${href}"${href === opts.path ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const lead = opts.heading
    ? `<div><h1 class="pd-title">${escapeHtml(opts.heading)}</h1>${opts.intro ?? ""}</div>`
    : `<a class="crumb" href="/">← All apps</a>`;
  const status = opts.firmware ? `<a class="pd-status" href="https://picodeck.net/download/">v${escapeHtml(opts.firmware)}</a>` : "";
  const main = opts.wide ? opts.body : `<div class="pd-wrap">${opts.body}</div>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<link rel="icon" href="${FAVICON}">
<meta name="description" content="${escapeHtml(opts.description)}">
<title>${escapeHtml(opts.title)}</title>
<link rel="preload" href="${BRAND}/picodeck-6x8.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${BRAND}/brand.css">
<style>${CSS}</style>
</head>
<body class="pd-page">
<header class="pd-titlebar"><div class="pd-wrap">
<a class="pd-brand" href="https://picodeck.net/">PicoDeck</a>
<nav class="pd-nav" aria-label="Site"><a href="https://picodeck.net/try/">Try it</a><a href="https://picodeck.net/docs/">Docs</a><a href="/" aria-current="page">Store</a>${status}</nav>
</div></header>
<main class="pd-main">
<div class="store-head pd-wrap">${lead}<nav class="store-nav pd-tabs" aria-label="Store">${tabs}</nav></div>
${main}
</main>
<footer class="pd-footer"><div class="pd-wrap"><span class="pd-footer-note">PicoDeck App Store</span><nav aria-label="Footer"><a href="/publish">Publishing guide</a><a href="/status">Index status</a><a href="/catalog.json">Catalog JSON</a><a href="https://picodeck.net">picodeck.net</a><a href="https://github.com/PicoDeck/picodeck">PicoDeck on GitHub</a></nav></div></footer>
${opts.script ? `<script>${opts.script}</script>` : ""}
</body>
</html>`;
}
