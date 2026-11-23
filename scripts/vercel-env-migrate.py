#!/usr/bin/env python3
"""
Migrate environment variables from the CURRENT Vercel project
(rakib-panjabi-house) to a NEW Vercel project.

WHAT IT DOES
------------
1. Reads the decrypted env values from `.vercel.env.local`
   (already pulled via `vercel env pull`).
2. Filters to only the 19 app-defined secret keys (drops Vercel's
   auto-injected VERCEL_*, TURBO_*, NX_* system vars).
3. Saves them as JSON to `scripts/vercel-env-migration.json`
   (values included — this file must NOT be committed; it's in
   .gitignore via scripts/ being gitignored for secrets).
4. Prints only key NAMES + counts, never values.

USAGE
-----
  python3 scripts/vercel-env-migrate.py export     # pull -> JSON
  python3 scripts/vercel-env-migrate.py list       # show names only
  python3 scripts/vercel-env-migrate.py inject NEW_TOKEN NEW_PROJECT_ID
                                                    # push to new project

The `inject` subcommand reads the JSON and creates each env var in the
NEW Vercel project (all 3 targets: production/preview/development),
so the new project ends up with the exact same env config.

SAFETY
------
- Never prints env values. Only key names + lengths.
- Never logs the Vercel token.
- Migration JSON is the only place values are stored on disk; delete it
  once migration is confirmed.
"""

import json
import os
import sys
import urllib.request
from pathlib import Path

# Only these keys are migrated. Everything else in .vercel.env.local is
# Vercel's auto-injected system vars (VERCEL_*, TURBO_*, NX_*) that the new
# project will get automatically — copying them is wrong.
APP_ENV_KEYS = [
    "SSLCOMMERZ_STORE_ID",
    "SSLCOMMERZ_STORE_PASSWD",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "CLOUDINARY_CLOUD_NAME",
    "NEXTAUTH_SECRET",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SITE_NAME",
    "DIRECT_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GOOGLE_CLIENT_SECRET",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "CLOUDINARY_API_SECRET",
    "GOOGLE_CLIENT_ID",
    "NEXTAUTH_URL",
    "STRIPE_WEBHOOK_SECRET",
    "CLOUDINARY_API_KEY",
    "DATABASE_URL",
]

SRC_ENV_FILE = Path("/home/z/my-project/.vercel.env.local")
MIGRATION_FILE = Path("/home/z/my-project/scripts/vercel-env-migration.json")


def parse_env_file(path: Path) -> dict:
    """Parse a .env-style file into a {key: value} dict."""
    out = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        k, _, v = line.partition("=")
        k = k.strip()
        v = v.strip()
        # Strip surrounding quotes if present
        if len(v) >= 2 and v[0] == v[-1] and v[0] in ("'", '"'):
            v = v[1:-1]
        out[k] = v
    return out


def cmd_export():
    if not SRC_ENV_FILE.exists():
        print(f"ERROR: {SRC_ENV_FILE} not found. Run `vercel env pull` first.")
        sys.exit(1)
    all_vars = parse_env_file(SRC_ENV_FILE)
    app_vars = {k: all_vars.get(k, "") for k in APP_ENV_KEYS}
    missing = [k for k in APP_ENV_KEYS if not app_vars[k]]
    MIGRATION_FILE.parent.mkdir(parents=True, exist_ok=True)
    MIGRATION_FILE.write_text(json.dumps(app_vars, indent=2))
    # Set restrictive permissions (owner read/write only).
    os.chmod(MIGRATION_FILE, 0o600)
    print(f"Saved {len(app_vars)} env vars to {MIGRATION_FILE}")
    print(f"Keys: {', '.join(app_vars.keys())}")
    if missing:
        print(f"WARNING: {len(missing)} key(s) had empty values: {missing}")


def cmd_list():
    if not MIGRATION_FILE.exists():
        print(f"ERROR: {MIGRATION_FILE} not found. Run `export` first.")
        sys.exit(1)
    data = json.loads(MIGRATION_FILE.read_text())
    print(f"{len(data)} env vars in migration file:")
    for k, v in data.items():
        print(f"  {k}  (value length: {len(v)})")


def cmd_inject(token: str, project_id: str):
    if not MIGRATION_FILE.exists():
        print(f"ERROR: {MIGRATION_FILE} not found. Run `export` first.")
        sys.exit(1)
    data = json.loads(MIGRATION_FILE.read_text())
    print(f"Injecting {len(data)} env vars into project {project_id} ...")
    api = "https://api.vercel.com/v10/projects/" + project_id + "/env"
    ok, fail = 0, 0
    for key, value in data.items():
        body = json.dumps({
            "key": key,
            "value": value,
            "type": "encrypted",
            "target": ["production", "preview", "development"],
        }).encode()
        req = urllib.request.Request(
            api,
            data=body,
            method="POST",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(req) as resp:
                if resp.status in (200, 201):
                    ok += 1
                else:
                    fail += 1
                    print(f"  FAIL {key}: HTTP {resp.status}")
        except urllib.error.HTTPError as e:
            fail += 1
            err_body = e.read().decode()[:200]
            print(f"  FAIL {key}: HTTP {e.code} - {err_body}")
        except Exception as e:
            fail += 1
            print(f"  FAIL {key}: {e}")
    print(f"Done. Success: {ok}, Failed: {fail}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "export":
        cmd_export()
    elif cmd == "list":
        cmd_list()
    elif cmd == "inject":
        if len(sys.argv) < 4:
            print("Usage: inject <NEW_VERCEL_TOKEN> <NEW_PROJECT_ID>")
            sys.exit(1)
        cmd_inject(sys.argv[2], sys.argv[3])
    else:
        print(f"Unknown command: {cmd}. Use: export | list | inject")
        sys.exit(1)


if __name__ == "__main__":
    main()
