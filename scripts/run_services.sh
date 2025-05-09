#!/bin/bash

# Exit on error
set -e

# Ensure at least one service is passed
if [ "$#" -eq 0 ]; then
  echo "❌ No services specified. Usage: ./run_services.sh product order ..."
  exit 1
fi

# Base directory containing service folders
SERVICES_DIR="./services"

# Iterate over each passed service
for SERVICE in "$@"; do
  SERVICE_PATH="$SERVICES_DIR/$SERVICE"

  if [ -d "$SERVICE_PATH" ]; then
    echo "🔧 Processing service: $SERVICE"

    # Remove shared_config, shared_utils, and main.py if they exist
    rm -rf "$SERVICE_PATH/shared_config" || echo "⚠️ $SERVICE/shared_config not found"
    rm -rf "$SERVICE_PATH/shared_utils" || echo "⚠️ $SERVICE/shared_utils not found"
    rm -f "$SERVICE_PATH/main.py" || echo "⚠️ $SERVICE/main.py not found"

    echo "✅ Cleaned $SERVICE"
  else
    echo "❌ Service directory $SERVICE_PATH does not exist"
  fi
done
echo "🔧 All specified services have been processed."