# play tab

ブラウザでTAB譜を表示・再生・管理するためのツールです。
[alphaTab](https://www.alphatab.net/) ライブラリを活用しており、ブラウザ上で高品質な楽譜のレンダリングと音声再生を実現しています。
個人の練習、タブ譜の作成、そして共有URLを通じた他者との共有をスムーズに行うことを目的としています。

## 開発・運用の開始

本プロジェクトを開始するには、環境変数の設定が必要です。

1. `.env.example` を `.env` にコピーします。
2. `.env` 内の値を適切なもの（データベースのパスワード、ドメイン名など）に変更します。

```bash
cp .env.example .env
# .env を編集
```

### 開発環境での立ち上げ

Docker Compose を使用して、開発用のコンテナ（アプリ + データベース）を起動します。

```bash
docker compose up -d --build
```

起動後、 [http://localhost:5173](http://localhost:5173) にアクセスしてください。

### 本番環境での立ち上げ

本番環境では、Nginx リバースプロキシと Let's Encrypt (Certbot) による HTTPS 化が自動で行われる構成を使用します。

```bash
docker compose --env-file .env -f prod/docker-compose.prod.yml up -d --build
```

- 初回起動時、Nginx はまず HTTP (80番ポート) で起動し、Certbot が証明書を取得した後に HTTPS (443番ポート) が有効化されます。
- `.env` で `DOMAIN`, `EMAIL`, `ORIGIN` (https://あなたのドメイン) を正しく設定してください。

### ソース変更時の再ビルド（本番環境）

ソースコードを変更した後に本番環境へ反映させるには、以下のコマンドを実行してイメージの再ビルドとコンテナの再起動を行います。

```bash
docker compose --env-file .env -f prod/docker-compose.prod.yml up -d --build web
```

特定のサービス（例: `web`）のみを指定して再ビルドすることで、他のサービス（`db` や `proxy` など）を停止させずに更新を反映させることができます。

## 機能

- **TAB譜の表示・再生**: alphaTabを使用した高品質な楽譜表示と、シンセサイザーによる再生。
- **TAB譜の作成・編集**: ブラウザ上で直接タブ譜を編集し、リアルタイムで確認。
- **バージョン管理**: 編集履歴の保持と管理。
- **共有機能**: 作成したタブ譜をURLで簡単に共有。

## 技術スタック

- **Frontend**: SvelteKit, TypeScript
- **Tab Rendering/Playback**: [alphaTab](https://www.alphatab.net/)
- **Styling**: CSS (Svelte component styles)
- **Database**: MongoDB

## ライセンス

本プロジェクトは [alphaTab](https://github.com/CoderLine/alphaTab) を利用しています。alphaTabは Mozilla Public License Version 2.0 (MPL-2.0) の下で公開されています。
