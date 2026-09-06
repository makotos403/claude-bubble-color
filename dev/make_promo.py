"""Fit the Gemini promo tile to the Chrome Web Store small promo tile spec.

House format (CONVENTIONS.md 10.3.2, cf. tomato-pop): solid background, an
icon-style illustration on the left, an English wordmark on the right, as a
single global image (the tile can't be localized). Gemini renders the whole
lockup including the short wordmark; this script only makes it meet spec:
center-crop to 11:7, resize to exactly 440x280, save as 24-bit PNG (no alpha).

If a future Gemini pass can't render clean text, fall back to art-only + a
PIL-composited wordmark (Segoe UI Bold / Yu Gothic Bold).
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
