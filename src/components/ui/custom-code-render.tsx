import * as React from "react";

interface ParsedCustomCode {
  /** Raw script contents (the inner JS code, one entry per <script> tag) */
  scripts: string[];
  /** HTML chunks that are NOT scripts (noscript, comments, plain HTML).
   * Rendered via dangerouslySetInnerHTML so the browser sees the markup. */
  html: string;
}

/**
 * Parse a custom-code string into a list of script bodies + leftover HTML.
 *
 * Why this exists:
 *   React's `dangerouslySetInnerHTML` on a <div> does NOT execute <script>
 *   tags — the browser silently ignores them. This breaks tracking pixels
 *   (Meta/Facebook, Google Analytics, GTM, etc.) that admins paste into
 *   the Custom Code editor.
 *
 *   To make scripts actually execute, we split the snippet into:
 *     1. <script>...</script> blocks → rendered as real <script> elements
 *        with dangerouslySetInnerHTML on the script tag itself (which the
 *        browser DOES execute)
 *     2. everything else (noscript, comments, meta tags, plain HTML) →
 *        rendered via dangerouslySetInnerHTML on a <div> (browser renders
 *        the markup but doesn't try to execute anything)
 */
export function parseCustomCode(raw: string): ParsedCustomCode {
  if (!raw || typeof raw !== "string") {
    return { scripts: [], html: "" };
  }

  const scripts: string[] = [];
  let html = raw;

  // Extract <script>...</script> blocks (non-src, inline scripts).
  // We keep the script *content* (the JS code) so it can be re-rendered
  // inside a real <script> tag below. <script src="..."> tags (external)
  // are also captured by extracting their src and re-emitting a real
  // script tag with that src.
  const externalSrcs: string[] = [];

  // Match <script ...>...</script> (with optional attributes)
  html = html.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    (fullMatch, attrs: string, inner: string) => {
      // Check if it's an external script (has src="...")
      const srcMatch = /src\s*=\s*["']([^"']+)["']/i.exec(attrs);
      if (srcMatch) {
        externalSrcs.push(srcMatch[1]);
      } else if (inner.trim()) {
        scripts.push(inner);
      }
      // Remove the matched script from the html stream — it will be
      // re-emitted as a real <script> element below.
      return "";
    }
  );

  // For external scripts, we'll emit them as src-based script tags.
  // Encode them as inline JS that creates a script element with the src.
  for (const src of externalSrcs) {
    scripts.push(
      `(function(){var s=document.createElement('script');s.src=${JSON.stringify(src)};s.async=true;document.head.appendChild(s);})();`
    );
  }

  return { scripts, html };
}

/**
 * Render parsed custom code: real <script> elements (executed by the
 * browser) + a <div> with the leftover HTML (noscript tags, comments).
 *
 * The `keyPrefix` prop disambiguates multiple CustomCodeRender instances
 * on the same page (head vs body_top vs body_bottom).
 */
export function CustomCodeRender({
  code,
  keyPrefix,
}: {
  code: string;
  keyPrefix: string;
}) {
  if (!code) return null;
  const { scripts, html } = parseCustomCode(code);

  return (
    <>
      {scripts.map((script, idx) => (
        <script
          key={`${keyPrefix}-script-${idx}`}
          dangerouslySetInnerHTML={{ __html: script }}
        />
      ))}
      {html.trim() && (
        <div
          key={`${keyPrefix}-html`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </>
  );
}
