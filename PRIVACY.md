# プライバシーポリシー / Privacy Policy — Claudeふきだし色 / Claude Bubble Color

**最終更新日 / Last updated: 2026-09-03**

---

## 日本語

Chrome拡張機能「Claudeふきだし色」（以下「本拡張機能」）における
データの取り扱いについて説明します。

### 1. 収集・送信するデータ

**本拡張機能は、いかなるデータも外部に送信・収集・保存しません。**

- 外部サーバーとの通信を一切行いません
- アクセス解析ツール、Cookie、トラッキングの類を使用しません
- 会話の内容・入力したテキストを読み取ることはありません

### 2. 本拡張機能が扱う情報

本拡張機能が保存するのは、利用者がポップアップで設定した**表示設定のみ**です。

| 項目 | 例 |
|---|---|
| 有効/無効 | ON / OFF |
| 背景色・濃さ・角丸 | `#FFF1C1` / 80% / 14px |
| 色帯・文字色の設定 | ON/OFF と色 |
| 表示言語 | 自動 / 日本語 / 英語 |

- これらは Chrome の `chrome.storage.sync` に保存され、同じ Google アカウントで
  ログインした Chrome 間で同期されます（Google のアカウント同期の仕組みによるものです）
- 個人を特定する情報は含みません

### 3. 権限の利用目的

| 権限 | 目的 |
|---|---|
| `storage` | 上記の表示設定を保存・同期するため |
| `claude.ai` への contentスクリプト | 自分の発言のふきだしに色を適用するため（CSSの適用のみ） |

本拡張機能は claude.ai のページ構造に対して**スタイル（CSS変数）を適用するだけ**で、
ページ内容の読み取り・送信は行いません。

### 4. お問い合わせ

**hanpen403@gmail.com**

---

## English

This document describes how the "Claude Bubble Color" Chrome extension
("the Extension") handles data.

### 1. Data collected or transmitted

**The Extension does not transmit, collect, or store any data externally.**

- No communication with any external server
- No analytics, cookies, or tracking
- It does not read your conversations or anything you type

### 2. Information the Extension handles

The only thing stored is the **display preferences** you set in the popup:
enabled state, fill color / strength / corner radius, edge-bar and text-color
options, and UI language.

- Stored via Chrome's `chrome.storage.sync`, which syncs between Chrome
  installations signed into the same Google account (Chrome's own sync feature)
- Contains nothing that identifies you

### 3. Why each permission is used

| Permission | Purpose |
|---|---|
| `storage` | Save and sync the display preferences above |
| content script on `claude.ai` | Apply a background color to your own message bubbles (CSS only) |

The Extension only applies styling (CSS custom properties) to claude.ai; it does
not read or send page content.

### 4. Contact

**hanpen403@gmail.com**
