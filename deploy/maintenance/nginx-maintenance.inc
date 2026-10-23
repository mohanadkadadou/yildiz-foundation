# Maintenance switch — included inside the HTTPS server block.
# Active while the file /var/www/maintenance/ON exists (toggled by /usr/local/bin/yildiz-maintenance).
set $maint 0;
if (-f /var/www/maintenance/ON) { set $maint 1; }
# Team bypass: a cookie set by visiting the secret link lets staff see the real site meanwhile.
if ($cookie_ymb = "__TOKEN__") { set $maint 0; }

error_page 503 /maintenance.html;
location = /maintenance.html {
    internal;
    root /var/www/maintenance;
    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    add_header Retry-After 300 always;
    add_header X-Robots-Tag "noindex, nofollow" always;
}
location = /__ymaint/__TOKEN__ {
    add_header Set-Cookie "ymb=__TOKEN__; Path=/; Max-Age=43200; Secure; HttpOnly; SameSite=Lax";
    add_header Cache-Control "no-store";
    return 302 /;
}
