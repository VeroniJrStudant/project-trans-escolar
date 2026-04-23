#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

NAME="transescolar-db"

if docker compose version &>/dev/null; then
  exec docker compose down "$@"
fi
if command -v docker-compose &>/dev/null; then
  exec docker-compose down "$@"
fi

if docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
  echo "Parando $NAME..."
  docker stop "$NAME" || true
  echo "Para remover o container: docker rm $NAME"
  echo "Para apagar os dados do volume: docker volume rm transescolar_pg_data"
  exit 0
fi

echo "Nenhum stack Compose nem container $NAME encontrado."
exit 0
