# best-national-statistics-site-20261126-0539

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/daviddika/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/daviddika/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

NusaStat — Portal Statistik Nasional Indonesia: an original national statistics site for Indonesia that runs offline from static files. Dashboard, population & demographics, economy (GDP, inflation, trade), employment, a 38-province comparison, sortable/filterable data tables, and a methodology page — with real 2015–2024 figures from BPS, Bank Indonesia, and the World Bank, SVG charts, a year selector, Rp/US$ unit toggle, province selector, bilingual (Indonesian/English) search, and a light/dark theme. No build step and no network requests at runtime.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop or phone browser.

## Files

- `app/` — the static site: `index.html`, `style.css`, `data.js` (all figures, 2015–2024), `charts.js` (SVG line/bar/donut builders), `views.js` (one renderer per page), `app.js` (hash router, search, theme and unit toggles)
- `main.ts` — the entry program (Node 22, stdlib only): copies `app/` and `screenshots/` to `/output` and writes `dossier.json`
- `screenshots/` — four real renders of the site (dashboard, economy, provinces, phone)
- `shots.json` — which view each screenshot was taken of
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
- `serve.ts` — a tiny static server for local testing

---

<sub>Entered on [make.fun](https://make.fun/?ref=dika-david&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
