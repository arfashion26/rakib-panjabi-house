"use client";

import * as React from "react";
import { Code2, Loader2, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CustomCode {
  head: string;
  body_top: string;
  body_bottom: string;
}

interface CodeSlot {
  key: keyof CustomCode;
  title: string;
  description: string;
  placeholder: string;
  example: string;
}

const CODE_SLOTS: CodeSlot[] = [
  {
    key: "head",
    title: "Inside <head>",
    description:
      "Code here goes inside the <head> tag. Best for analytics scripts (Google Analytics, Facebook Pixel), meta tags, link tags, and Google Tag Manager.",
    placeholder: "<!-- Paste your <head> tracking code here -->\n<!-- Example: Google Analytics 4 -->\n<!-- <script async src=\"https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX\"></script> -->\n<!-- <script> -->\n<!--   window.dataLayer = window.dataLayer || []; -->\n<!--   function gtag(){dataLayer.push(arguments);} -->\n<!--   gtag('js', new Date()); -->\n<!--   gtag('config', 'G-XXXXXXXXXX'); -->\n<!-- </script> -->",
    example: "Google Analytics, Facebook Pixel, Google Tag Manager, Meta tags",
  },
  {
    key: "body_top",
    title: "Top of <body>",
    description:
      "Code here is injected right after the <body> tag opens. Best for Google Tag Manager noscript fallback or pixel tracking that needs to fire early.",
    placeholder: "<!-- Paste code for top of <body> here -->\n<!-- Example: Google Tag Manager noscript -->\n<!-- <noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX\" -->\n<!--   height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript> -->",
    example: "GTM noscript, early-firing pixels",
  },
  {
    key: "body_bottom",
    title: "Bottom of <body> (before </body>)",
    description:
      "Code here is injected at the end of the page, just before </body>. Best for chat widgets (Tawk.to, Messenger), conversion scripts, and heatmap tools.",
    placeholder: "<!-- Paste code for bottom of <body> here -->\n<!-- Example: Tawk.to chat widget -->\n<!-- <script type=\"text/javascript\"> -->\n<!--   var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date(); -->\n<!--   (function(){ -->\n<!--     var s1=document.createElement(\"script\"),s0=document.getElementsByTagName(\"script\")[0]; -->\n<!--     s1.async=true; -->\n<!--     s1.src=\"https://embed.tawk.to/XXXXXXXXX/default\"; -->\n<!--     s1.charset=\"UTF-8\"; -->\n<!--     s1.setAttribute(\"crossorigin\",\"*\"); -->\n<!--     s0.parentNode.insertBefore(s1,s0); -->\n<!--   })(); -->\n<!-- </script> -->",
    example: "Chat widgets, conversion pixels, Hotjar, Tawk.to",
  },
];

export function CustomCodeEditor() {
  const [code, setCode] = React.useState<CustomCode>({
    head: "",
    body_top: "",
    body_bottom: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [showRaw, setShowRaw] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    fetch("/api/admin/custom-code")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCode(data.code);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function updateField(key: keyof CustomCode, value: string) {
    setCode((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/custom-code", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(code),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Custom code saved — changes are live on the website");
      } else {
        toast.error(data.error || "Failed to save custom code");
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  function toggleRaw(key: string) {
    setShowRaw((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border/60 bg-background p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Loading custom code configuration...
          </span>
        </div>
      </div>
    );
  }

  const totalChars = code.head.length + code.body_top.length + code.body_bottom.length;
  const hasCode = totalChars > 0;

  return (
    <div className="rounded-lg border border-border/60 bg-background p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-2">
          <Code2 className="mt-0.5 h-5 w-5 text-accent-text" />
          <div>
            <h2 className="font-serif text-lg font-medium">Custom Tracking Code</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Add custom HTML/JavaScript code to your website. Supports Google Analytics,
              Facebook Pixel, Google Tag Manager, chat widgets, and more. Changes go live
              immediately after saving.
            </p>
          </div>
        </div>
        {hasCode ? (
          <Badge className="bg-green-100 text-green-700">Active</Badge>
        ) : (
          <Badge variant="secondary">Empty</Badge>
        )}
      </div>

      {/* Warning */}
      <div className="mb-4 flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
        <div className="text-xs text-yellow-800">
          <strong>Warning:</strong> Only paste code from trusted sources (Google,
          Facebook, etc.). Malicious code can break your website or compromise user data.
          The code is rendered server-side and appears in your page HTML source.
        </div>
      </div>

      {/* Code slots */}
      <div className="space-y-6">
        {CODE_SLOTS.map((slot) => {
          const value = code[slot.key];
          const lineCount = value ? value.split("\n").length : 0;
          return (
            <div key={slot.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor={slot.key} className="text-sm font-semibold">
                    {slot.title}
                  </Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">{slot.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {value && (
                    <span className="text-[10px] text-muted-foreground">
                      {value.length} chars · {lineCount} lines
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toggleRaw(slot.key)}
                  >
                    {showRaw[slot.key] ? (
                      <>
                        <EyeOff className="mr-1 h-3 w-3" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {showRaw[slot.key] && value ? (
                <pre className="max-h-48 overflow-auto rounded-md border border-border bg-muted/30 p-3 text-xs">
                  <code>{value}</code>
                </pre>
              ) : (
                <Textarea
                  id={slot.key}
                  value={value}
                  onChange={(e) => updateField(slot.key, e.target.value)}
                  placeholder={slot.placeholder}
                  rows={6}
                  className="font-mono text-xs"
                />
              )}

              <p className="text-[10px] text-muted-foreground">
                <span className="font-medium">Common uses:</span> {slot.example}
              </p>
            </div>
          );
        })}
      </div>

      {/* Save button */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          {hasCode
            ? `${totalChars} characters of custom code across all positions`
            : "No custom code configured yet"}
        </p>
        <Button onClick={save} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save & Deploy
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
