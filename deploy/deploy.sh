#!/usr/bin/env bash
# Build locally and deploy to the Namecheap VPS.
# Usage: SSH_KEY=~/.ssh/yildiz_vps ./deploy/deploy.sh
# Server env (DB URL, secrets) lives in /var/www/yildiz/.env and is never overwritten by this script.
set -euo pipefail
HOST="${HOST:-root@104.207.95.178}"
KEY="${SSH_KEY:-$HOME/.ssh/yildiz_vps}"
APP=/var/www/yildiz
SSH="ssh -i $KEY"

NEXT_PUBLIC_SITE_URL=https://yildizeducation.com NEXTAUTH_URL=https://yildizeducation.com \
  node --env-file=.env.local ./node_modules/.bin/next build

rsync -az --delete -e "$SSH" \
  --exclude node_modules --exclude .git --exclude .claude --exclude '.env*' \
  --exclude 'prisma/data-export/data*' --exclude /uploads --exclude '*.tsbuildinfo' --exclude '.next/cache' \
  --exclude 'الشهادات' --exclude 'البوم' --exclude '{src' --exclude .DS_Store \
  ./ "$HOST:$APP/"

$SSH "$HOST" "chown -R yildiz:yildiz $APP && su - yildiz -c 'cd $APP && npm ci --legacy-peer-deps --no-audit --no-fund >/dev/null && npx prisma generate >/dev/null && npx prisma db push --skip-generate >/dev/null && set -a && . ./.env && set +a && pm2 restart yildiz --update-env'"
echo "Deployed."
