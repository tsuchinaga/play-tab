#!/bin/sh
# certbot_issue_and_renew.sh
# 初回発行と更新を単一コンテナで行うスクリプト
# 前提:
# - このコンテナは certbot/certbot イメージを使用
# - /var/www/certbot が nginx コンテナからも参照されている（webroot）
# - /etc/letsencrypt, /var/lib/letsencrypt は永続ボリューム
# - 環境変数 DOMAIN と EMAIL が与えられている
# - nginx は別コンテナで起動済み（ホスト名 nginx で80番待ち受け）

set -eu

WEBROOT="/var/www/certbot"
DOMAIN=${DOMAIN:-}
EMAIL=${EMAIL:-}
SLEEP_SECONDS=${SLEEP_SECONDS:-43200} # デフォルト12時間

log() {
  echo "[certbot] $(date '+%Y-%m-%d %H:%M:%S') $*"
}

fail() {
  echo "[certbot][ERROR] $*" 1>&2
  exit 1
}

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  fail "環境変数 DOMAIN と EMAIL を設定してください。"
fi

# nginx(80)が応答するまで待つ
wait_for_nginx() {
  local retries=60
  local i=0
  while [ $i -lt $retries ]; do
    if wget -q --spider --timeout=2 http://proxy/.well-known/health >/dev/null 2>&1 \
       || wget -q --spider --timeout=2 http://proxy >/dev/null 2>&1; then
      return 0
    fi
    i=$((i+1))
    log "proxyの起動待ち... (${i}/${retries})"
    sleep 2
  done
  return 1
}

# 初回発行（証明書が無ければ）
issue_if_needed() {
  if [ -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
    log "証明書は既に存在します: /etc/letsencrypt/live/${DOMAIN}"
    return 0
  fi

  log "初回証明書を発行します: ${DOMAIN}"
  certbot certonly \
    --webroot -w "${WEBROOT}" \
    -d "${DOMAIN}" \
    --email "${EMAIL}" \
    --agree-tos --no-eff-email --rsa-key-size 4096 --non-interactive

  log "証明書の発行が完了しました。nginx をリロードしてください（例: docker compose exec proxy nginx -s reload）"
}

# 更新ループ
renew_loop() {
  while :; do
    log "証明書の更新チェックを実行します..."
    certbot renew --webroot -w "${WEBROOT}" --quiet || log "renew コマンドでエラーが発生しました（無視して継続）"

    # ベストエフォートで nginx リロードを試みる
    # 別コンテナのため直接実行はできない。ホスト側からの reload を推奨。
    # ここではログ出力のみに留める。
    log "（注意）nginx のリロードが必要な場合があります。ホストから: docker compose -f prod/docker-compose.prod.yml exec proxy nginx -s reload"

    sleep "$SLEEP_SECONDS"
  done
}

log "設定: DOMAIN=${DOMAIN}, EMAIL=${EMAIL}, WEBROOT=${WEBROOT}"

log "nginx の起動を待機..."
wait_for_nginx || log "nginxの待機に失敗しましたが処理を続行します（ACMEチャレンジで失敗する可能性があります）"

issue_if_needed
renew_loop
