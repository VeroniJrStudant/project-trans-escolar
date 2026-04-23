#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

NAME="transescolar-db"
IMAGE="postgres:16-alpine"
PORT="5432"

if ! docker info &>/dev/null; then
  echo "" >&2
  echo "Docker não está acessível (daemon parado ou socket errado)." >&2
  echo "→ Abra o Docker Desktop e espere ficar \"running\", depois rode: npm run db:up" >&2
  echo "" >&2
  exit 1
fi

if docker compose version &>/dev/null; then
  exec docker compose up -d "$@"
fi
if command -v docker-compose &>/dev/null; then
  exec docker-compose up -d "$@"
fi

# Sem plugin Compose: sobe Postgres só com `docker run`
if docker ps --format '{{.Names}}' | grep -qx "$NAME"; then
  echo "Container $NAME já está rodando."
  exit 0
fi
if docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
  echo "Iniciando container existente $NAME..."
  docker start "$NAME"
  exit 0
fi

echo "Subindo Postgres ($IMAGE) na porta $PORT do host (sem Docker Compose)..."
docker run -d \
  --name "$NAME" \
  -e POSTGRES_USER=transescolar \
  -e POSTGRES_PASSWORD=transescolar \
  -e POSTGRES_DB=transescolar \
  -p "${PORT}:5432" \
  -v transescolar_pg_data:/var/lib/postgresql/data \
  "$IMAGE"

echo "Pronto. DATABASE_URL sugerido:"
echo "postgresql://transescolar:transescolar@localhost:${PORT}/transescolar?schema=public"
