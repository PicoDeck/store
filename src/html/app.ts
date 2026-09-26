import type { Catalog, CatalogApp } from "../catalog";
import { escapeHtml as e, renderPage, safeUrl, timeTag } from "./layout";
import { CATEGORY_NAMES, zipUrl, formatSize, iconMarkup } from "./index";

const SCRIPT = `
const b=document.getElementById('copy');if(b&&navigator.clipboard){b.hidden=false;b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.hash);b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1500);}catch(e){}});}`;

export function renderAppPage(a: CatalogApp, catalog: Catalog): string {
  const fwNote = catalog.firmware && a.min_firmware !== "0.0.0" ? ` <span class="pd-dim">(current ${e(catalog.firmware.version)})</span>` : "";
  const repoUrl = `https://github.com/${a.repo}`;
  const homepageUrl = safeUrl(a.homepage, repoUrl);
  const showHomepage = homepageUrl !== repoUrl && !homepageUrl.includes(`github.com/${a.repo}`);
  const body = `
<div class="app-grid">
<div class="app-main">
<div class="app-head">${iconMarkup(a, "pd-icon-lg")}<div>
<h1 class="pd-title">${e(a.name)}</h1>
<p class="store-meta"><span>v${e(a.version)}</span><span>by ${e(a.author)}</span><span>★ ${a.stars}</span></p></div></div>
<p>${e(a.description.replace(/\.\s*$/, ""))}${a.long_description ? `</p><p>${e(a.long_description)}` : ""}</p>
${a.screenshots.length ? `<div class="shots">${a.screenshots.map((s) => `<img src="${e(s)}" alt="Screenshot of ${e(a.name)}" loading="lazy">`).join("")}</div>` : ""}
<div class="pd-actions"><a class="pd-btn pd-btn-primary" href="${e(zipUrl(a))}">Download ZIP (${formatSize(a.size_kb)})</a><a class="pd-btn" href="${e(repoUrl)}">Source on GitHub</a>${showHomepage ? `<a class="pd-btn" href="${e(homepageUrl)}">Homepage</a>` : ""}</div>
<div class="pd-note"><h2 class="pd-label">Install</h2><p>Open App Store on your PicoCalc and pick <strong>${e(a.name)}</strong>. To install by hand, unzip the download into <code>/apps/${e(a.dirname)}</code> on the SD card.</p></div>
</div>
<aside class="app-side">
<section class="pd-panel" aria-label="Details"><div class="pd-panel-title">/apps/${e(a.dirname)}</div><div class="pd-panel-body">
<dl class="facts">
<dt>Category</dt><dd class="pd-c-${e(a.category)}"><span class="pd-dot"></span>${e(CATEGORY_NAMES[a.category] ?? a.category)}</dd>
<dt>App type</dt><dd>${a.app_type === "native" ? "Native (ELF)" : "Lua"}</dd>
<dt>Requires</dt><dd>${a.requirements.length ? a.requirements.map(e).join(", ") : "nothing extra"}</dd>
<dt>Min firmware</dt><dd>${e(a.min_firmware)}${fwNote}</dd>
<dt>Id</dt><dd><code>${e(a.id)}</code></dd>
<dt>Release</dt><dd>${e(a.release_tag)}</dd>
<dt>Last push</dt><dd>${timeTag(a.pushed_at)}</dd>
${a.keywords.length ? `<dt>Keywords</dt><dd>${a.keywords.map(e).join(", ")}</dd>` : ""}
</dl></div></section>
<section class="pd-panel"><div class="pd-panel-title">SHA-256 of the ZIP</div><div class="pd-panel-body hashbox">
<code class="hash">${e(a.sha256)}</code><button id="copy" class="pd-btn pd-btn-small" type="button" data-hash="${e(a.sha256)}" hidden>Copy</button>
</div></section>
</aside>
</div>`;
  return renderPage({ title: `${a.name} · PicoDeck App Store`, description: a.description, body, script: SCRIPT, path: "/", firmware: catalog.firmware?.version });
}
