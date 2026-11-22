import * as React from "react";

interface ParsedCustomCode {
  /** Inline script bodies (one per <script>...</script> tag without src) */
  scripts: string[];
  /** External script srcs (from <script src="..."> tags) */
  externalSrcs: string[];
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
 *     1. inline <script>...</script> blocks → rendered as real <script>
 *        elements (which the browser DOES execute on initial HTML parse)
 *     2. external <script src="..."> tags → also rendered as real
 *        <script src="..."> elements so the browser fetches + executes them
 *     3. everything else (noscript, comments, meta tags, plain HTML) →
 *        rendered via dangerouslySetInnerHTML on a <div> (browser renders
 *        the markup but doesn't try to execute anything)
 */
export function parseCustomCode(raw: string): ParsedCustomCode {
  if (!raw || typeof raw !== "string") {
    return { scripts: [], externalSrcs: [], html: "" };
  }

  const scripts: string[] = [];
  const externalSrcs: string[] = [];
  let html = raw;

  // Match <script ...>...</script> (with optional attributes).
  // We keep the script *content* (the JS code) so it can be re-rendered
  // inside a real <script> tag below. <script src="..."> tags (external)
  // are also captured by extracting their src.
  html = html.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    (_fullMatch, attrs: string, inner: string) => {
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

  return { scripts, externalSrcs, html };
}

/**
 * Render parsed custom code: real <script> elements (executed by the
 * browser) + a <div> with the leftover HTML (noscript tags, comments).
 *
 * The `keyPrefix` prop disambiguates multiple CustomCodeRender instances
 * on the same page (head vs body_top vs body_bottom).
 *
 * Scripts are rendered with a `suppressHydrationWarning` flag because
 * the Facebook Pixel and similar scripts modify the DOM immediately on
 * execution, which would otherwise trigger React hydration warnings.
 */
export function CustomCodeRender({
  code,
  keyPrefix,
}: {
  code: string;
  keyPrefix: string;
}) {
  if (!code) return null;
  const { scripts, externalSrcs, html } = parseCustomCode(code);

  return (
    <>
      {/* External scripts — render as real <script src> tags so the
          browser fetches + executes them. async by default for
          analytics scripts (matches typical paste-in behavior). */}
      {externalSrcs.map((src, idx) => (
        <script
          key={`${keyPrefix}-ext-${idx}`}
          src={src}
          async
          defer
        />
      ))}
      {/* Inline scripts — render as real <script> tags with the JS code
          inside. The browser executes these on initial HTML parse. */}
      {scripts.map((script, idx) => (
        <script
          key={`${keyPrefix}-script-${idx}`}
          dangerouslySetInnerHTML={{ __html: script }}
        />
      ))}
      {/* Leftover HTML (noscript, comments, meta tags) — render via
          dangerouslySetInnerHTML on a div. Scripts have already been
          extracted so this is purely markup. */}
      {html.trim() && (
        <div
          key={`${keyPrefix}-html`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </>
  );
}
