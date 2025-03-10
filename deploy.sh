#!/bin/bash

# Exit on any error
set -e

# Check if stage argument is provided
if [ -z "$1" ]; then
    echo "Error: Please specify the stage (e.g., production or staging)."
    exit 1
fi

STAGE=$1

# Required environment variables
required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_KEY"
    "SUPABASE_SERVICE_KEY"
    "KV_URL"
    "KV_REST_API_READ_ONLY_TOKEN"
    "KV_REST_API_TOKEN"
    "KV_REST_API_URL"
)

# Check if .env.local file exists and source it
if [ -f .env.local ]; then
    source .env.local
else
    echo "Error: .env.local file not found"
    exit 1
fi

# Check if all required variables are set
missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

# If any variables are missing, print them and exit
if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "Error: The following required environment variables are missing:"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

# Run the deployment command with all environment variables
echo "Starting deployment to stage: $STAGE..."
env \
    NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
    NEXT_PUBLIC_SUPABASE_KEY="$NEXT_PUBLIC_SUPABASE_KEY" \
    SUPABASE_SERVICE_KEY="$SUPABASE_SERVICE_KEY" \
    KV_URL="$KV_URL" \
    KV_REST_API_READ_ONLY_TOKEN="$KV_REST_API_READ_ONLY_TOKEN" \
    KV_REST_API_TOKEN="$KV_REST_API_TOKEN" \
    KV_REST_API_URL="$KV_REST_API_URL" \
    sst deploy --stage "$STAGE"

echo "Deployment complete!"
