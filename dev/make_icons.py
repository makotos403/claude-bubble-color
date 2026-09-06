"""Generate the toolbar icons: a flat cream speech bubble with an orange edge
bar and two message lines (matches the store promo tile — no gradient, no
shadow, no outline). Run:  python dev/make_icons.py
"""

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

S = 8  # supersample
BASE = 128
N = BASE * S

OUT = Path(r"D:\Create\Tools\claude-bubble-color\icons")
DEV = Path(r"D:\Create\Tools\claude-bubble-color\dev")

CREAM = (244, 238, 227, 255)
BAR = (229, 129, 61, 255)  # popup --accent
LINE = (107, 74, 58, 255)  # brown message lines


def px(v):
    return round(v * S)


def build() -> Image.Image:
    img = Image.new("RGBA", (N, N), (0, 0, 0, 0))

    bx0, by0, bx1, by1 = px(10), px(15), px(118), px(95)
    rad = px(25)

    # silhouette: rounded bubble + a short tail below, left of centre
    mask = Image.new("L", (N, N), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([bx0, by0, bx1, by1], radius=rad, fill=255)
    md.polygon([(px(46), px(86)), (px(40), px(114)), (px(72), px(93))], fill=255)

    img = Image.composite(Image.new("RGBA", (N, N), CREAM), img, mask)

    # left accent bar: paint the leftmost columns of the bubble orange, so it
    # follows the rounded left corners exactly
    bw = px(15)
    band = Image.new("L", (N, N), 0)
    ImageDraw.Draw(band).rectangle([bx0, 0, bx0 + bw, N], fill=255)
    bar_mask = ImageChops.multiply(mask, band)
    img = Image.composite(Image.new("RGBA", (N, N), BAR), img, bar_mask)

    # two message lines
    d = ImageDraw.Draw(img)
    lx = bx0 + bw + px(12)
    lh = px(9)
    d.rounded_rectangle([lx, px(38), px(103), px(38) + lh], radius=lh // 2, fill=LINE)
    d.rounded_rectangle([lx, px(56), px(86), px(56) + lh], radius=lh // 2, fill=LINE)

    return img.resize((BASE, BASE), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    DEV.mkdir(parents=True, exist_ok=True)
    master = build()
    master.resize((512, 512), Image.LANCZOS).save(DEV / "icon_src.png")
    for size in (16, 32, 48, 128):
        master.resize((size, size), Image.LANCZOS).save(OUT / f"icon{size}.png")
        print("wrote", OUT / f"icon{size}.png")


if __name__ == "__main__":
    main()
