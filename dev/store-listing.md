# Chrome Web Store — 申請用メモ / listing copy

出荷物ではない（`dev/` はストア zip から除外）。申請フォームに貼る内容と手順を集約。

- **パッケージ**: `../claude-bubble-color-v1.0.0.zip` — `powershell -ExecutionPolicy Bypass -File dev/pack.ps1` で生成
- **プライバシーポリシー URL**: https://github.com/makotos403/claude-bubble-color/blob/main/PRIVACY.md
- **カテゴリ**: Functionality & UI（代替: Accessibility）
- **言語**: English, Japanese
- **公開範囲**: 最初は Unlisted で動作確認 → 問題なければ Public

---

## Store listing

### Product name
- en: `Bubble Color for Claude`
- ja: `ふきだし色 for Claude`

商標（Claude）を先頭に置かない形。説明文にも「非公式 / Not affiliated」を明記。
（listing 名は manifest の `__MSG_appName__` から言語別に自動取得）

### Summary（≤132字・言語別）

**en**

```
Give your own messages in claude.ai a background color, so they stand out from Claude's replies in long conversations.
```

**ja**

```
claude.ai の会話で自分の発言に背景色を付け、Claude の返答と見分けやすくします。長い会話でも自分の発言を見失いません。
```

### Description（言語別）

**en**

```
Long conversations in claude.ai are hard to skim — your messages and Claude's replies look almost the same, so you lose your place when scrolling back.

Bubble Color for Claude gives your own message bubbles a background color of your choice.

FEATURES
• Pick any fill color, and adjust its strength and corner rounding
• 7 one-tap presets (butter, mint, peach, lavender, sky, rose, graphite)
• Optional: a colored edge bar and a custom text color
• Live preview in the popup; changes save automatically and apply to open claude.ai tabs right away
• Settings sync across your Chrome installs via Chrome's built-in sync

PRIVACY
• No external servers, analytics, or tracking
• It never reads your conversations — it only applies a color
• The only thing stored is your color settings
• Full policy: https://github.com/makotos403/claude-bubble-color/blob/main/PRIVACY.md

Not affiliated with Anthropic. "Claude" is a trademark of Anthropic.
```

**ja**

```
claude.ai の長い会話は流し読みしづらい — 自分の発言と Claude の返答の見た目がほぼ同じで、スクロールで戻ると位置を見失います。

「ふきだし色 for Claude」は、自分の発言のふきだしに好きな背景色を付けます。

主な機能
・好きな背景色を選び、濃さと角丸を調整
・7色のワンタップ・プリセット（バター / ミント / ピーチ / ラベンダー / スカイ / ローズ / グラファイト）
・任意で、左端の色帯と文字色も指定可能
・ポップアップにライブプレビュー。変更は自動保存され、開いている claude.ai にすぐ反映
・設定は Chrome の同期機能で端末間で共有

プライバシー
・外部サーバー・アクセス解析・トラッキングなし
・会話の内容は一切読み取らず、色を付けるだけ
・保存するのは色の設定のみ
・詳細: https://github.com/makotos403/claude-bubble-color/blob/main/PRIVACY.md

Anthropic とは関係のない非公式ツールです。「Claude」は Anthropic の商標です。
```

### Graphic assets

| 用途 | 仕様 | 状態 |
|---|---|---|
| Store icon | 128×128 PNG | ✅ `icons/icon128.png` |
| Screenshot | 1280×800・24bit PNG・アルファなし | ✅ `dev/store/` に4枚（帯入り） |
| Small promo tile | 440×280・24bit PNG・アルファなし | ✅ `dev/store/promo-small-{ja,en}.png`（Gemini 素材 → `dev/make_promo.py`） |

**スクリーンショット**（CONVENTIONS §10.3.1）

- 原本: `dev/store/raw/ss0{1,2}_{en,ja}.png`（`ss01`=会話, `ss02`=ポップアップ）
  - `ss01_ja` はアドレスバーの URL を目隠し（他3枚と揃える）
