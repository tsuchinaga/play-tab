#!/bin/sh
# nginx_bootstrap.sh
# 目的:
# - 証明書が無い状態でも nginx を HTTP のみで起動して ACME の HTTP-01 を通す
# - 証明書が配置されたら HTTPS 設定(/etc/nginx/conf.d/ssl.conf)を生成し、nginx をリロードして HTTPS を有効化

set -eu

DOMAIN=${DOMAIN:-}
CONF_DIR=/etc/nginx/conf.d
SSL_CONF="$CONF_DIR/ssl.conf"
LE_BASE="/etc/letsencrypt"
LE_LIVE="$LE_BASE/live/$DOMAIN"
WEB_UPSTREAM="http://web:3000"

log() { echo "[nginx-bootstrap] $(date '+%Y-%m-%d %H:%M:%S') $*"; }

# まずは nginx をフォアグラウンドで起動（HTTP のみの app.conf は既にマウントされている前提）
nginx -g 'daemon off;' &
NGINX_PID=$!
log "nginx 起動 (PID=$NGINX_PID)。証明書の有無を監視します..."

# バックグラウンドで証明書監視
(
  while :; do
    if [ -n "$DOMAIN" ] && [ -d "$LE_LIVE" ] && [ -f "$LE_LIVE/fullchain.pem" ] && [ -f "$LE_LIVE/privkey.pem" ]; then
      if [ ! -f "$SSL_CONF" ]; then
        log "証明書を検出 ($LE_LIVE)。HTTPS 設定を生成します: $SSL_CONF"
        cat > "$SSL_CONF" <<EOF
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name $DOMAIN;

  ssl_certificate     $LE_LIVE/fullchain.pem;
  ssl_certificate_key $LE_LIVE/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  # 必要に応じて調整可能なセキュリティヘッダ
  add_header X-Content-Type-Options nosniff;
  add_header X-Frame-Options DENY;
  add_header X-XSS-Protection "1; mode=block";
  add_header Referrer-Policy strict-origin-when-cross-origin;

  # ACME チャレンジを HTTPS でも通す（任意）
  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  location / {
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_pass $WEB_UPSTREAM;

    # SvelteKit の HMR/WebSocket 等に対応
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
EOF
        # リロード（失敗してもループを継続）
        if nginx -s reload; then
          log "nginx をリロードしました（HTTPS 有効化）。"
        else
          log "警告: nginx リロードに失敗しました。数秒後に再試行します。"
        fi
      fi
    fi
    sleep 5
  done
) &

# メイン nginx プロセスの終了を待つ
wait "$NGINX_PID"
