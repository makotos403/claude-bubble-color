"""Burn a full-width caption band into each store screenshot.

Reads dev/store/raw/ss<NN>_<lang>.png (1280x800), writes the captioned
upload copies to dev/store/<order>-<slug>-<lang>.png at the same size.
See CONVENTIONS.md 10.3.1. Brand palette matches the popup UI (popup.css).
"""

import os

from PIL import Image, ImageDraw, ImageFont

SRC = r"D:\Create\Tools\claude-bubble-color\dev\store\raw"
OUT = r"D:\Create\Tools\claude-bubble-color\dev\store"
FONT_PATH = r"C:\Windows\Fonts\YuGothB.ttc"  # Yu Gothic Bold

CREAM = (251, 247, 242)  # --bg
CHARCOAL = (58, 51, 48)  # --text
ACCENT = (229, 129, 61)  # --accent

BAND_H = 104

SHOTS = [
    ("ss02", "1-popup",
     "自分の発言に色を。プリセットとライブプレビュー付き",
     "Pick your color — presets and a live preview"),
    ("ss01", "2-chat",
     "長い会話でも自分の発言をひと目で見分けられる",
     "Spot your own messages at a glance in long chats"),
]


def add_band(img, text):
    w, h = img.size
    d = ImageDraw.Draw(img)
    top = h - BAND_H
    d.rectangle([0, top, w, h], fill=CHARCOAL)
    d.rectangle([0, top, w, top + 3], fill=ACCENT)  # brand accent line

    font = ImageFont.truetype(FONT_PATH, 26, index=0)
    bbox = d.textbbox((0, 0), text, font=font)
    ty = top + (BAND_H - (bbox[3] - bbox[1])) // 2 - bbox[1] + 2
    d.text((52 - bbox[0], ty), text, font=font, fill=CREAM)
    return img


def main():
    for raw, name, ja, en in SHOTS:
        for lang, cap in (("ja", ja), ("en", en)):
            src = os.path.join(SRC, f"{raw}_{lang}.png")
            im = add_band(Image.open(src).convert("RGB"), cap)
            dst = os.path.join(OUT, f"{name}-{lang}.png")
            im.save(dst)
            print(f"{raw}_{lang}  ->  dev/store/{name}-{lang}.png")


if __name__ == "__main__":
    main()
