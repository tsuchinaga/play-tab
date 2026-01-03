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
