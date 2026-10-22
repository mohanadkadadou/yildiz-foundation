#!/usr/bin/env bash
# Sets the outgoing-email (SMTP) credentials on the server. The password is typed here, hidden,
# and goes straight to the server's .env — it is never stored in this repository.
# Usage: ./deploy/set-smtp.sh
set -euo pipefail
HOST="${HOST:-root@104.207.95.178}"
KEY="${SSH_KEY:-$HOME/.ssh/yildiz_vps}"

echo "Gmail:  host smtp.gmail.com, port 465, user = full Gmail address, password = a Google 'App password'"
echo "        (Google Account → Security → 2-Step Verification → App passwords)"
read -rp "SMTP host [smtp.gmail.com]: " H; H="${H:-smtp.gmail.com}"
read -rp "SMTP port [465]: " P; P="${P:-465}"
read -rp "SMTP user (email address): " U
read -rsp "SMTP password (hidden): " W; echo
read -rp "Send emails 'from' [Yildiz Foundation <$U>]: " F; F="${F:-Yildiz Foundation <$U>}"

printf 'SMTP_HOST="%s"\nSMTP_PORT="%s"\nSMTP_USER="%s"\nSMTP_PASS="%s"\nSMTP_FROM="%s"\n' "$H" "$P" "$U" "$W" "$F" | \
ssh -i "$KEY" "$HOST" 'cat > /tmp/smtp.env && cd /var/www/yildiz && sed -i "/^SMTP_/d" .env && cat /tmp/smtp.env >> .env && rm -f /tmp/smtp.env && chown yildiz:yildiz .env && chmod 600 .env && su - yildiz -c "cd /var/www/yildiz && set -a && . ./.env && set +a && pm2 restart yildiz --update-env" >/dev/null && echo "Saved. The website now uses these email settings."'
