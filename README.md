# ふきだし色 for Claude / Bubble Color for Claude

> claude.ai の会話画面で、**自分の発言のふきだしに背景色**を付けて、Claude の返答と
> 見分けやすくする Chrome 拡張機能（Manifest V3）。非公式。日本語・英語対応。
>
> A Chrome extension (MV3) that gives **your own messages in claude.ai a background
> color** so they stand out from Claude's replies in long chats. Unofficial.
> English & Japanese.

**公開中 / Published** — [Chrome ウェブストア](https://chromewebstore.google.com/detail/bubble-color-for-claude/opfoggpkdjfghmpihdkdbclnfhehmcgh)（v1.0.1）

---

## 特長 / Features

- 自分の発言のふきだしを好きな色に。**背景色・濃さ・角丸**を調整
- 7色のワンタップ・プリセット（バター / ミント / ピーチ / ラベンダー / スカイ / ローズ / グラファイト）
- 任意で **左端の色帯**・**文字色**も指定可能
- ポップアップに**ライブプレビュー**。変更は自動保存、開いている claude.ai に即反映
- `chrome.storage.sync` 対応 — 同じ Google アカウントの Chrome 間で設定が同期
- 外部通信なし — すべてブラウザ内で完結（[PRIVACY.md](PRIVACY.md)）

## インストール（開発版）/ Install (dev)

1. このフォルダを clone またはダウンロード
2. `chrome://extensions` を開き「デベロッパーモード」を ON
3. 「パッケージ化されていない拡張機能を読み込む」→ このフォルダを選択
4. ツールバーのアイコンからポップアップを開き、色を設定

## 構成 / Layout

[../CONVENTIONS.md](../CONVENTIONS.md) に従ったフラット構成。

| ファイル | 役割 |
|---|---|
| `manifest.json` | MV3 マニフェスト。権限は `storage` のみ |
| `content.js` | claude.ai で設定を読み、`<html>` に CSS 変数を書き込み `data-cbt` を切替。`defaults.js` は動的 import |
| `tint.css` | `[data-testid="user-message"]` に色を当てる content-script スタイル |
| `defaults.js` | 設定の型・プリセット・`settingsToVars()`（純粋関数） |
| `popup.*` | 設定 UI ＋ライブプレビュー |
| `i18n.js` | ポップアップ文言の実行時ローダ |
| `strings.{ja,en}.json` | ポップアップの文言辞書 |
| `_locales/{en,ja}/messages.json` | ストア表示名・説明（`chrome.i18n`） |
| `icons/` | ツールバーアイコン |
| `dev/` | 出荷しない開発用（元画像・テスト）。ストア zip から除外 |

## 開発 / Development

```
node dev/tint.test.mjs   # settingsToVars / normalize の純粋関数テスト
```

## 権限 / Permissions

| 権限 | 目的 |
|---|---|
| `storage` | 表示設定の保存・同期 |
| content script（`https://claude.ai/*`） | 自分の発言のふきだしに CSS を適用 |

## 更新耐性 / Resilience

claude.ai の自分のふきだしは、パディング付きの外側 div が
`bg-[var(--cds-bg-user-message)]` という**デザイントークン**で塗られ、
その数階層内側に `[data-testid="user-message"]` がある。
[`tint.css`](tint.css) はこのトークンを2通りで捕まえる:

1. `--cds-bg-user-message` 自体を再定義 → 大元でふきだし色を差し替え
2. そのトークンのユーティリティ class（`[class*="cds-bg-user-message"]`）で
   ふきだし要素を選択 → 角丸・色帯を適用

将来 claude.ai がトークン名を変えたら、[`tint.css`](tint.css) 内のこの文字列を
差し替えれば直る。外した場合も «色が付かないだけ» でページ自体には影響しない。

## ライセンス / License

MIT — [LICENSE](LICENSE)
