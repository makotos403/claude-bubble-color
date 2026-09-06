"""Fit the Gemini promo artwork to the Chrome Web Store small promo tile.

The small promo tile is a SINGLE global image (unlike screenshots it can't be
localized), so it carries no wordmark: every store surface already shows the
localized extension name next to it. This just makes the raw art meet spec —
center-crop to 11:7, resize to exactly 440x280, save as 24-bit PNG (no alpha).
See CONVENTIONS.md 10.3.2.
"""

from PIL import Image

SRC = r"D:\Create\Tools\claude-bubble-color\dev\store\raw\promo_src.png"
OUT = r"D:\Create\Tools\claude-bubble-color\dev\store\promo-small.png"
W, H = 440, 280


def main():
    im = Image.open(SRC).convert("RGB")
    target = W / H
    cw, ch = im.width, round(im.width / target)
    if ch > im.height:
        ch, cw = im.height, round(im.height * target)
    cx, cy = (im.width - cw) // 2, (im.height - ch) // 2
    im = im.crop((cx, cy, cx + cw, cy + ch)).resize((W, H), Image.LANCZOS)
    im.save(OUT)
    print("wrote", OUT, im.size)


if __name__ == "__main__":
    main()
