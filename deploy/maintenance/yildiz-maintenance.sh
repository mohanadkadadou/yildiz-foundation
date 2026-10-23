#!/bin/bash
# Server-side switch for the maintenance page.  Usage: yildiz-maintenance on [minutes] | off | status
FLAG=/var/www/maintenance/ON
UNIT=yildiz-maint-off
case "$1" in
  on)
    mins="${2:-}"
    systemctl stop "$UNIT.timer" "$UNIT.service" >/dev/null 2>&1 || true
    touch "$FLAG"
    if [[ "$mins" =~ ^[0-9]+$ ]] && [ "$mins" -gt 0 ]; then
      systemd-run --quiet --unit="$UNIT" --on-active="${mins}m" /usr/local/bin/yildiz-maintenance off
      echo "Maintenance ON — switches itself off in $mins minute(s)."
    else
      echo "Maintenance ON — stays on until you run: yildiz-maintenance off"
    fi ;;
  off)
    rm -f "$FLAG"
    systemctl stop "$UNIT.timer" "$UNIT.service" >/dev/null 2>&1 || true
    echo "Maintenance OFF — the website is live." ;;
  status)
    if [ -f "$FLAG" ]; then
      echo "Maintenance: ON"
      systemctl list-timers "$UNIT.timer" --no-legend 2>/dev/null | awk 'NF{print "Auto-off: "$1" "$2" "$3" ("$4" "$5")"}'
    else echo "Maintenance: OFF"; fi ;;
  *) echo "Usage: yildiz-maintenance on [minutes] | off | status"; exit 1 ;;
esac
