#!/usr/bin/env python3
"""Add ISR revalidate config to server-rendered pages that don't already have it.
Skips 'use client' pages and pages that already export revalidate."""
import re
import os

PAGES = [
    "/home/z/my-project/src/app/shop/page.tsx",
    "/home/z/my-project/src/app/shop/[slug]/page.tsx",
    "/home/z/my-project/src/app/best-sellers/page.tsx",
    "/home/z/my-project/src/app/new-arrivals/page.tsx",
    "/home/z/my-project/src/app/sale/page.tsx",
]

REVALIDATE_LINE = (
    "// ISR — revalidate every 1 hour. Once cached, users get instant load.\n"
    "export const revalidate = 3600;\n\n"
)

for path in PAGES:
    if not os.path.exists(path):
        print(f"SKIP (missing): {path}")
        continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if content.startswith('"use client"'):
        print(f"SKIP (client): {path}")
        continue
    if "export const revalidate" in content:
        print(f"SKIP (already has): {path}")
        continue
    # Find the first non-import, non-comment line (the function declaration)
    # Insert revalidate right before 'export default'
    match = re.search(r"\nexport default ", content)
    if not match:
        print(f"SKIP (no default export): {path}")
        continue
    insert_pos = match.start() + 1  # after the newline
    new_content = content[:insert_pos] + "\n" + REVALIDATE_LINE + content[insert_pos:]
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"UPDATED: {path}")
