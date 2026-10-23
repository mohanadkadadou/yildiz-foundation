#!/usr/bin/env bash
# Control the maintenance page from your Mac.
#   ./deploy/maintenance.sh on 5     # show the page for 5 minutes, then switch off automatically
#   ./deploy/maintenance.sh on       # show it until you switch it off
#   ./deploy/maintenance.sh off
#   ./deploy/maintenance.sh status
set -euo pipefail
HOST="${HOST:-root@104.207.95.178}"
KEY="${SSH_KEY:-$HOME/.ssh/yildiz_vps}"
ssh -i "$KEY" "$HOST" "/usr/local/bin/yildiz-maintenance $*"
