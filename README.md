# Victor Michelon, portfolio

Source of my portfolio site: [victor-michelon.github.io/Victor_MICHELON_Portfolio.github.io](https://victor-michelon.github.io/Victor_MICHELON_Portfolio.github.io/)

A static site with four machine learning case studies, each with its method, its results and its limits. The home page lists them as cards; each case study has its own page with charts drawn from the real results.

## Structure

```
index.html               the home page: hero, project cards, about, contact
projects/*.html          one case study per project (parkinson, cinematch, brain-tumor, tsunami)
projects/_template.html  starting point for a new case study (not published: Jekyll skips "_" files)
404.html                 page shown for any missing URL (absolute paths)
sitemap.xml              the five pages, for Google Search Console
assets/tokens.css        colors, fonts and spacing, light and dark themes, one accent per project
assets/style.css         base styles and home page components
assets/project.css       case study components: key figures, table of contents, callouts, steps, code blocks
assets/site.js           light/dark switch and fade-in on scroll, on every page
assets/app.js            Parkinson page: draws the run chart from the runs-data JSON, with a tooltip
assets/charts.js         case study charts (bars, grouped bars, radar) drawn from JSON blocks in the page
assets/project.js        case study pages: current section in the table of contents, copy buttons
assets/img/              screenshots (WebP, with smaller variants), the Tsunami map (SVG)
assets/img/og/           1200×630 social preview images, one per page
scripts/                 one-off generators: build_tsunami_map.py, og-template.html
```

The theme follows the system setting until the visitor uses the switch; the choice is then kept in `localStorage`.

No build step and no framework: plain HTML, CSS and a little JavaScript. Fonts (Bricolage Grotesque and Source Serif 4) load from Google Fonts.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Update it

- **Home page:** edit `index.html`. Each project is one `<article class="card">`; its `data-project` attribute picks the accent color.
- **Case studies:** edit `projects/<name>.html`. Sections are `<section id>` blocks, each listed in the table of contents at the top of the page.
- **Charts:** a chart is `<div class="chart" data-chart="bars|grouped|radar" data-src="id">` plus a `<script type="application/json" id="id">` holding its data. The figures come from the project READMEs and notebooks.
- **Parkinson run chart:** the `runs-data` JSON and the table next to it come from `lab/results.csv` in [Hackathon-IBMxProbabl](https://github.com/Victor-MICHELON/Hackathon-IBMxProbabl), up to the submitted run `b006_seq4_gruref`. Update both if the log changes.
- **Social previews:** after changing a title or key figure, re-render `assets/img/og/` from `scripts/og-template.html`.

## Deploy

GitHub Pages, from the `main` branch, root folder (Settings, Pages).

## License

[MIT](LICENSE)
