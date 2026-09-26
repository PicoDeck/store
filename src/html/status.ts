import type { Catalog, DebugInfo } from "../catalog";
import { escapeHtml as e, formatDate, renderPage } from "./layout";

export function renderStatusPage(catalog: Catalog, debug: DebugInfo): string {
  const rows = debug.rejected.map((r) => `<tr><td><a href="https://github.com/${e(r.repo)}">${e(r.repo)}</a></td><td><code>${e(r.reason)}</code></td></tr>`).join("");
  const healthy = debug.warnings.length === 0;
  const intro = `<p class="status-line${healthy ? "" : " warn"}">${healthy ? "Index healthy" : "Index running with warnings"}</p>
<p class="store-meta"><span>Last refresh ${e(formatDate(catalog.generated_at))}, and every 30 minutes.</span></p>`;
  const body = `
<div class="section">
<div class="stats">
<div class="stat"><b>${catalog.apps.length}</b><span>apps listed</span></div>
<div class="stat"><b>${debug.rejected.length}</b><span>repositories rejected</span></div>
<div class="stat"><b>${catalog.firmware ? e(catalog.firmware.version) : "—"}</b><span>latest firmware</span></div>
</div>
<h2>Rejected repositories</h2>
<p>A repository tagged <code>picodeck-app</code> that does not appear in the store is listed here with the reason. See the <a href="/publish">publishing guide</a> for what each reason means.</p>
${debug.rejected.length ? `<div class="pd-panel scroll"><table><thead><tr><th>Repository</th><th>Reason</th></tr></thead><tbody>${rows}</tbody></table></div>` : `<div class="pd-note"><p><strong>Nothing rejected.</strong> No repositories were rejected. Every repository tagged <code>picodeck-app</code> is listed.</p></div>`}
${debug.warnings.length ? `<h2>Warnings</h2><div class="pd-note"><ul style="margin:0;padding-left:24px">${debug.warnings.map((w) => `<li>${e(w)}</li>`).join("")}</ul></div>` : ""}
</div>`;
  return renderPage({ title: "Status · PicoDeck App Store", description: "Index status and rejected repositories", heading: "Index status", intro, body, path: "/status", firmware: catalog.firmware?.version });
}
