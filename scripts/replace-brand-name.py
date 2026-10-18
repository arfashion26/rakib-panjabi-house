#!/usr/bin/env python3
"""Replace 'Rakib Panjabi House' with 'alrakib.com' across all source files."""
import re
import os
import glob

# Files to process
files = []
for ext in ['*.tsx', '*.ts']:
    files.extend(glob.glob(f'src/**/{ext}', recursive=True))

# Also include root-level files
files.extend(glob.glob('src/*.ts'))
files.extend(glob.glob('src/*.tsx'))

# Patterns to replace
replacements = [
    ("Rakib Panjabi House", "alrakib.com"),
    ("Al-Rakib Panjabi House", "alrakib.com"),
]

changed = 0
for f in sorted(set(files)):
    if not os.path.exists(f):
        continue
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content != original:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(content)
        changed += 1
        print(f"Updated: {f}")

print(f"\nTotal files changed: {changed}")
