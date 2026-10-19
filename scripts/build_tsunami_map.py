"""Draw the Tsunami card thumbnail: epicenters over tectonic plate boundaries.

Reads the two data files of the Tsunami_Risk_Prediction_Model repository and writes
assets/img/tsunami-map.svg. Standard library only. Run once, from the site root:

    python3 scripts/build_tsunami_map.py ../Tsunami_Risk_Prediction_Model/Data
"""
import csv
import json
import sys
from pathlib import Path

# Pacific-centred equirectangular window, close to 16:9
CENTER_LON = 190
LON_SPAN = (-108, 108)
LAT_SPAN = (-62, 68)
SCALE = 4
W = (LON_SPAN[1] - LON_SPAN[0]) * SCALE
H = (LAT_SPAN[1] - LAT_SPAN[0]) * SCALE

# fixed colours: the SVG is loaded as an image, so it cannot read the page theme
PLATE = "#8a96ad"
QUAKE = "#8a96ad"
TSUNAMI = "#2f9be6"


def project(lon, lat):
    rel = (lon - CENTER_LON + 540) % 360 - 180
    return (rel - LON_SPAN[0]) * SCALE, (LAT_SPAN[1] - lat) * SCALE


def boundary_paths(features):
    parts = []
    for f in features:
        run, last = [], None
        for lon, lat in f["geometry"]["coordinates"]:
            x, y = project(lon, lat)
            pt = (round(x), round(y))
            if last and abs(pt[0] - last[0]) > W / 2:  # crosses the map edge
                parts.append(run)
                run = []
            if pt != last:
                run.append(pt)
            last = pt
        parts.append(run)
    d = []
    for run in parts:
        if len(run) > 1:
            d.append("M" + "L".join(f"{x} {y}" for x, y in run))
    return "".join(d)


def main(data_dir):
    data_dir = Path(data_dir)
    plates = json.loads((data_dir / "PB2002_boundaries.json").read_text())["features"]
    with open(data_dir / "earthquake_data_tsunami.csv", newline="") as f:
        quakes = list(csv.DictReader(f))

    dots = {"0": [], "1": []}
    for q in quakes:
        x, y = project(float(q["longitude"]), float(q["latitude"]))
        if 0 <= x <= W and 0 <= y <= H:
            dots[q["tsunami"]].append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="4.5"/>')

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">'
        f'<path d="{boundary_paths(plates)}" fill="none" stroke="{PLATE}" stroke-width="2" stroke-linejoin="round" opacity="0.55"/>'
        f'<g fill="{QUAKE}" opacity="0.55">{"".join(dots["0"])}</g>'
        f'<g fill="{TSUNAMI}" opacity="0.9">{"".join(dots["1"])}</g>'
        "</svg>\n"
    )
    out = Path(__file__).resolve().parent.parent / "assets" / "img" / "tsunami-map.svg"
    out.write_text(svg)
    shown = len(dots["0"]) + len(dots["1"])
    print(f"{out}: {shown} of {len(quakes)} earthquakes, {len(dots['1'])} with a tsunami, {len(svg) // 1024} KB")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "../Tsunami_Risk_Prediction_Model/Data")