- 帯入りアップロード用: `dev/store/<順番>-<slug>-<lang>.png` — `python dev/caption_shots.py` で生成
- 帯: 画面下部・全幅 104px / `#3A3330`・上辺に 3px `#E5813D`（= 拡張の UI パレット）/ 文字 `#FBF7F2` Yu Gothic Bold 26px

| ファイル | 内容 | アップロード先 |
|---|---|---|
| `1-popup-en.png` | ポップアップ＋色付き会話（peach） | 英語リスト **1枚目** |
| `2-chat-en.png` | 色付き会話のみ | 英語リスト 2枚目 |
| `1-popup-ja.png` | 同上・日本語 UI | 日本語リスト 1枚目 |
| `2-chat-ja.png` | 同上・日本語 | 日本語リスト 2枚目 |

帯の文言:

| | JA | EN |
|---|---|---|
| 1-popup | 自分の発言に色を。プリセットとライブプレビュー付き | Pick your color — presets and a live preview |
| 2-chat | 長い会話でも自分の発言をひと目で見分けられる | Spot your own messages at a glance in long chats |

1枚目はポップアップ版（結果＋操作 UI が同時に見える）。会話のみ版を先にしても可。

**小プロモタイル**（CONVENTIONS §10.3.2）

- 原本: `dev/store/raw/promo_src.png`（Gemini 作図・文字なし・単一の吹き出し＋オレンジ帯）
- 仕上げ: `python dev/make_promo.py` → `dev/store/promo-small-{ja,en}.png`
- ワードマークは左下のクリーム角丸チップ＋オレンジのアクセントバー、二色組版（`#3A3330` ＋ `#E5813D` / Yu Gothic Bold）

---

## Privacy practices（申請フォーム）

### Single purpose

```
Bubble Color for Claude applies a user-chosen background color to the user's
own messages in claude.ai conversations, so they are easy to tell apart from
Claude's replies. It does nothing else.
```

### Permission justifications

**storage**

```
Stores the user's color preferences (fill color, strength, corner radius,
optional edge bar and text color, on/off, UI language) and syncs them across
the user's own Chrome installations. Nothing else is stored.
```

**Host permission — `https://claude.ai/*`**（content script 由来）

```
The extension injects one stylesheet and one small script into claude.ai to
apply the user's chosen background color to their own message bubbles. It runs
only on claude.ai and does not read or transmit page content.
```

**Remote code**: **No.**

```
All code ships in the package. The content script loads one bundled module
(defaults.js) via a runtime import of a packaged file; no external or remotely
hosted code is executed.
```

### Data usage

- 収集項目：**すべて「収集しない」**（PII / 健康 / 金融 / 認証情報 / 個人的な通信 / 位置 / 閲覧履歴 / ユーザー操作 / ウェブサイトコンテンツ — 全部チェックしない）
  - `chrome.storage.sync` はユーザー自身の Google アカウント同期領域であり、開発者への送信ではない → 「収集」に該当しない
- 3つの誓約にチェック：
  - データを承認された用途以外に使用しない
  - データを第三者に販売しない
  - 与信目的で使用しない
- プライバシーポリシー URL を入力

---

## 提出手順

1. Developer Dashboard（https://chrome.google.com/webstore/devconsole）にログイン
   - 初回のみ $5 の登録料（tomato-pop で登録済みなら不要）
2. 「新しいアイテム」→ `claude-bubble-color-v1.0.0.zip` をアップロード
3. Store listing / Privacy / Distribution を上記の内容で埋める
4. スクリーンショット2枚をアップロード
5. 「審査のために送信」

## zip 再生成（version 上げたとき）

```
powershell -ExecutionPolicy Bypass -File dev/pack.ps1
```

manifest の `version` を読んで `../claude-bubble-color-v<version>.zip` を作る。
`git ls-files` から `dev/` と repo ドキュメントを除いた「Chrome が読むファイルだけ」を、
パス区切り `/` で固める（`Compress-Archive` は `\` になり CWS で問題が出るため使わない）。
