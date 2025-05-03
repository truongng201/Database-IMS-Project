#!/bin/sh

# Copy template files if they don't already exist
cp -rn /template/* /usr/src/app/


# Run the original command
exec "$@"

