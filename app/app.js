import { DATA } from "./data.js";
import * as views from "./views.js";

const app = document.getElementById("app");
const searchInput = document.getElementById("site-search");

const state = {
  year: 2024,
  units: "rp",
  province: "Jawa Barat",
  query: "",
  tableSort: { key: "population", dir: -1 },
  tableFilter: "",
  chartKind: "line",
};

const ROUTES = {
  "": { title: "Dashboard", render: views.renderDashboard },
  "/": { title: "Dashboard", render: views.renderDashboard },
  "/population": { title: "Population", render: views.renderPopulation },
  "/economy": { title: "Economy", render: views.renderEconomy },
  "/employment": { title: "Employment", render: views.renderEmployment },
  "/provinces": { title: "Provinces", render: views.renderProvinces },
  "/tables": { title: "Tables", render: views.renderTables },
  "/methodology": { title: "Methodology", render: views.renderMethodology },
  "/search": { title: "Search results", render: views.renderSearchResults },
};

const TITLES = {
  "": "Dashboard",
  "/": "Dashboard",
  "/population": "Population",
  "/economy": "Economy",
  "/employment": "Employment",
  "/provinces": "Provinces",
  "/tables": "Tables",
  "/methodology": "Methodology",
  "/search": "Search results",
};

function parseHash() {
  const raw = window.location.hash || "#/";
  const hash = raw.startsWith("#") ? raw.slice(1) : raw;
  const [pathPart, queryPart] = hash.split("?");
  const path = pathPart || "/";
  const params = new URLSearchParams(queryPart || "");
  return { path, q: params.get("q") || "" };
}

function routeKey(path) {
  return Object.prototype.hasOwnProperty.call(ROUTES, path) ? path : "/";
}

let lastRouteKey = null;

function render() {
  const { path, q } = parseHash();
  const key = routeKey(path);
  const routeChanged = key !== lastRouteKey;
  lastRouteKey = key;
  if (key === "/search") state.query = q;
  const view = ROUTES[key];
  app.innerHTML = view.render(state);
  document.title = `${TITLES[key] || "Dashboard"} — ${DATA.meta.portal}`;
  // Nav links are plain <a href="#/..."> with no required marker attribute:
  // match links inside a <nav> (falling back to [data-nav]) so the active
  // state works whatever the shell markup uses, without touching quick links.
  const navLinks = document.querySelectorAll("nav a[href^='#/']");
  const links = navLinks.length ? navLinks : document.querySelectorAll("[data-nav]");
  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const isCurrent = href === `#${key}` || (key === "/" && (href === "#/" || href === "#"));
    a.classList.toggle("active", isCurrent);
    if (isCurrent) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  // Scroll to top only on a route change: same-route re-renders (typing in
  // the table filter, toggling units/chart type) must not yank the scroll.
  if (routeChanged) window.scrollTo(0, 0);
  closeSearchDropdown();
}

function go(path) {
  if (window.location.hash === `#${path}`) render();
  else window.location.hash = `#${path}`;
}

function closeSearchDropdown() {
  document.querySelectorAll(".search-dropdown").forEach((d) => d.remove());
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function searchTerms(q) {
  const t = String(q || "").trim().toLowerCase();
  const out = new Set([t]);
  const al = DATA.searchAliases || {};
  if (al[t]) out.add(al[t]);
  t.split(/\s+/).forEach((w) => { if (al[w]) out.add(al[w]); });
  return [...out];
}

function indicatorMatches(d, terms) {
  const hay = `${d.name} ${d.id || ""}`.toLowerCase();
  return terms.some((t) => t && hay.includes(t));
}

function showSearchDropdown(q) {
  closeSearchDropdown();
  const term = String(q || "").trim().toLowerCase();
  if (!term || !searchInput) return;
  const matches = DATA.indicators
    .filter((d) => indicatorMatches(d, searchTerms(term)))
    .slice(0, 8);
  if (!matches.length) return;
  const box = document.createElement("div");
  box.className = "search-dropdown";
  box.setAttribute("role", "listbox");
  matches.forEach((d) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "search-item";
    item.textContent = `${d.name} — ${d.value} ${d.unit || ""} (${d.year})`;
    item.addEventListener("click", () => {
      searchInput.value = d.name;
      go(`/search?q=${encodeURIComponent(d.name)}`);
    });
    box.appendChild(item);
  });
  const wrap = searchInput.closest(".search-wrap") || searchInput.parentElement;
  wrap.appendChild(box);
}

function doSearch(q) {
  const term = String(q || "").trim();
  if (!term) return;
  closeSearchDropdown();
  go(`/search?q=${encodeURIComponent(term)}`);
}

document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) {
    if (!event.target.closest(".search-wrap")) closeSearchDropdown();
    return;
  }
  const action = el.dataset.action;
  if (action === "set-year") {
    const y = Number(el.dataset.year);
    if (DATA.years.includes(y)) { state.year = y; render(); }
  } else if (action === "toggle-units") {
    state.units = state.units === "rp" ? "usd" : "rp";
    render();
  } else if (action === "toggle-theme") {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  } else if (action === "select-province") {
    const name = el.dataset.province;
    if (DATA.provinces.some((p) => p.name === name)) {
      state.province = name;
      render();
    }
  } else if (action === "sort-table") {
    const key = el.dataset.key;
    if (!key) return;
    if (state.tableSort.key === key) state.tableSort.dir *= -1;
    else state.tableSort = { key, dir: -1 };
    render();
  } else if (action === "chart-toggle") {
    const kind = el.dataset.kind;
    if (kind === "line" || kind === "bar") {
      state.chartKind = kind;
      render();
    }
  }
});

document.addEventListener("change", (event) => {
  const el = event.target;
  if (el.id === "year-select") {
    const y = Number(el.value);
    if (DATA.years.includes(y)) { state.year = y; render(); }
  } else if (el.id === "province-select") {
    const name = el.value;
    if (DATA.provinces.some((p) => p.name === name)) {
      state.province = name;
      render();
    }
  } else if (el.id === "table-filter") {
    state.tableFilter = el.value;
    render();
  }
});

document.addEventListener("input", (event) => {
  const el = event.target;
  if (el.id === "table-filter") {
    state.tableFilter = el.value;
    const { path } = parseHash();
    if (routeKey(path) === "/tables") {
      // Live-filter without losing focus: re-render only the tbody rows.
      render();
      const next = document.getElementById("table-filter");
      if (next) { next.focus(); next.setSelectionRange(next.value.length, next.value.length); }
    }
  }
});

if (searchInput) {
  searchInput.addEventListener("input", () => showSearchDropdown(searchInput.value));
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { event.preventDefault(); doSearch(searchInput.value); }
    if (event.key === "Escape") { closeSearchDropdown(); searchInput.blur(); }
  });
  searchInput.addEventListener("focus", () => showSearchDropdown(searchInput.value));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSearchDropdown();
});

window.addEventListener("hashchange", render);

render();
