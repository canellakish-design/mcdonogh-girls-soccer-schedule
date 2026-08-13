# Builds a static map thumbnail per away venue from OpenStreetMap tiles.
# No API key and no billing — we fetch a handful of tiles, stitch them,
# drop a pin, and stamp the required attribution.
#
#   py scripts/build-venue-maps.py
#
# Re-run only when a venue changes; the images are committed to public/.

from PIL import Image, ImageDraw, ImageFont
import io
import math
import os
import time
import urllib.request

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'venues')
ZOOM = 16
COLS, ROWS = 3, 2          # 768 x 512 before the pin
TILE = 256
ORANGE = (232, 84, 30)
UA = 'mcdonogh-girls-soccer-schedule/1.0 (team schedule site; contact via mcdonogh.org)'

VENUES = {
    'mercy':        (39.3671757, -76.5887127, 'Mercy High School'),
    'liberty':      (39.4129682, -76.9514061, 'Liberty High School'),
    'good-counsel': (39.1408435, -77.0452122, 'Our Lady of Good Counsel'),
    'notre-dame':   (39.4139461, -76.5786262, 'Notre Dame Prep'),
    'roland-park':  (39.3577678, -76.6369027, 'Roland Park Country School'),
    'seminary-park':(39.4217305, -76.6376496, 'Seminary Park'),
}


def deg2num(lat, lon, z):
    lat_r = math.radians(lat)
    n = 2.0 ** z
    x = (lon + 180.0) / 360.0 * n
    y = (1.0 - math.asinh(math.tan(lat_r)) / math.pi) / 2.0 * n
    return x, y


def font(sz):
    for p in ('C:/Windows/Fonts/arialbd.ttf', 'C:/Windows/Fonts/arial.ttf'):
        try:
            return ImageFont.truetype(p, sz)
        except Exception:
            pass
    return ImageFont.load_default()


def fetch(z, x, y):
    url = f'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return Image.open(io.BytesIO(r.read())).convert('RGB')


def build(key, lat, lon, label):
    fx, fy = deg2num(lat, lon, ZOOM)
    x0 = int(fx) - COLS // 2
    y0 = int(fy) - ROWS // 2
    canvas = Image.new('RGB', (COLS * TILE, ROWS * TILE), (235, 235, 232))

    for dx in range(COLS):
        for dy in range(ROWS):
            try:
                canvas.paste(fetch(ZOOM, x0 + dx, y0 + dy), (dx * TILE, dy * TILE))
            except Exception as e:
                print('  tile failed', x0 + dx, y0 + dy, e)
            time.sleep(0.35)   # be polite to the tile server

    # Where the venue sits inside the stitched image.
    px = (fx - x0) * TILE
    py = (fy - y0) * TILE
    d = ImageDraw.Draw(canvas)

    # Pin: circle on a stem.
    r = 13
    d.line([(px, py), (px, py - 26)], fill=ORANGE, width=6)
    d.ellipse([px - r, py - 26 - r, px + r, py - 26 + r], fill=ORANGE, outline='white', width=3)

    # Attribution — required by the OSM tile usage policy.
    f = font(13)
    txt = '© OpenStreetMap contributors'
    bb = d.textbbox((0, 0), txt, font=f)
    d.rectangle([0, canvas.height - (bb[3] - bb[1]) - 10, bb[2] + 12, canvas.height],
                fill=(255, 255, 255))
    d.text((6, canvas.height - (bb[3] - bb[1]) - 7), txt, font=f, fill=(60, 60, 60))

    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, key + '.png')
    canvas.save(path, optimize=True)
    print('wrote', key, '->', label)


if __name__ == '__main__':
    for key, (lat, lon, label) in VENUES.items():
        build(key, lat, lon, label)
