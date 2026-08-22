#!/bin/bash
# Deploy Rakib Panjabi House to Vercel
# Usage: VERCEL_TOKEN=xxx bash scripts/vercel-create.sh
set -e
VERCEL_TOKEN="\${VERCEL_TOKEN:?VERCEL_TOKEN required}"
PROJECT_NAME="rakib-panjabi-house"
echo "=== Creating Vercel Project ==="
RESPONSE=\$(curl -s -X POST "https://api.vercel.com/v10/projects" \\
  -H "Authorization: Bearer \$VERCEL_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d "{\"name\": \"\$PROJECT_NAME\", \"framework\": \"nextjs\"}")
PROJECT_ID=\$(echo "\$RESPONSE" | grep -o '"id":"prj_[^\"]*"' | head -1 | cut -d'"' -f4)
echo "Project ID: \$PROJECT_ID"
echo "\$PROJECT_ID" > /tmp/vercel_project_id.txt
