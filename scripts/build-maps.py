# Draws an arrow on the McDonogh campus map, one image per field we use.
# Source is the school's published campus map, flattened onto white.
#
#   py scripts/build-maps.py
#
# Coordinates are in the source image's own pixel space (3300x2550).

from PIL import Image, ImageDraw, ImageFont
import math
import os

SRC = os.path.join(os.path.dirname(__file__), '..', 'assets', 'campus-map-source.png')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public')
ORANGE = (232, 84, 30, 255)

# label, arrow tail, arrow tip, output filename
TARGETS = [
    ('FIELD 16', (330, 1420), (735, 1085), 'campus-map.png'),
    ('DIXON TURF', (905, 100), (1230, 200), 'campus-map-dixon.png'),
]


def font(sz):
    for p in ('C:/Windows/Fonts/arialbd.ttf', 'C:/Windows/Fonts/arial.ttf'):
        try:
            return ImageFont.truetype(p, sz)
        except Exception:
            pass
    return ImageFont.load_default()


def draw(label, tail, tip, out):
    src = Image.open(SRC).convert('RGBA')
    w, h = src.size
    canvas = Image.new('RGBA', (w, h), (255, 255, 255, 255))
    canvas.alpha_composite(src)
    d = ImageDraw.Draw(canvas)

    d.line([tail, tip], fill=ORANGE, width=16)
    ang = math.atan2(tip[1] - tail[1], tip[0] - tail[0])
    L, spread = 70, 0.42
    p1 = (tip[0] - L * math.cos(ang - spread), tip[1] - L * math.sin(ang - spread))
    p2 = (tip[0] - L * math.cos(ang + spread), tip[1] - L * math.sin(ang + spread))
    d.polygon([tip, p1, p2], fill=ORANGE)

    f = font(52)
    bb = d.textbbox((0, 0), label, font=f)
    bw, bh = bb[2] - bb[0], bb[3] - bb[1]
    # Sit the label just beyond the tail, away from the arrow direction.
    bx = tail[0] - bw // 2 - 20
    by = tail[1] + 22 if tip[1] > tail[1] else tail[1] - bh - 56
    d.rounded_rectangle([bx, by, bx + bw + 40, by + bh + 30], radius=12, fill=ORANGE)
    d.text((bx + 20, by + 11), label, font=f, fill=(255, 255, 255, 255))

    img = canvas.convert('RGB').resize((1650, 1275), Image.LANCZOS)
    path = os.path.join(OUT_DIR, out)
    img.save(path, optimize=True)
    print('wrote', out)


if __name__ == '__main__':
    for t in TARGETS:
        draw(*t)
