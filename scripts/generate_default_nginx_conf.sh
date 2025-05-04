#!/bin/bash

# Exit on error
set -e

# Ensure at least one service is passed
if [ "$#" -eq 0 ]; then
  echo "❌ No services specified. Usage: ./generate_default_nginx_conf.sh product order ..."
  exit 1
fi

# Requested services
TARGET_SERVICES=("$@")
OUTPUT_FILE="./services/gateway/default.conf"

# Start generating nginx config
echo "🔧 Generating NGINX config at $OUTPUT_FILE ..."
cat <<EOF > "$OUTPUT_FILE"
server {
    listen 80;
    server_name localhost;
EOF

# Loop through services and append location blocks
for SERVICE in "${TARGET_SERVICES[@]}"; do
  echo "➕ Adding proxy for: $SERVICE"

  cat <<EOL >> "$OUTPUT_FILE"
    location /v1/$SERVICE/ {
        proxy_pass http://$SERVICE-service:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
EOL
done

# Close server block
echo "}" >> "$OUTPUT_FILE"

echo "✅ NGINX config successfully generated at $OUTPUT_FILE"
