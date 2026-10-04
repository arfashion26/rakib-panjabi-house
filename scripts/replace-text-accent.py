#!/usr/bin/env python3
"""Replace text-accent with text-accent-text across all source files.
Preserves:
- text-accent-foreground (different class)
- bg-accent-foreground text-accent (dark bg with gold text — keep gold)
"""
import re
import os
import glob

# Pattern: match "text-accent" as a standalone class (not text-accent-foreground)
# Word boundary: text-accent followed by space, quote, or end of string
# But NOT text-accent-foreground
PATTERN = re.compile(r'\btext-accent\b(?!-foreground)')

# Also handle the dark-bg case: bg-accent-foreground text-accent -> keep as text-accent
# We'll do a two-pass: first replace all, then restore the dark-bg ones

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Step 1: Save dark-bg patterns (bg-accent-foreground text-accent)
    # Replace them with a placeholder
    dark_bg_pattern = re.compile(r'bg-accent-foreground\s+text-accent\b(?!-foreground)')
    placeholders = []
    def save_dark_bg(m):
        placeholders.append(m.group(0))
        return f'__DARK_BG_PLACEHOLDER_{len(placeholders)-1}__'
    content = dark_bg_pattern.sub(save_dark_bg, content)

    # Step 2: Replace all remaining text-accent with text-accent-text
    content = PATTERN.sub('text-accent-text', content)

    # Step 3: Restore dark-bg patterns
    for i, ph in enumerate(placeholders):
        content = content.replace(f'__DARK_BG_PLACEHOLDER_{i}__', ph)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Find all .tsx and .ts files
files = []
for ext in ['*.tsx', '*.ts']:
    files.extend(glob.glob(f'src/**/{ext}', recursive=True))

changed = 0
for f in sorted(files):
    if process_file(f):
        changed += 1
        print(f"Updated: {f}")

print(f"\nTotal files changed: {changed}")
