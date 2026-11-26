/* ============================================================
   NusaStat — chart helpers (ES module)
   Pure functions returning SVG strings. No external refs,
   no <script>, no network. Imported by the dashboard pages.
   ============================================================ */

const DEFAULT_COLORS = ["#0E4A3F", "#E8A33D", "#2E7FA8", "#B3372F"];
const GRID = "#E3DED2";
const MUTED = "#5A6B66";

/** Escape text for safe inclusion inside SVG markup. */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Format a number with thousands separators.
 * fmtNum(283.5) -> "283.5" · fmtNum(22139) -> "22,139"
 */
export function fmtNum(n, decimals = 1) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "–";
  const fixed = num.toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Drop a trailing ".0" when decimals were only padding an integer.
  if (decimals > 0 && frac && /^0+$/.test(frac)) return grouped;
  return frac ? `${grouped}.${frac}` : grouped;
}

/** "Nice" step for an axis: round a raw step up to 1 / 2 / 5 × 10^k. */
function niceStep(raw) {
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

/** Shared plot geometry: margins, scales, ticks for a cartesian chart.
 *  The scale spans [bottom, top] so series with negative values (e.g. GDP
 *  growth of -2.07% in 2020) still draw inside the plot area. */
function plot({ width, height, maxVal, minVal = 0, ticks = 4 }) {
  const m = { t: 14, r: 12, b: 30, l: 56 };
  const span = (maxVal - minVal) || 1;
  const step = niceStep(span / ticks) || 1;
  const top = Math.ceil(maxVal / step) * step;
  const bottom = Math.floor(minVal / step) * step;
  const x = (i, n) => m.l + (i * (width - m.l - m.r)) / Math.max(n - 1, 1);
  const y = (v) => m.t + (1 - (v - bottom) / (top - bottom)) * (height - m.t - m.b);
  return { m, step, top, bottom, x, y };
}

/**
 * Multi-series line chart.
 * series = [{ name, values: [...], color? }]
 * Returns an SVG string (width 100%, viewBox 0 0 640 H).
 */
export function lineChart({ labels, series, height = 260, yFormat = (v) => String(v), title = "" }) {
  const W = 640;
  const H = height;
  // Accept either { name, values } or { label, data } per series.
  const norm = series.map((s) => ({ name: s.name ?? s.label ?? "", values: s.values ?? s.data ?? [], color: s.color }));
  series = norm;
  const all = series.flatMap((s) => s.values);
  const maxVal = Math.max(...all, 0) || 1;
  const minVal = Math.min(...all, 0);
  const { m, step, top, bottom, x, y } = plot({ width: W, height: H, maxVal, minVal });

  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(title || "Line chart")}">`;
  if (title) out += `<title>${esc(title)}</title>`;

  // Gridlines + y-axis labels (4 ticks).
  // Colours resolve through the page's CSS vars so the charts stay
  // legible in both light and dark themes (var() is invalid in SVG
  // presentation attributes, hence the inline style).
  for (let v = bottom; v <= top + 1e-9; v += step) {
    out += `<line x1="${m.l}" y1="${y(v)}" x2="${W - m.r}" y2="${y(v)}" style="stroke:var(--border,${GRID})" stroke-width="1"/>`;
    out += `<text x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" style="fill:var(--muted,${MUTED})">${esc(yFormat(v))}</text>`;
  }

  // X labels.
  labels.forEach((lab, i) => {
    out += `<text x="${x(i, labels.length)}" y="${H - 8}" text-anchor="middle" font-size="11" style="fill:var(--muted,${MUTED})">${esc(lab)}</text>`;
  });

  // One smooth-ish polyline + dots per series.
  series.forEach((s, si) => {
    const color = s.color || DEFAULT_COLORS[si % DEFAULT_COLORS.length];
    const pts = s.values.map((v, i) => `${x(i, labels.length).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    out += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    s.values.forEach((v, i) => {
      out += `<circle cx="${x(i, labels.length).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.5" fill="${color}" stroke="#fff" stroke-width="1.5"><title>${esc(s.name)} — ${esc(labels[i])}: ${esc(yFormat(v))}</title></circle>`;
    });
  });

  // Legend row at the top, spaced by measured label width so long
  // series names never overlap each other or run off the viewBox.
  let lx = m.l;
  series.forEach((s, si) => {
    const color = s.color || DEFAULT_COLORS[si % DEFAULT_COLORS.length];
    out += `<rect x="${lx}" y="2" width="10" height="10" rx="2" fill="${color}"/>`;
    out += `<text x="${lx + 14}" y="11" font-size="11" style="fill:var(--muted,${MUTED})">${esc(s.name)}</text>`;
    lx += 24 + s.name.length * 6.5 + 12;
  });

  out += `</svg>`;
  return out;
}

/**
 * Vertical bar chart with value labels on top of each bar.
 */
export function barChart({ labels, values, height = 260, format = (v) => String(v), color = "#0E4A3F", title = "" }) {
  const W = 640;
  const H = height;
  const maxVal = Math.max(...values, 0) || 1;
  const minVal = Math.min(...values, 0);
  const { m, step, top, bottom, y } = plot({ width: W, height: H, maxVal, minVal });
  const slot = (W - m.l - m.r) / Math.max(labels.length, 1);
  const barW = Math.min(46, slot * 0.62);
  const rotate = labels.length > 8;

  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(title || "Bar chart")}">`;
  if (title) out += `<title>${esc(title)}</title>`;

  // Gridlines + y-axis labels.
  for (let v = bottom; v <= top + 1e-9; v += step) {
    out += `<line x1="${m.l}" y1="${y(v)}" x2="${W - m.r}" y2="${y(v)}" style="stroke:var(--border,${GRID})" stroke-width="1"/>`;
    out += `<text x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" style="fill:var(--muted,${MUTED})">${esc(format(v))}</text>`;
  }

  // Baseline (the zero line, emphasised when negatives are present).
  out += `<line x1="${m.l}" y1="${y(0)}" x2="${W - m.r}" y2="${y(0)}" style="stroke:var(--muted,${MUTED})" stroke-width="1"/>`;

  values.forEach((v, i) => {
    const cx = m.l + slot * (i + 0.5);
    const barTop = Math.min(y(0), y(v));
    const barH = Math.max(Math.abs(y(0) - y(v)), 0);
    const labelY = v < 0 ? y(v) + 16 : y(v) - 6;
    out += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${barTop.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" rx="3" fill="${v < 0 ? "#B3372F" : color}"><title>${esc(labels[i])}: ${esc(format(v))}</title></rect>`;
    out += `<text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" style="fill:var(--ink,#1B2A28)">${esc(format(v))}</text>`;
    if (rotate) {
      out += `<text x="${cx.toFixed(1)}" y="${H - 6}" text-anchor="end" font-size="11" style="fill:var(--muted,${MUTED})" transform="rotate(-35 ${cx.toFixed(1)} ${H - 6})">${esc(labels[i])}</text>`;
    } else {
      out += `<text x="${cx.toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" style="fill:var(--muted,${MUTED})">${esc(labels[i])}</text>`;
    }
  });

  out += `</svg>`;
  return out;
}

/**
 * Donut chart: stroke segments around a circle, centre text,
 * and a legend list beside it (SVG + legend HTML in one string).
 * parts = [{ label, value, color? }]
 */
export function donutChart({ parts, size = 220, centerLabel = "", centerValue = "" }) {
  // Accept either { label, value } or { name, value } per part.
  parts = parts.map((p) => ({ label: p.label ?? p.name ?? "", value: p.value, color: p.color }));
  // Only positive parts draw a segment; a non-positive part is listed in the
  // legend with its signed value and takes no ring space.
  const total = parts.reduce((a, p) => a + Math.max(p.value, 0), 0) || 1;
  const r = 80;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  const strokeW = 34;

  let segments = "";
  let offset = 0; // fraction of circumference consumed so far
  parts.forEach((p, i) => {
    if (!(p.value > 0)) return;
    const frac = p.value / total;
    const color = p.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
    const dash = Math.max(frac * c - 2, 0.5); // 2-unit gap between segments
    segments += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${strokeW}" stroke-dasharray="${dash.toFixed(1)} ${(c - dash).toFixed(1)}" stroke-dashoffset="${(-offset * c).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"><title>${esc(p.label)}: ${esc(fmtNum(p.value, 1))}</title></circle>`;
    offset += frac;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Donut chart">${segments}`
    + `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="12" style="fill:var(--muted,${MUTED})">${esc(centerLabel)}</text>`
    + `<text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--ink,#1B2A28)">${esc(centerValue)}</text>`
    + `</svg>`;

  const legend = `<ul class="donut-legend">` + parts.map((p, i) => {
    const color = p.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
    const pct = ((p.value / total) * 100).toFixed(1);
    return `<li><span><span class="swatch" style="background:${color}"></span>${esc(p.label)}</span><span class="val">${pct}%</span></li>`;
  }).join("") + `</ul>`;

  return `<div class="donut-flex">${svg}${legend}</div>`;
}
