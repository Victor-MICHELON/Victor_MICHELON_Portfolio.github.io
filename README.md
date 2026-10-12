# Victor Michelon, portfolio

Source of my portfolio site: [victor-michelon.github.io/Victor_MICHELON_Portfolio.github.io](https://victor-michelon.github.io/Victor_MICHELON_Portfolio.github.io/)

A single static page with six GenAI and machine learning projects, each with its results and its limits. The first project, my Parkinson's hackathon lab, includes a chart of its real run log.

## Structure

```
index.html          the page (content, and the run data used by the chart)
assets/style.css    styles
assets/app.js       draws the hero chart from the run data, with a tooltip
assets/img/         project screenshots, optimized to WebP
```

No build step and no framework: plain HTML, CSS and a little JavaScript. Fonts (Bricolage Grotesque and Source Serif 4) load from Google Fonts.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Update it

- **Text and projects:** edit `index.html`. Each project is one `<article class="project">`.
- **Chart data:** the JSON in the `runs-data` script tag and the table next to it come from `lab/results.csv` in [Hackathon-IBMxProbabl](https://github.com/Victor-MICHELON/Hackathon-IBMxProbabl). Update both if the log changes.

## Deploy

GitHub Pages, from the `main` branch, root folder (Settings, Pages).

## License

[MIT](LICENSE)
