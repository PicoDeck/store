import { CATEGORIES, type Catalog, type CatalogApp } from "../catalog";
import { escapeHtml as e, renderPage, timeTag } from "./layout";

export function zipUrl(a: CatalogApp): string {
  return `https://github.com/${a.repo}/releases/download/${a.release_tag}/${a.asset}`;
}

export function formatSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

/** The app's own icon, or a monogram tile in its category colour, like the launcher draws. */
export function iconMarkup(a: CatalogApp, extraClass = ""): string {
  const cls = `pd-icon pd-c-${a.category}${extraClass ? " " + extraClass : ""}`;
  if (a.icon) return `<img class="${cls}" src="${e(a.icon)}" alt="" loading="lazy">`;
  const letter = a.name.trim()[0] ?? "?"; // as-is, like the launcher ("b" for block.exe)
  return `<span class="${cls}" aria-hidden="true">${e(letter)}</span>`;
}

export const CATEGORY_NAMES: Record<string, string> = {
  all: "All", games: "Games", tools: "Tools", system: "System", demos: "Demos", emulators: "Emulators", network: "Network",
};

function row(a: CatalogApp): string {
  const search = [a.name, a.description, a.author, a.id, ...a.keywords].join(" ").toLowerCase();
  return `<li class="pd-row" data-category="${e(a.category)}" data-stars="${a.stars}" data-pushed="${e(a.pushed_at)}" data-name="${e(a.name.toLowerCase())}" data-search="${e(search)}">
${iconMarkup(a)}<span class="pd-row-name"><a href="/apps/${e(a.id)}">${e(a.name)}</a></span><span class="pd-row-meta">${e(a.version)}</span>
<span class="pd-row-desc">${e(a.description.replace(/\.\s*$/, ""))}</span><span class="pd-row-aside">★ ${a.stars}</span>
</li>`;
}

// Filtering, sorting and the launcher's keys: ↑↓ move through the list, ←→ change category, / searches.
const SCRIPT = `
const q=document.getElementById('q'),sort=document.getElementById('sort'),grid=document.getElementById('grid'),empty=document.getElementById('empty');
const rows=[...grid.querySelectorAll('.pd-row')],tabs=[...document.querySelectorAll('.cats .pd-tab')];let cat='all';
function apply(){const t=q.value.trim().toLowerCase();let n=0;
for(const r of rows){const ok=(cat==='all'||r.dataset.category===cat)&&(!t||r.dataset.search.includes(t));r.hidden=!ok;if(ok)n++;}
const msg=document.getElementById('emptymsg');if(msg)msg.textContent=t?'Nothing matches that search.':'No apps in this category yet.';
const key=sort.value;const vis=rows.filter(r=>!r.hidden).sort((a,b)=>key==='name'?a.dataset.name.localeCompare(b.dataset.name):key==='pushed'?b.dataset.pushed.localeCompare(a.dataset.pushed):(+b.dataset.stars)-(+a.dataset.stars));
const f=document.activeElement;for(const r of vis)grid.appendChild(r);if(f&&grid.contains(f)&&!f.closest('[hidden]'))f.focus();empty.hidden=n>0;grid.hidden=n===0;const count=document.getElementById('count');if(count)count.textContent=(n===rows.length?n+' app'+(n===1?'':'s'):n+' of '+rows.length+' apps');}
function pick(b){cat=b.dataset.cat;for(const o of tabs)o.setAttribute('aria-pressed',o===b);apply();}
q.addEventListener('input',apply);sort.addEventListener('change',apply);
const reset=document.getElementById('reset');if(reset)reset.addEventListener('click',()=>{q.value='';pick(tabs[0]);});
for(const b of tabs)b.addEventListener('click',()=>pick(b));
document.addEventListener('keydown',e=>{
if(e.target===q){if(e.key==='Escape')q.blur();return;}
if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,select,textarea'))return;
if(e.key==='/'){e.preventDefault();q.focus();return;}
if(e.key==='ArrowLeft'||e.key==='ArrowRight'){const on=tabs.filter(b=>!b.disabled);let i=on.findIndex(b=>b.getAttribute('aria-pressed')==='true');i=(i+(e.key==='ArrowRight'?1:-1)+on.length)%on.length;pick(on[i]);if(e.target.closest('.cats'))on[i].focus();e.preventDefault();return;}
if(e.key==='ArrowDown'||e.key==='ArrowUp'){const links=[...grid.querySelectorAll('.pd-row:not([hidden]) .pd-row-name a')];if(!links.length)return;let i=links.indexOf(document.activeElement);i=i<0?0:Math.max(0,Math.min(links.length-1,i+(e.key==='ArrowDown'?1:-1)));links[i].focus();e.preventDefault();}
});
apply();`;

