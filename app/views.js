import { DATA } from "./data.js";
import { lineChart, barChart, donutChart, fmtNum } from "./charts.js";

const USD_RATE = 15850;
const YEARS = DATA.years;

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function idx(state) {
  const y = Number(state?.year) || 2024;
  const i = YEARS.indexOf(y);
  return i >= 0 ? i : YEARS.length - 1;
}

function yearOf(state) {
  return YEARS[idx(state)];
}

/* Value may be a scalar (latest year) or a yearly array. */
function pick(v, i) {
  if (Array.isArray(v)) return v[i] ?? v[v.length - 1];
  return v;
}

function src(source, year) {
  return `<p class="src">Source: ${esc(source)}${year ? `, ${esc(String(year))}` : ""}</p>`;
}

function kpi(label, value, sub, source, year) {
  return `<article class="kpi"><p class="kpi-label">${esc(label)}</p>`
    + `<p class="kpi-value">${value}</p>`
    + (sub ? `<p class="kpi-sub">${sub}</p>` : "")
    + `<p class="kpi-src">Source: ${esc(source)}${year ? `, ${esc(String(year))}` : ""}</p></article>`;
}

function sectionHead(title, intro) {
  return `<header class="section-head"><h2>${esc(title)}</h2>`
    + (intro ? `<p>${esc(intro)}</p>` : "") + `</header>`;
}

function yearSelect(state) {
  const opts = YEARS.map((y) => `<option value="${y}"${y === yearOf(state) ? " selected" : ""}>${y}</option>`).join("");
  return `<label class="year-picker">Year <select id="year-select">${opts}</select></label>`;
}

function unitsLabel(state) {
  return state?.units === "usd" ? "US$" : "Rp";
}

/* Population stored either as persons or as millions; display in millions. */
function popMillions(v) {
  const n = Number(v) || 0;
  return n >= 1000 ? n / 1e6 : n;
}

function fmtPop(v) {
  return `${fmtNum(popMillions(v), 1)} million`;
}

function densityOf(prov) {
  const persons = Number(prov.population) >= 1000 ? Number(prov.population) : Number(prov.population) * 1e6;
  return prov.area ? persons / Number(prov.area) : 0;
}

function gdpLabel(state, i) {
  const rp = Number(DATA.gdp.nominalRp[i]) || 0;
  if (state?.units === "usd") return `${fmtNum(rp / USD_RATE, 2)} trillion US$`;
  return `${fmtNum(rp, 0)} trillion Rp`;
}

function topProvinces(n) {
  return [...DATA.provinces].sort((a, b) => Number(b.population) - Number(a.population)).slice(0, n);
}

function sortArrow(state, key) {
  if (state?.tableSort?.key !== key) return "";
  return state.tableSort.dir === 1 ? " ▲" : " ▼";
}

function th(state, key, label) {
  return `<th><button type="button" data-action="sort-table" data-key="${esc(key)}">${esc(label)}${sortArrow(state, key)}</button></th>`;
}

