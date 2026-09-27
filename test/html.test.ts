import { describe, it, expect } from "vitest";
import { BRAND, escapeHtml, formatDate, renderPage, safeUrl } from "../src/html/layout";
import { renderIndexPage } from "../src/html/index";
import { renderAppPage } from "../src/html/app";
import { renderStatusPage } from "../src/html/status";
import { renderPublishPage } from "../src/html/publish";
import { fixtureApp, fixtureCatalog } from "./helpers/fixtures";

const evil = fixtureApp({ id: "com.evil.app", name: '<script>alert(1)</script>"', description: "a & b", author: "<b>x</b>" });

describe("escapeHtml", () => {
  it("escapes the five characters", () => {
    expect(escapeHtml(`<a href="x">&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;");
  });
});

describe("safeUrl", () => {
  it("allows http and https URLs through unchanged", () => {
    expect(safeUrl("https://example.com/x", "fallback")).toBe("https://example.com/x");
    expect(safeUrl("http://example.com/x", "fallback")).toBe("http://example.com/x");
  });
  it("falls back for javascript:, data:, ftp: and garbage", () => {
    expect(safeUrl("javascript:alert(1)", "fallback")).toBe("fallback");
    expect(safeUrl("data:text/html,<script>alert(1)</script>", "fallback")).toBe("fallback");
    expect(safeUrl("ftp://example.com/x", "fallback")).toBe("fallback");
    expect(safeUrl("not a url", "fallback")).toBe("fallback");
  });
});

describe("formatDate", () => {
  it("renders ISO timestamps as a readable UTC date", () => {
    expect(formatDate("2026-09-16T22:31:23.626Z")).toBe("16 Sep 2026, 22:31 UTC");
  });
  it("passes unparseable input through", () => {
    expect(formatDate("soon")).toBe("soon");
  });
});

describe("renderPage", () => {
  it("wraps body with title and theme meta", () => {
    const html = renderPage({ title: "T", description: "D", body: "<p>hi</p>" });
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("<title>T</title>");
    expect(html).toContain('name="color-scheme" content="dark"');
    expect(html).toContain('<link rel="icon"');
    expect(html).toContain("<p>hi</p>");
  });
  it("links the shared brand stylesheet from picodeck.net", () => {
    const html = renderPage({ title: "T", description: "D", body: "" });
    expect(BRAND).toBe("https://picodeck.net/brand/v1");
    expect(html).toContain('<link rel="stylesheet" href="https://picodeck.net/brand/v1/brand.css">');
    expect(html).toContain('<link rel="preload" href="https://picodeck.net/brand/v1/picodeck-6x8.woff2" as="font" type="font/woff2" crossorigin>');
    expect(html).toContain('<body class="pd-page">');
    expect(html.indexOf("brand.css")).toBeLessThan(html.indexOf("<style>"));
  });
  it("shares the site title bar, with the firmware version when known", () => {
    const html = renderPage({ title: "T", description: "D", body: "", firmware: "0.3.0" });
    expect(html).toContain('<header class="pd-titlebar">');
    expect(html).toContain('<a href="https://picodeck.net/try/">Try it</a>');
    expect(html).toContain('<a href="/" aria-current="page">Store</a>');
    expect(html).toContain('<a class="pd-status" href="https://picodeck.net/download/">v0.3.0</a>');
    expect(renderPage({ title: "T", description: "D", body: "" })).not.toContain("pd-status");
  });
  it("shows the heading, or a link back to the list without one", () => {
    expect(renderPage({ title: "T", description: "D", body: "", heading: "A & B" })).toContain('<h1 class="pd-title">A &amp; B</h1>');
    expect(renderPage({ title: "T", description: "D", body: "" })).toContain('<a class="crumb" href="/">');
  });
  it("marks the current page in the store tabs and adds the footer", () => {
    const html = renderPage({ title: "T", description: "D", body: "", path: "/status" });
    expect(html).toContain('<a class="pd-tab" href="/status" aria-current="page">Status</a>');
    expect(html).not.toContain('<a class="pd-tab" href="/" aria-current="page">');
    expect(html).toContain('<footer class="pd-footer">');
    expect(html).toContain('href="/catalog.json"');
    expect(html).not.toContain('<nav aria-label="Site"><a href="/">Apps</a><a href="/publish">Publish</a><a href="/status">Status</a><a href="/catalog.json"');
  });
  it("hides [hidden] elements even where a class sets display (the card filter relies on it)", () => {
    expect(renderPage({ title: "T", description: "D", body: "" })).toContain("[hidden]{display:none!important}");
  });
});

describe("renderIndexPage", () => {
  it("lists every app escaped, with filter data and links", () => {
    const html = renderIndexPage(fixtureCatalog([fixtureApp(), evil]));
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;&quot;");
    expect(html).toContain('href="/apps/com.example.snake"');
    expect(html).toContain('data-category="games"');
    expect(html).toContain('data-stars="17"');
    expect(html).toContain("Firmware 0.1.0");
    expect(html).toContain('<time datetime="');
    expect(html).not.toContain("generated 20");
    expect(html).toContain('href="/publish"');
    expect(html.match(/<li class="pd-row"/g)).toHaveLength(2);
    expect(html).toContain('<span class="pd-row-meta">1.2.0</span>');
    expect(html).toContain('<a class="pd-status" href="https://picodeck.net/download/">v0.1.0</a>');
  });
  it("shows an app's icon, and the launcher's cartridge when it has none", () => {
    const withIcon = fixtureApp({ id: "com.example.withicon", icon: "https://raw.githubusercontent.com/example/picodeck-snake/v1.2.0/icon.png" });
    const html = renderIndexPage(fixtureCatalog([fixtureApp(), withIcon]));
    expect(html).toContain('<img class="pd-icon pd-c-games" src="https://raw.githubusercontent.com/example/picodeck-snake/v1.2.0/icon.png"');
    expect(html).toContain('<span class="pd-icon pd-c-games pd-cart" aria-hidden="true">S</span>');
    const lower = fixtureApp({ id: "net.picodeck.blockexe", name: "block.exe" });
    expect(renderIndexPage(fixtureCatalog([lower]))).toContain('pd-cart" aria-hidden="true">B</span>');
  });

  it("puts keywords in the row's search text and disables empty categories", () => {
    const html = renderIndexPage(fixtureCatalog([fixtureApp({ keywords: ["arcade", "retro"] })]));
    expect(html).toMatch(/data-search="[^"]*arcade retro/);
    expect(html).toContain('data-cat="tools" aria-pressed="false" disabled');
    expect(html).toContain('data-cat="games" aria-pressed="false"><span class="pd-dot"></span><span class="pd-tab-label">Games</span><span class="pd-count">1</span>');
    expect(html).toContain('data-cat="all" aria-pressed="true"><span class="pd-tab-label">All</span>');
  });

  it("defaults the sort to recently updated", () => {
    expect(renderIndexPage(fixtureCatalog())).toContain('<option value="pushed">Recently updated</option><option value="stars">');
  });

  it("handles an empty catalog", () => {
    const html = renderIndexPage(fixtureCatalog([]));
    expect(html).toContain("No apps listed yet");
  });
});

describe("renderAppPage", () => {
  it("shows details escaped", () => {
    const html = renderAppPage(evil, fixtureCatalog([evil]));
    expect(html).not.toContain("<b>x</b>");
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(html).toContain("a".repeat(64));
    expect(html).toContain("audio");
    expect(html).toContain("v1.2.0");
  });
  it("renders screenshots and keywords when the manifest has them", () => {
    const app = fixtureApp({ screenshots: ["https://raw.githubusercontent.com/example/picodeck-snake/v1.2.0/shot.png"], keywords: ["arcade"] });
    const html = renderAppPage(app, fixtureCatalog([app]));
    expect(html).toContain('<div class="shots"><img src="https://raw.githubusercontent.com/example/picodeck-snake/v1.2.0/shot.png" alt="Screenshot of Snake"');
    expect(html).toContain("<dt>Keywords</dt><dd>arcade</dd>");
  });

  it("states size and version once each", () => {
    const html = renderAppPage(fixtureApp(), fixtureCatalog());
    expect(html.match(/42 KB/g)).toHaveLength(1);
    expect(html).not.toContain("<dt>Version</dt>");
  });

  it("never emits a javascript: homepage link", () => {
    const app = fixtureApp({ homepage: "javascript:alert(1)" });
    const html = renderAppPage(app, fixtureCatalog([app]));
    expect(html).not.toContain("javascript:");
  });
});

describe("renderStatusPage", () => {
  it("lists rejections and warnings escaped", () => {
    const html = renderStatusPage(fixtureCatalog(), { rejected: [{ repo: "a/<b>", reason: "no-release" }], warnings: ["w&"] });
    expect(html).toContain("a/&lt;b&gt;");
    expect(html).toContain("no-release");
    expect(html).toContain("w&amp;");
  });
  it("says so when nothing is rejected", () => {
    expect(renderStatusPage(fixtureCatalog(), { rejected: [], warnings: [] })).toContain("No repositories were rejected");
  });
  it("wraps the rejection table so it can scroll instead of widening the page", () => {
    const html = renderStatusPage(fixtureCatalog(), { rejected: [{ repo: "a/b", reason: "no-release" }], warnings: [] });
    expect(html).toMatch(/class="[^"]*\bscroll\b[^"]*"/);
  });
});

describe("renderPublishPage", () => {
  it("documents the topic and rules", () => {
    const html = renderPublishPage();
    expect(html).toContain("picodeck-app");
    expect(html).toContain("app.json");
    expect(html).toContain("16 MB");
    expect(html).toContain("30 minutes");
  });
  it("documents the extra rejection reasons", () => {
    const html = renderPublishPage();
    expect(html).toContain("bad-dirname");
    expect(html).toContain("asset-not-zip");
    expect(html).toContain("github-error");
    expect(html).toContain("zip-invalid");
  });
  it("documents the dirname claim rules and the network-error wording", () => {
    const html = renderPublishPage();
    expect(html).toContain("dirname-claimed-by:&lt;repo&gt;");
    expect(html).toContain("dirname-reserved");
    expect(html).toContain("asset-unreachable:&lt;status|error&gt;");
  });
});

describe("site footer", () => {
  it("links to picodeck.net and the PicoDeck repo", () => {
    const html = renderPage({ title: "t", description: "d", body: "" });
    expect(html).toContain('href="https://picodeck.net"');
    expect(html).toContain('href="https://github.com/PicoDeck/picodeck"');
    expect(html).toContain("PicoDeck App Store");
  });
});
