#!/bin/bash

# Exit on error
set -e

# Ensure at least one service is passed
if [ "$#" -eq 0 ]; then
  echo "❌ No services specified. Usage: ./run_services.sh product order ..."
  exit 1
fi

# Base directories
SERVICES_DIR="./services"
SHARED_TEMPLATE_DIR="$SERVICES_DIR/shared/template"

# Validate shared template exists
if [ ! -d "$SHARED_TEMPLATE_DIR" ]; then
  echo "❌ Shared template directory not found: $SHARED_TEMPLATE_DIR"
  exit 1
fi

# Iterate over each passed service
for SERVICE in "$@"; do
  SERVICE_PATH="$SERVICES_DIR/$SERVICE"

  if [ -d "$SERVICE_PATH" ]; then
    echo "🔧 Processing service: $SERVICE"

    # Copy shared template files into the service
    cp -r "$SHARED_TEMPLATE_DIR/"* "$SERVICE_PATH/"

    echo "✅ Injected shared template into $SERVICE"
  else
    echo "❌ Service directory $SERVICE_PATH does not exist"
  fi
done

echo "🚀 All specified services have been updated with shared templates."