function sortProvinces(list, sort) {
  const key = sort?.key || "population";
  const dir = sort?.dir || -1;
  const val = (p) => {
    if (key === "density") return densityOf(p);
    if (key === "name") return String(p.name).toLowerCase();
    return Number(p[key]) || 0;
  };
  return [...list].sort((a, b) => {
    const va = val(a), vb = val(b);
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
}

function provinceRows(state, list) {
  return sortProvinces(list, state?.tableSort).map((p) => `<tr>`
    + `<td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td>${fmtPop(p.population)}</td>`
    + `<td>${fmtNum(Number(p.area), 0)} km²</td><td>${fmtNum(densityOf(p), 0)} /km²</td>`
    + `<td>${fmtNum(Number(p.hdi), 2)}</td><td>${fmtNum(Number(p.poverty), 2)}%</td>`
    + `<td>${fmtNum(Number(p.unemployment), 2)}%</td></tr>`).join("");
}

function provinceTable(state) {
  return `<table class="data-table"><thead><tr>`
    + th(state, "name", "Province") + `<th>Capital</th>`
    + th(state, "population", "Population") + th(state, "area", "Area")
    + th(state, "density", "Density") + th(state, "hdi", "HDI")
    + th(state, "poverty", "Poverty") + th(state, "unemployment", "Unemployment")
    + `</tr></thead><tbody>${provinceRows(state, DATA.provinces)}</tbody></table>`
    + src("BPS", 2024);
}

function quickLink(href, title, text) {
  return `<a class="quick-link" href="${esc(href)}"><h3>${esc(title)}</h3><p>${esc(text)}</p></a>`;
}

/* ---------------- Dashboard ---------------- */

export function renderDashboard(state) {
  const i = idx(state);
  const y = yearOf(state);
  const top10 = topProvinces(10);
  const releases = [
    { label: `Population ${y}`, value: fmtPop(DATA.population.total[i]), source: "BPS" },
    { label: `GDP growth ${y}`, value: `${fmtNum(Number(DATA.gdp.growth[i]), 2)}%`, source: "BPS" },
    { label: `Inflation (Dec) ${y}`, value: `${fmtNum(Number(DATA.inflation.cpiDec[i]), 2)}%`, source: "BPS" },
    { label: `Unemployment ${y}`, value: `${fmtNum(Number(DATA.unemployment[i]), 2)}%`, source: "BPS" },
    { label: `Human Development Index ${y}`, value: fmtNum(Number(DATA.hdi[i]), 2), source: "BPS" },
    { label: `Poverty rate ${y}`, value: `${fmtNum(Number(DATA.poverty[i]), 2)}%`, source: "BPS" },
  ];
  return `<section class="hero"><p class="eyebrow">${esc(DATA.meta.portal)}</p>`
    + `<h1>${esc(DATA.meta.country)} in numbers</h1>`
    + `<p class="tagline">${esc(DATA.meta.tagline)}</p>`
    + `<p class="updated">Last updated: ${esc(DATA.meta.updated)} · ${esc(DATA.meta.currencyNote)}</p>`
    + `<div class="hero-actions"><a class="btn" href="#/population">Explore population</a>`
    + `<a class="btn btn-ghost" href="#/economy">Explore the economy</a></div></section>`
    + `<section class="controls">${yearSelect(state)}`
    + `<button type="button" class="btn btn-small" data-action="toggle-units">Currency: ${unitsLabel(state)} (switch to ${state?.units === "usd" ? "Rp" : "US$"})</button></section>`
    + `<section class="kpi-grid">`
    + kpi(`Population ${y}`, fmtPop(DATA.population.total[i]), `Growth ${fmtNum(Number(DATA.population.growth[i]), 2)}%`, "BPS", y)
    + kpi(`GDP growth ${y}`, `${fmtNum(Number(DATA.gdp.growth[i]), 2)}%`, `GDP ${gdpLabel(state, i)}`, "BPS", y)
    + kpi(`Inflation (Dec) ${y}`, `${fmtNum(Number(DATA.inflation.cpiDec[i]), 2)}%`, `Annual average ${fmtNum(Number(DATA.inflation.avg[i]), 2)}%`, "BPS", y)
    + kpi(`Unemployment ${y}`, `${fmtNum(Number(DATA.unemployment[i]), 2)}%`, `Poverty ${fmtNum(Number(DATA.poverty[i]), 2)}%`, "BPS", y)
    + `</section>`
    + `<section>${sectionHead("GDP growth, 2015–2024", "Annual real GDP growth for Indonesia.")}`
    + lineChart({ labels: YEARS, series: [{ label: "GDP growth (%)", data: DATA.gdp.growth }], height: 260, yFormat: (v) => `${fmtNum(v, 1)}%`, title: "GDP growth 2015–2024" })
    + src("BPS", 2024) + `</section>`
    + `<section>${sectionHead("Largest provinces by population", "The ten most populous provinces in 2024.")}`
    + barChart({ labels: top10.map((p) => p.name), values: top10.map((p) => popMillions(p.population)), height: 300, format: (v) => `${fmtNum(v, 1)}m`, title: "Top 10 provinces by population" })
    + src("BPS", 2024) + `</section>`
    + `<section>${sectionHead("Latest releases", "Headline figures for the selected year.")}`
    + `<ul class="releases">` + releases.map((r) => `<li><span>${esc(r.label)}</span><strong>${esc(r.value)}</strong><small>Source: ${esc(r.source)}, ${y}</small></li>`).join("") + `</ul></section>`
    + `<section>${sectionHead("Browse the data", "Every section below is built from the same dataset.")}`
    + `<div class="quick-grid">`
    + quickLink("#/population", "Population", "Size, growth, age structure and where people live.")
    + quickLink("#/economy", "Economy", "GDP, sectors, prices and trade.")
    + quickLink("#/employment", "Employment", "Jobs, wages, poverty and human development.")
    + quickLink("#/provinces", "Provinces", "Compare all 38 provinces.")
    + quickLink("#/tables", "Tables", "Sortable yearly and provincial tables.")
    + quickLink("#/methodology", "Methodology", "Sources, definitions and update schedule.")
    + `</div></section>`;
}

/* ---------------- Population ---------------- */

export function renderPopulation(state) {
  const i = idx(state);
  const y = yearOf(state);
  const p = DATA.population;
  const age = [
    { name: "Age 0–14", value: Number(pick(p.age014, i)) },
    { name: "Age 15–64", value: Number(pick(p.age1564, i)) },
    { name: "Age 65+", value: Number(pick(p.age65, i)) },
  ];
  return sectionHead("Population", `Indonesia's population in ${y}, how fast it is growing, and its age structure.`)
    + `<section class="controls">${yearSelect(state)}</section>`
    + `<section class="kpi-grid">`
    + kpi(`Total population ${y}`, fmtPop(p.total[i]), `Growth ${fmtNum(Number(p.growth[i]), 2)}% per year`, "BPS", y)
    + kpi("Population growth", `${fmtNum(Number(p.growth[i]), 2)}%`, `Median age ${fmtNum(Number(pick(p.medianAge, i)), 1)} years`, "BPS", y)
    + kpi("Median age", `${fmtNum(Number(pick(p.medianAge, i)), 1)} years`, `Sex ratio ${fmtNum(Number(pick(p.sexRatio, i)), 1)} males per 100 females`, "BPS", y)
    + kpi("Urban share", `${fmtNum(Number(pick(p.urbanShare, i)), 1)}%`, `Density ${fmtNum(Number(pick(p.density, i)), 0)} people per km²`, "BPS", y)
    + `</section>`
    + `<section>${sectionHead("Population, 2015–2024", "Total population in millions.")}`
    + lineChart({ labels: YEARS, series: [{ label: "Population (million)", data: DATA.population.total.map((v) => popMillions(v)) }], height: 280, yFormat: (v) => `${fmtNum(v, 0)}m`, title: "Population 2015–2024" })
    + src("BPS", 2024) + `</section>`
    + `<section class="two-col"><div>${sectionHead("Age structure", "Share of the population by broad age group.")}`
    + donutChart({ parts: age, size: 260, centerLabel: "Working age", centerValue: `${fmtNum(age[1].value, 1)}%` })
    + src("BPS", y) + `</div><div>${sectionHead("At a glance", "The demographic picture behind the headline total.")}`
    + `<dl class="facts">`
    + `<dt>Life expectancy</dt><dd>${fmtNum(Number(DATA.lifeExpectancy[i]), 1)} years</dd>`
    + `<dt>Sex ratio</dt><dd>${fmtNum(Number(pick(p.sexRatio, i)), 1)} males per 100 females</dd>`
    + `<dt>Urban share</dt><dd>${fmtNum(Number(pick(p.urbanShare, i)), 1)}%</dd>`
    + `<dt>Density</dt><dd>${fmtNum(Number(pick(p.density, i)), 0)} people per km²</dd>`
    + `<dt>Median age</dt><dd>${fmtNum(Number(pick(p.medianAge, i)), 1)} years</dd></dl>`
    + src("BPS", y) + `</div></section>`
    + `<section>${sectionHead("Growth over time", "Annual population growth has eased gradually across the decade.")}`
    + lineChart({ labels: YEARS, series: [{ label: "Growth (%)", data: DATA.population.growth }], height: 220, yFormat: (v) => `${fmtNum(v, 2)}%`, title: "Population growth 2015–2024" })
    + src("BPS", 2024) + `</section>`;
}

/* ---------------- Economy ---------------- */

export function renderEconomy(state) {
  const i = idx(state);
  const y = yearOf(state);
  const kind = state?.chartKind === "bar" ? "bar" : "line";
  const gdpChart = kind === "bar"
    ? barChart({ labels: YEARS, values: DATA.gdp.growth, height: 260, format: (v) => `${fmtNum(v, 1)}%`, title: "GDP growth 2015–2024" })
    : lineChart({ labels: YEARS, series: [{ label: "GDP growth (%)", data: DATA.gdp.growth }], height: 260, yFormat: (v) => `${fmtNum(v, 1)}%`, title: "GDP growth 2015–2024" });
  return sectionHead("Economy", `GDP, prices and trade for ${y}. Figures convert between rupiah and US dollars at ${fmtNum(USD_RATE, 0)} Rp per US$.`)
    + `<section class="controls">${yearSelect(state)}`
    + `<button type="button" class="btn btn-small" data-action="toggle-units">Currency: ${unitsLabel(state)} (switch to ${state?.units === "usd" ? "Rp" : "US$"})</button>`
    + `<span class="toggle-group" role="group" aria-label="GDP chart type">`
    + `<button type="button" class="btn btn-small${kind === "line" ? " active" : ""}" data-action="chart-toggle" data-chart="gdp" data-kind="line">Line</button>`
    + `<button type="button" class="btn btn-small${kind === "bar" ? " active" : ""}" data-action="chart-toggle" data-chart="gdp" data-kind="bar">Bar</button></span></section>`
    + `<section class="kpi-grid">`
    + kpi(`GDP ${y}`, gdpLabel(state, i), `Growth ${fmtNum(Number(DATA.gdp.growth[i]), 2)}%`, "BPS", y)
    + kpi("GDP per capita", `${fmtNum(Number(DATA.gdp.perCapitaUsd[i]), 0)} US$`, `GDP growth ${fmtNum(Number(DATA.gdp.growth[i]), 2)}%`, "BPS / World Bank", y)
    + kpi(`Inflation (Dec) ${y}`, `${fmtNum(Number(DATA.inflation.cpiDec[i]), 2)}%`, `Annual average ${fmtNum(Number(DATA.inflation.avg[i]), 2)}%`, "BPS", y)
    + kpi(`Trade balance ${y}`, (() => {
      const diffBnUsd = Number(DATA.trade.exports[i]) - Number(DATA.trade.imports[i]);
      // Trade series are already in billion US$; Rp mode converts at 15.85 trillion Rp per bn US$.
      return state?.units === "usd" ? `${fmtNum(diffBnUsd, 1)} bn US$` : `${fmtNum(diffBnUsd * (USD_RATE / 1000), 0)} trillion Rp`;
    })(),
      `Exports ${fmtNum(Number(DATA.trade.exports[i]), 1)} bn US$ · Imports ${fmtNum(Number(DATA.trade.imports[i]), 1)} bn US$`, "BPS / Bank Indonesia", y)
    + `</section>`
    + `<section>${sectionHead("GDP growth, 2015–2024", "Annual real GDP growth. Use the Line / Bar buttons above to switch the chart type.")}`
    + gdpChart + src("BPS", 2024) + `</section>`
    + `<section class="two-col"><div>${sectionHead("GDP by sector", `Shares of GDP in ${y}.`)}`
    + donutChart({ parts: DATA.gdp.bySector.map((s) => ({ name: s.name, value: Number(s.share) })), size: 280, centerLabel: "Largest sector", centerValue: esc(DATA.gdp.bySector.reduce((a, b) => Number(b.share) > Number(a.share) ? b : a).name) })
    + src("BPS", y) + `</div><div>${sectionHead("GDP by expenditure", `Shares of GDP in ${y}. Imports (21.0% of GDP) are subtracted in the national accounts, so the ring shows the positive components only.`)}`
    + donutChart({ parts: DATA.gdp.byExpenditure.filter((s) => Number(s.share) > 0).map((s) => ({ name: s.name, value: Number(s.share) })), size: 280, centerLabel: "Largest share", centerValue: esc(DATA.gdp.byExpenditure.reduce((a, b) => Number(b.share) > Number(a.share) ? b : a).name) })
    + src("BPS", y) + `</div></section>`
    + `<section>${sectionHead("Exports and imports, 2015–2024", "Values in billion US dollars.")}`
    + lineChart({ labels: YEARS, series: [{ label: "Exports (bn US$)", data: DATA.trade.exports }, { label: "Imports (bn US$)", data: DATA.trade.imports }], height: 280, yFormat: (v) => `$${fmtNum(v, 0)}bn`, title: "Trade 2015–2024" })
    + src("BPS / Bank Indonesia", 2024) + `</section>`
    + `<section class="two-col"><div>${sectionHead("Top exports, 2024", "Largest export products by value.")}`
    + `<table class="data-table"><thead><tr><th>Product</th><th>Value (bn US$)</th></tr></thead><tbody>`
    + DATA.trade.topExports2024.map((t) => `<tr><td>${esc(t.name)}</td><td>${fmtNum(Number(t.value), 2)}</td></tr>`).join("")
    + `</tbody></table>` + src("BPS", 2024) + `</div><div>${sectionHead("Top trading partners, 2024", "Largest partners by total trade value.")}`
    + `<table class="data-table"><thead><tr><th>Partner</th><th>Value (bn US$)</th></tr></thead><tbody>`
    + DATA.trade.topPartners2024.map((t) => `<tr><td>${esc(t.name)}</td><td>${fmtNum(Number(t.value), 2)}</td></tr>`).join("")
    + `</tbody></table>` + src("BPS", 2024) + `</div></section>`;
}

/* ---------------- Employment ---------------- */

export function renderEmployment(state) {
  const i = idx(state);
  const y = yearOf(state);
  const L = DATA.labour;
  return sectionHead("Employment", `Jobs, wages and poverty in ${y}.`)
    + `<section class="kpi-grid">`
    + kpi("Labour force", `${fmtNum(Number(pick(L.force, i)), 1)} million`, `Participation rate ${fmtNum(Number(pick(L.lfpr, i)), 1)}%`, "BPS", y)
    + kpi("Employed", `${fmtNum(Number(pick(L.employed, i)), 1)} million`, `Unemployed ${fmtNum(Number(pick(L.unemployed, i)), 1)} million`, "BPS", y)
    + kpi(`Unemployment ${y}`, `${fmtNum(Number(DATA.unemployment[i]), 2)}%`, `Informal share ${fmtNum(Number(pick(L.informalShare, i)), 1)}% of workers`, "BPS", y)
    + kpi("Average monthly wage", `${fmtNum(Number(pick(L.avgWageRp, i)), 0)} Rp`, `Poverty rate ${fmtNum(Number(DATA.poverty[i]), 2)}%`, "BPS", y)
    + `</section>`
    + `<section>${sectionHead("Unemployment rate, 2015–2024", "Open unemployment as a share of the labour force.")}`
    + lineChart({ labels: YEARS, series: [{ label: "Unemployment (%)", data: DATA.unemployment }], height: 260, yFormat: (v) => `${fmtNum(v, 1)}%`, title: "Unemployment 2015–2024" })
    + src("BPS", 2024) + `</section>`
    + `<section class="two-col"><div>${sectionHead("Employment by sector", `Where employed people work in ${y}.`)}`
    + donutChart({ parts: L.bySector.map((s) => ({ name: s.name, value: Number(s.share) })), size: 280, centerLabel: "Largest sector", centerValue: esc(L.bySector.reduce((a, b) => Number(b.share) > Number(a.share) ? b : a).name) })
    + src("BPS", y) + `</div><div>${sectionHead("Poverty and human development", "Poverty has fallen across the decade while HDI has risen.")}`
    + `<dl class="facts"><dt>Poverty rate ${y}</dt><dd>${fmtNum(Number(DATA.poverty[i]), 2)}%</dd>`
    + `<dt>Human Development Index ${y}</dt><dd>${fmtNum(Number(DATA.hdi[i]), 2)}</dd>`
    + `<dt>Life expectancy ${y}</dt><dd>${fmtNum(Number(DATA.lifeExpectancy[i]), 1)} years</dd>`
    + `<dt>Labour force participation</dt><dd>${fmtNum(Number(pick(L.lfpr, i)), 1)}%</dd>`
    + `<dt>Informal employment</dt><dd>${fmtNum(Number(pick(L.informalShare, i)), 1)}% of workers</dd></dl>`
    + src("BPS", y) + `</div></section>`
    + `<section>${sectionHead("Poverty rate, 2015–2024", "Share of the population below the poverty line.")}`
    + lineChart({ labels: YEARS, series: [{ label: "Poverty (%)", data: DATA.poverty }], height: 260, yFormat: (v) => `${fmtNum(v, 1)}%`, title: "Poverty 2015–2024" })
    + src("BPS", 2024) + `</section>`;
}

/* ---------------- Provinces ---------------- */

export function renderProvinces(state) {
  const sel = DATA.provinces.find((p) => p.name === state?.province) || topProvinces(1)[0];
  const opts = DATA.provinces.map((p) => `<option value="${esc(p.name)}"${p.name === sel.name ? " selected" : ""}>${esc(p.name)}</option>`).join("");
  const top10 = topProvinces(10);
  return sectionHead("Provinces", "All 38 provinces: compare population, area, density, HDI, poverty and unemployment.")
    + `<section class="controls"><label class="province-picker">Province <select id="province-select">${opts}</select></label></section>`
    + `<section class="detail-panel"><h3>${esc(sel.name)}</h3>`
    + `<dl class="facts"><dt>Capital</dt><dd>${esc(sel.capital)}</dd>`
    + `<dt>Population</dt><dd>${fmtPop(sel.population)}</dd>`
    + `<dt>Area</dt><dd>${fmtNum(Number(sel.area), 0)} km²</dd>`
    + `<dt>Density</dt><dd>${fmtNum(densityOf(sel), 0)} people per km²</dd>`
    + `<dt>Human Development Index</dt><dd>${fmtNum(Number(sel.hdi), 2)}</dd>`
    + `<dt>Poverty rate</dt><dd>${fmtNum(Number(sel.poverty), 2)}%</dd>`
    + `<dt>Unemployment rate</dt><dd>${fmtNum(Number(sel.unemployment), 2)}%</dd></dl>`
    + src("BPS", 2024) + `</section>`
    + `<section>${sectionHead("Top 10 provinces by population", "Population in millions.")}`
    + barChart({ labels: top10.map((p) => p.name), values: top10.map((p) => popMillions(p.population)), height: 300, format: (v) => `${fmtNum(v, 1)}m`, title: "Top 10 provinces by population" })
    + src("BPS", 2024) + `</section>`
    + `<section>${sectionHead("All provinces", "Click a column header to sort. Click again to reverse the order.")}`
    + provinceTable(state) + `</section>`;
}

/* ---------------- Tables ---------------- */

export function renderTables(state) {
  const filter = String(state?.tableFilter || "").trim().toLowerCase();
  const rows = YEARS.map((y, j) => ({
    year: y,
    population: popMillions(DATA.population.total[j]),
    gdpGrowth: Number(DATA.gdp.growth[j]),
    inflation: Number(DATA.inflation.cpiDec[j]),
    unemployment: Number(DATA.unemployment[j]),
    poverty: Number(DATA.poverty[j]),
    hdi: Number(DATA.hdi[j]),
  }));
  const sort = state?.tableSort || { key: "population", dir: -1 };
  const val = (r) => (sort.key === "year" ? r.year : Number(r[sort.key]) || 0);
  const sorted = [...rows].sort((a, b) => (val(a) < val(b) ? -1 * (sort.dir || -1) : val(a) > val(b) ? 1 * (sort.dir || -1) : 0));
  const shown = filter ? sorted.filter((r) => String(r.year).includes(filter) || fmtNum(r.population, 1).includes(filter)) : sorted;
  return sectionHead("Tables", "The full yearly series, 2015–2024, and every province — sortable and filterable.")
    + `<section class="controls"><label class="filter-picker">Filter <input id="table-filter" type="search" placeholder="Filter by year, e.g. 2024" value="${esc(state?.tableFilter || "")}"></label></section>`
    + `<section>${sectionHead("Yearly indicators, 2015–2024", "Population in millions; other figures in percent except HDI (index).")}`
    + `<table class="data-table"><thead><tr>`
    + th(state, "year", "Year") + th(state, "population", "Population (m)")
    + th(state, "gdpGrowth", "GDP growth") + th(state, "inflation", "Inflation (Dec)")
    + th(state, "unemployment", "Unemployment") + th(state, "poverty", "Poverty")
    + th(state, "hdi", "HDI")
    + `</tr></thead><tbody>`
    + shown.map((r) => `<tr><td>${r.year}</td><td>${fmtNum(r.population, 1)}</td>`
      + `<td>${fmtNum(r.gdpGrowth, 2)}%</td><td>${fmtNum(r.inflation, 2)}%</td>`
      + `<td>${fmtNum(r.unemployment, 2)}%</td><td>${fmtNum(r.poverty, 2)}%</td>`
      + `<td>${fmtNum(r.hdi, 2)}</td></tr>`).join("")
    + `</tbody></table>` + src("BPS", 2024)
    + (shown.length === 0 ? `<p class="empty">No years match “${esc(state?.tableFilter || "")}”. Clear the filter to see all ten years.</p>` : "")
    + (filter && shown.length > 0 ? `<p class="src">Showing ${shown.length} of ${rows.length} years matching “${esc(state?.tableFilter || "")}”.</p>` : "")
    + `</section>`
    + `<section>${sectionHead("Provinces, 2024", "Click a column header to sort. Density is computed as population divided by area.")}`
    + provinceTable(state) + `</section>`;
}

/* ---------------- Methodology ---------------- */

export function renderMethodology(state) {
  void state;
  const defs = [
    ["Population", "Total resident population at mid-year, from BPS population projections and census counts."],
    ["GDP growth", "Annual change in real gross domestic product at constant prices, in percent."],
    ["GDP per capita", "Nominal GDP divided by mid-year population, in US dollars."],
    ["Inflation", "Year-on-year change in the Consumer Price Index; the December figure is the calendar-year rate."],
    ["Unemployment rate", "Open unemployment as a share of the labour force (Sakernas)."],
    ["Poverty rate", "Share of the population below the BPS poverty line."],
    ["Human Development Index", "Composite index (0–100) of health, education and living standards."],
    ["Labour force participation", "Labour force as a share of the working-age population."],
    ["Informal employment", "Share of employed workers in informal jobs, without formal contracts or social protection."],
  ];
  return sectionHead("Methodology", "How the figures on this site are compiled, defined and updated.")
    + `<section><h3>Our sources</h3><ul class="sources">`
    + DATA.meta.sources.map((s) => `<li>${esc(s)}</li>`).join("")
    + `</ul><p>All figures on this site are compiled from public releases by BPS (Statistics Indonesia), Bank Indonesia and the World Bank. Where releases disagree, the BPS figure is used and the difference is noted on the relevant page.</p>`
    + src("BPS / Bank Indonesia / World Bank", 2024) + `</section>`
    + `<section><h3>Definitions</h3><dl class="facts">`
    + defs.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join("")
    + `</dl></section>`
    + `<section><h3>Rounding and estimates</h3><ul>`
    + `<li>Figures are shown rounded to one or two decimals; underlying values are kept at full precision, so displayed components may not sum exactly to displayed totals.</li>`
    + `<li>Population figures between censuses are BPS projections; the latest census year anchors the series.</li>`
    + `<li>Provincial density is computed as population divided by land area, not published directly by BPS.</li>`
    + `<li>US-dollar conversions on the Economy page use a fixed illustrative rate of ${fmtNum(USD_RATE, 0)} Rp per US$ and are labelled as converted, not as official figures.</li>`
    + `<li>Trade values are in billion US dollars as published; top export and partner tables cover 2024 only.</li></ul></section>`
    + `<section><h3>Update schedule</h3><ul>`
    + `<li>Headline GDP, inflation and trade figures are updated when BPS publishes each monthly or quarterly release.</li>`
    + `<li>Labour, poverty and HDI figures are updated with each Sakernas round and annual BPS release.</li>`
    + `<li>Provincial figures are updated once a year, after the annual provincial publication round.</li>`
    + `<li>This page was last updated ${esc(DATA.meta.updated)}.</li></ul></section>`
    + `<section><h3>A note on accuracy</h3><p>Figures are compiled from public BPS, Bank Indonesia and World Bank releases. They are reproduced as published; this site adds no new estimates beyond the labelled conversions and computed densities above. If you spot a figure that does not match the source release, please treat the source release as authoritative.</p></section>`;
}

/* ---------------- Search ---------------- */

export function renderSearchResults(state) {
  const q = String(state?.query || "").trim();
  const ql = q.toLowerCase();
  const al = DATA.searchAliases || {};
  const terms = new Set([ql]);
  if (al[ql]) terms.add(al[ql]);
  ql.split(/\s+/).forEach((w) => { if (al[w]) terms.add(al[w]); });
  const matches = ql
    ? DATA.indicators.filter((d) => {
        const hay = `${d.name} ${d.id || ""}`.toLowerCase();
        return [...terms].some((t) => t && hay.includes(t));
      })
    : [];
  const cards = matches.map((d) => `<article class="result-card"><h3>${esc(d.name)}</h3>`
    + `<p class="result-value">${esc(String(d.value))} ${esc(d.unit || "")}</p>`
    + `<p class="result-meta">${esc(String(d.year))} · Source: ${esc(d.source || "BPS")}</p>`
    + `<a class="btn btn-small" href="${esc(d.route || "#/")}">${esc("View in context →")}</a></article>`).join("");
  return sectionHead(`Search results${q ? ` for “${q}”` : ""}`, q ? `${matches.length} matching indicator${matches.length === 1 ? "" : "s"} found.` : "Type a term in the search box above to find an indicator.")
    + (q && matches.length === 0
      ? `<p class="empty">No indicators match “${esc(q)}”. Try “GDP”, “population”, “poverty”, “inflation” or “unemployment”.</p>`
      : "")
    + (matches.length ? `<div class="result-grid">${cards}</div>` : "")
    + (!q ? `<section><h3>Browse all indicators</h3><div class="result-grid">`
      + DATA.indicators.map((d) => `<article class="result-card"><h3>${esc(d.name)}</h3>`
        + `<p class="result-value">${esc(String(d.value))} ${esc(d.unit || "")}</p>`
        + `<p class="result-meta">${esc(String(d.year))} · Source: ${esc(d.source || "BPS")}</p>`
        + `<a class="btn btn-small" href="${esc(d.route || "#/")}">${esc("View in context →")}</a></article>`).join("")
      + `</div></section>` : "")
    + src("BPS / Bank Indonesia / World Bank", 2024);
}
