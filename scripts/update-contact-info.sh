#!/bin/bash
# Replace all placeholder contact info with real contact info
set -e

cd /home/z/my-project

# Real contact information
OLD_EMAIL="support@rakibpanjabihouse.com"
NEW_EMAIL="info@alrakib.com"

OLD_PHONE="+880 1XXX-XXXXXX"
NEW_PHONE="+880 1716-243949"

OLD_PHONE2="+880-1XXX-XXXXXX"
NEW_PHONE2="+880-1716-243949"

OLD_PHONE3="1XXX-XXXXXX"
NEW_PHONE3="1716-243949"

OLD_ADDRESS="Dhaka, Bangladesh"
NEW_ADDRESS="Shop no- 78, Mukjoddha Super Market, 3rd Floor, Mirpur-1, Dhaka-1216"

OLD_WHATSAPP="+880 1XXX-XXXXXX"
NEW_WHATSAPP="+880 1716-243949"

echo "=== Updating contact information across all files ==="

# Find and replace in all .ts, .tsx, .sql files (excluding node_modules, .next, etc.)
FILES=$(find src prisma -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.sql" \) 2>/dev/null)

for file in $FILES; do
  if [ -f "$file" ]; then
    # Skip if file doesn't contain any of the old patterns
    if ! grep -qE "support@rakibpanjabihouse|1XXX-XXXXXX|Dhaka, Bangladesh|instagram.com/rakibpanjabihouse|youtube.com/@rakibpanjabihouse|facebook.com/rakibpanjabihouse" "$file"; then
      continue
    fi

    echo "  Updating: $file"

    # Replace email
    sed -i "s|support@rakibpanjabihouse\.com|info@alrakib.com|g" "$file"

    # Replace phone formats
    sed -i "s|+880 1XXX-XXXXXX|+880 1716-243949|g" "$file"
    sed -i "s|+880-1XXX-XXXXXX|+880-1716-243949|g" "$file"
    sed -i "s|1XXX-XXXXXX|1716-243949|g" "$file"

    # Replace address
    sed -i "s|Dhaka, Bangladesh|Shop no- 78, Mukjoddha Super Market, 3rd Floor, Mirpur-1, Dhaka-1216|g" "$file"

    # Replace whatsapp (same as phone)
    # Already covered by phone replacement above
  fi
done

echo ""
echo "=== Updating social media URLs ==="

# Social media — these might need real URLs later
# For now, keep them but they'll be updated when user provides real social links

echo ""
echo "=== Done! ==="
echo ""
echo "Summary of replacements:"
echo "  Email:   $OLD_EMAIL → $NEW_EMAIL"
echo "  Phone:   $OLD_PHONE → $NEW_PHONE"
echo "  Address: $OLD_ADDRESS → $NEW_ADDRESS"