export function renderIndexPage(catalog: Catalog): string {
  const counts = new Map<string, number>();
  for (const a of catalog.apps) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  // A category nobody has published is disabled rather than a dead end.
  const cats = ["all", ...CATEGORIES].map((c) => {
    const n = c === "all" ? catalog.apps.length : counts.get(c) ?? 0;
    const dot = c === "all" ? "" : '<span class="pd-dot"></span>';
    return `<button class="pd-tab pd-c-${c}" type="button" data-cat="${c}" aria-pressed="${c === "all"}"${n === 0 ? " disabled" : ""}>${dot}<span class="pd-tab-label">${CATEGORY_NAMES[c]}</span><span class="pd-count">${n}</span></button>`;
  }).join("");
  const n = catalog.apps.length;
  const intro = `<p class="intro">Apps for the PicoCalc from GitHub repositories tagged <code>picodeck-app</code>. Install them from App Store on the device, or download the ZIP.</p>
<p class="store-meta">${catalog.firmware ? `<span>Firmware ${e(catalog.firmware.version)}</span>` : ""}<span>Indexed ${timeTag(catalog.generated_at)}</span></p>`;
  const body = `
<div class="pd-tabbar"><div class="pd-wrap">
<div class="cats pd-tabs pd-tabs-collapse" role="group" aria-label="Categories">${cats}</div>
</div></div>
<div class="pd-wrap listing">
<div class="list-tools"><p id="count" class="pd-label">${n} ${n === 1 ? "app" : "apps"}</p>
<div class="tools"><label><span class="pd-sr-only">Search</span><input class="pd-field" id="q" type="search" placeholder="Search apps, authors, ids"></label>
<select class="pd-field" id="sort" aria-label="Sort"><option value="pushed">Recently updated</option><option value="stars">Most stars</option><option value="name">Name</option></select></div></div>
<ul class="pd-list" id="grid"${n ? "" : " hidden"}>${catalog.apps.map(row).join("\n")}</ul>
<div class="empty" id="empty"${n ? " hidden" : ""}>${n ? `<p><strong>No apps match.</strong> <span id="emptymsg">No apps in this category yet.</span></p><button class="pd-btn" type="button" id="reset">Show all apps</button>` : `<p><strong>No apps listed yet.</strong> Be the first: tag a repository with <code>picodeck-app</code>.</p>`}</div>
<div class="pd-note notice"><h2 class="pd-label">Get your app listed</h2><p>Tag a public GitHub repository with <code>picodeck-app</code>, add an <code>app.json</code> and a Release with one ZIP. <a href="/publish">Read the publishing guide</a>.</p></div>
</div>
<div class="pd-hints" aria-hidden="true"><div class="pd-wrap">↑↓:Select  ←→:Category  /:Search  Enter:Open</div></div>`;
  return renderPage({
    title: "PicoDeck App Store", description: "Apps for the ClockworkPi PicoCalc running PicoDeck",
    heading: "App Store", intro, body, script: SCRIPT, path: "/", firmware: catalog.firmware?.version, wide: true,
  });
}
