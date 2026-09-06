"""Finish the Gemini promo artwork into the 440x280 small promo tile.

Reads dev/store/raw/promo_src.png (Gemini output: text-free landscape art),
crops in on the center subject, resizes to 440x280, and sets the wordmark in a
small rounded "tag" (cream chip + orange accent bar, echoing the hero bubble),
then writes dev/store/promo-small-<lang>.png (24-bit PNG, no alpha).
See CONVENTIONS.md 10.3.2. Font: Yu Gothic Bold.
"""

import os

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

SRC = r"D:\Create\Tools\claude-bubble-color\dev\store\raw\promo_src.png"
OUT = r"D:\Create\Tools\claude-bubble-color\dev\store"
FONT_PATH = r"C:\Windows\Fonts\YuGothB.ttc"

W, H = 440, 280

INK = (58, 51, 48)  # popup --text
ACCENT = (229, 129, 61)  # popup --accent
CHIP = (255, 253, 248)
CHIP_EDGE = (232, 214, 197)

MARGIN = 16
ZOOM = 1.0
V_BIAS = 0.5  # 0 top .. 1 bottom (only bites when the source is taller than 11:7)

WORDMARK = {
    "ja": ("ふきだし色", "for Claude"),
    "en": ("Bubble Color", "for Claude"),
}


def crop_resize(im):
    target = W / H
    cw = round(im.size[0] / ZOOM)
    ch = round(cw / target)
    if ch > im.size[1]:
        ch = im.size[1]
        cw = round(ch * target)
    cx = (im.size[0] - cw) // 2
    cy = round((im.size[1] - ch) * V_BIAS)
    im = im.crop((cx, cy, cx + cw, cy + ch)).resize((W, H), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(1.1)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    return im.convert("RGBA")


def wordmark_tag(base, name, suffix):
    f_name = ImageFont.truetype(FONT_PATH, 20, index=0)
    f_suffix = ImageFont.truetype(FONT_PATH, 13, index=0)
    measure = ImageDraw.Draw(base)
    w_name = measure.textlength(name, font=f_name)
    w_suffix = measure.textlength(suffix, font=f_suffix)

    bar_x, bar_w, gap = 6, 4, 8
    pad_l, pad_r = bar_x + bar_w + 12, 15
    pill_w = round(pad_l + w_name + gap + w_suffix + pad_r)
    pill_h, radius = 42, 14
    x0, y0 = MARGIN, H - MARGIN - pill_h
    x1, y1 = x0 + pill_w, y0 + pill_h
    cy = y0 + pill_h / 2

    # soft drop shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [x0, y0 + 4, x1, y1 + 4], radius=radius, fill=(60, 45, 35, 70)
    )
    base.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(6)))

    d = ImageDraw.Draw(base)
    d.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=CHIP, outline=CHIP_EDGE, width=1)
    d.rounded_rectangle(
        [x0 + bar_x, y0 + 10, x0 + bar_x + bar_w, y1 - 10], radius=2, fill=ACCENT
    )

    tx = x0 + pad_l
    d.text((tx, cy), name, font=f_name, fill=INK, anchor="lm")
    d.text((tx + w_name + gap, cy + 1), suffix, font=f_suffix, fill=ACCENT, anchor="lm")
    return base


def main():
    base = crop_resize(Image.open(SRC).convert("RGB"))
    for lang, (name, suffix) in WORDMARK.items():
        out = wordmark_tag(base.copy(), name, suffix).convert("RGB")
        path = os.path.join(OUT, f"promo-small-{lang}.png")
        out.save(path)
        print("wrote", path, out.size)


if __name__ == "__main__":
    main()
