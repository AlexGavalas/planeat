#!/usr/bin/env bash
set -euo pipefail

: "${SUPABASE_DATABASE_URL:?Set SUPABASE_DATABASE_URL to Supabase's direct Postgres connection string}"
: "${DATABASE_URL:?Set DATABASE_URL to the empty Neon or local Postgres database}"

tables=(users meals measurements activities meals_pool connections notifications)
table_args=()

for table in "${tables[@]}"; do
    table_args+=("--table=public.${table}")
done

pg_dump \
    --data-only \
    --inserts \
    --no-owner \
    --no-privileges \
    "${table_args[@]}" \
    "$SUPABASE_DATABASE_URL" \
    | psql --set ON_ERROR_STOP=1 "$DATABASE_URL"
