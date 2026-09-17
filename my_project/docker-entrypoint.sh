#!/bin/sh
set -e

echo "[Symfony] Attente de PostgreSQL..."
sleep 5

echo "[Symfony] Exécution des migrations..."
php bin/console doctrine:migrations:migrate --no-interaction --env=prod || true

echo "[Symfony] Démarrage : $@"
exec "$@"
