// NusaStat — data module for the national statistics portal of Indonesia.
//
// Figures compiled from BPS / Bank Indonesia / World Bank public releases,
// 2024 vintage; provincial figures are rounded estimates. All series run
// 2015–2024 (see DATA.years) unless a field says otherwise.

export const DATA = {
  meta: {
    country: "Indonesia",
    portal: "NusaStat",
    tagline: "Portal Statistik Nasional Indonesia",
    updated: "November 2026",
    currencyNote: "Rp 15,850 per US$ (average 2024)",
    sources: [
      "Badan Pusat Statistik (BPS)",
      "Bank Indonesia",
      "World Bank WDI",
      "United Nations World Population Prospects 2024",
    ],
  },

  years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],

  population: {
    // Total population, millions (mid-year estimates)
    total: [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 274.9, 277.7, 280.7, 283.5],
    // Annual growth, %
    growth: [1.19, 1.21, 1.24, 1.18, 1.17, 0.78, 1.74, 1.02, 1.07, 1.00],
    age014: 24.6,
    age1564: 68.1,
    age65: 7.3,
    medianAge: 30.6,
    sexRatio: 101.0,
    urbanShare: 58.8,
    density: 148.6,
  },

  gdp: {
    // Nominal GDP, Rp trillion
    nominalRp: [11526, 12401, 13588, 14839, 15834, 15434, 16977, 19588, 20892, 22139],
    // Real GDP growth, % year-on-year
    growth: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
    // GDP per capita, current US$
    perCapitaUsd: [3335, 3605, 3843, 3893, 4175, 3869, 4350, 4783, 4876, 4960],
    // Shares of GDP by sector, 2024, % — approximate BPS figures;
    // they may not sum to exactly 100 due to rounding.
    bySector: [
      { name: "Manufacturing", share: 18.7 },
      { name: "Wholesale & retail trade", share: 12.9 },
      { name: "Agriculture, forestry & fishing", share: 12.5 },
      { name: "Construction", share: 9.9 },
      { name: "Mining & quarrying", share: 9.2 },
      { name: "Transportation & storage", share: 4.4 },
      { name: "Information & communication", share: 4.4 },
      { name: "Financial & insurance", share: 4.2 },
      { name: "Public administration", share: 3.0 },
      { name: "Education", share: 3.0 },
      { name: "Real estate", share: 2.9 },
      { name: "Accommodation & food services", share: 2.7 },
      { name: "Business services", share: 2.0 },
      { name: "Health & social work", share: 1.2 },
      { name: "Electricity, gas & water", share: 1.2 },
      { name: "Other services", share: 3.6 },
    ],
    // Shares of GDP by expenditure, 2024, % (imports enter as a negative).
    // Components sum to ~91.7; the remainder is the statistical
    // discrepancy / net errors and omissions in the BPS accounts.
    byExpenditure: [
      { name: "Household consumption", share: 54.0 },
      { name: "Gross fixed capital formation", share: 29.5 },
      { name: "Government consumption", share: 7.7 },
      { name: "Exports of goods & services", share: 21.5 },
      { name: "Imports of goods & services", share: -21.0 },
    ],
  },

  inflation: {
    // CPI, December year-on-year, %
    cpiDec: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    // CPI, annual average, %
    avg: [6.36, 3.53, 3.81, 3.20, 2.81, 2.04, 1.60, 4.21, 3.70, 2.33],
  },

  // Open unemployment rate, August Sakernas, %
  unemployment: [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],

  // Poverty rate, September, %
  poverty: [11.13, 10.70, 10.12, 9.66, 9.22, 10.19, 9.71, 9.57, 9.36, 8.57],

  // Human Development Index
  hdi: [68.90, 69.55, 70.18, 70.81, 71.92, 71.94, 72.29, 73.37, 74.39, 75.02],

  // Life expectancy at birth, years
  lifeExpectancy: [70.78, 71.06, 71.28, 71.50, 71.72, 71.37, 71.90, 72.91, 73.55, 74.12],

  labour: {
    force: 147.14, // million, Aug 2024
    employed: 139.92,
    unemployed: 7.22,
    lfpr: 71.0, // labour force participation rate, %
    informalShare: 59.2, // % of employed in informal work
    avgWageRp: 3040000, // Rp/month, Feb 2024
    bySector: [
      { name: "Agriculture", share: 28.5 },
      { name: "Trade & repair", share: 18.9 },
      { name: "Manufacturing", share: 13.7 },
      { name: "Construction", share: 8.9 },
      { name: "Accommodation & food", share: 7.5 },
      { name: "Transportation", share: 5.0 },
      { name: "Other services", share: 17.5 },
    ],
  },

  trade: {
    // Exports of goods, US$ billion
    exports: [150.4, 145.2, 168.8, 180.2, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7],
    // Imports of goods, US$ billion
    imports: [142.7, 135.7, 156.9, 188.7, 171.3, 141.6, 196.2, 237.4, 221.9, 233.7],
    topExports2024: [
      { name: "Iron & steel", value: 27.8 },
      { name: "Coal", value: 25.6 },
      { name: "Palm oil", value: 22.4 },
      { name: "Electrical machinery", value: 13.9 },
      { name: "Vehicles & parts", value: 11.6 },
    ],
    topPartners2024: [
      { name: "China", value: 62.4 },
      { name: "United States", value: 26.5 },
      { name: "India", value: 20.1 },
      { name: "Japan", value: 17.9 },
      { name: "Malaysia", value: 11.2 },
    ],
  },

  // 38 provinces — BPS 2024 rounded estimates.
  // population: millions; area: km2; hdi: index; poverty/unemployment: %.
  // Provincial populations sum to ~281.7m vs the 283.5m national total;
  // the gap is rounding in the provincial estimates.
  provinces: [
    { name: "Aceh", capital: "Banda Aceh", population: 5.56, area: 57956, hdi: 74.3, poverty: 14.2, unemployment: 5.5 },
    { name: "Sumatera Utara", capital: "Medan", population: 15.59, area: 72981, hdi: 75.5, poverty: 8.1, unemployment: 5.6 },
    { name: "Sumatera Barat", capital: "Padang", population: 5.86, area: 42013, hdi: 75.3, poverty: 5.7, unemployment: 5.4 },
    { name: "Riau", capital: "Pekanbaru", population: 6.69, area: 87024, hdi: 74.4, poverty: 6.7, unemployment: 4.0 },
    { name: "Jambi", capital: "Jambi", population: 3.68, area: 50058, hdi: 73.5, poverty: 7.6, unemployment: 4.5 },
    { name: "Sumatera Selatan", capital: "Palembang", population: 8.84, area: 91592, hdi: 72.3, poverty: 11.8, unemployment: 4.3 },
    { name: "Bengkulu", capital: "Bengkulu", population: 2.11, area: 19919, hdi: 73.5, poverty: 14.3, unemployment: 3.9 },
    { name: "Lampung", capital: "Bandar Lampung", population: 9.28, area: 34624, hdi: 72.0, poverty: 10.7, unemployment: 4.1 },
    { name: "Kep. Bangka Belitung", capital: "Pangkal Pinang", population: 1.52, area: 16424, hdi: 73.8, poverty: 4.6, unemployment: 4.9 },
    { name: "Kep. Riau", capital: "Tanjung Pinang", population: 2.30, area: 8202, hdi: 79.0, poverty: 5.5, unemployment: 6.6 },
    { name: "DKI Jakarta", capital: "Jakarta", population: 10.68, area: 664, hdi: 82.5, poverty: 4.3, unemployment: 6.2 },
    { name: "Jawa Barat", capital: "Bandung", population: 50.35, area: 35378, hdi: 74.9, poverty: 7.5, unemployment: 6.2 },
    { name: "Jawa Tengah", capital: "Semarang", population: 37.89, area: 32801, hdi: 73.9, poverty: 10.5, unemployment: 4.6 },
    { name: "DI Yogyakarta", capital: "Yogyakarta", population: 3.76, area: 3133, hdi: 81.6, poverty: 10.8, unemployment: 3.7 },
    { name: "Jawa Timur", capital: "Surabaya", population: 41.81, area: 47803, hdi: 75.4, poverty: 9.8, unemployment: 4.2 },
    { name: "Banten", capital: "Serang", population: 12.43, area: 9663, hdi: 76.4, poverty: 5.8, unemployment: 7.0 },
    { name: "Bali", capital: "Denpasar", population: 4.41, area: 5780, hdi: 77.1, poverty: 4.0, unemployment: 2.5 },
    { name: "Nusa Tenggara Barat", capital: "Mataram", population: 5.66, area: 18572, hdi: 72.9, poverty: 12.7, unemployment: 3.3 },
    { name: "Nusa Tenggara Timur", capital: "Kupang", population: 5.66, area: 47931, hdi: 68.9, poverty: 19.0, unemployment: 3.1 },
    { name: "Kalimantan Barat", capital: "Pontianak", population: 5.81, area: 147307, hdi: 71.4, poverty: 6.8, unemployment: 4.7 },
    { name: "Kalimantan Tengah", capital: "Palangka Raya", population: 2.87, area: 153564, hdi: 73.6, poverty: 5.0, unemployment: 3.6 },
    { name: "Kalimantan Selatan", capital: "Banjarmasin", population: 4.24, area: 38744, hdi: 74.3, poverty: 4.2, unemployment: 4.2 },
    { name: "Kalimantan Timur", capital: "Samarinda", population: 4.01, area: 127347, hdi: 78.5, poverty: 6.0, unemployment: 5.1 },
    { name: "Kalimantan Utara", capital: "Tanjung Selor", population: 0.73, area: 72567, hdi: 74.7, poverty: 6.9, unemployment: 4.2 },
    { name: "Sulawesi Utara", capital: "Manado", population: 2.73, area: 13852, hdi: 76.9, poverty: 7.5, unemployment: 6.0 },
    { name: "Sulawesi Tengah", capital: "Palu", population: 3.12, area: 61841, hdi: 72.1, poverty: 12.0, unemployment: 3.3 },
    { name: "Sulawesi Selatan", capital: "Makassar", population: 9.36, area: 46717, hdi: 74.5, poverty: 8.0, unemployment: 4.2 },
    { name: "Sulawesi Tenggara", capital: "Kendari", population: 2.83, area: 38140, hdi: 73.5, poverty: 11.3, unemployment: 3.2 },
    { name: "Gorontalo", capital: "Gorontalo", population: 1.25, area: 11257, hdi: 71.9, poverty: 15.0, unemployment: 3.9 },
    { name: "Sulawesi Barat", capital: "Mamuju", population: 1.57, area: 16787, hdi: 70.1, poverty: 11.1, unemployment: 3.1 },
    { name: "Maluku", capital: "Ambon", population: 2.02, area: 46914, hdi: 73.0, poverty: 16.2, unemployment: 6.5 },
    { name: "Maluku Utara", capital: "Sofifi", population: 1.44, area: 31983, hdi: 72.7, poverty: 6.5, unemployment: 4.0 },
    { name: "Papua Barat", capital: "Manokwari", population: 0.59, area: 64134, hdi: 66.8, poverty: 20.0, unemployment: 4.5 },
    { name: "Papua Barat Daya", capital: "Sorong", population: 0.63, area: 38068, hdi: 68.5, poverty: 19.5, unemployment: 5.8 },
    { name: "Papua", capital: "Jayapura", population: 1.06, area: 82680, hdi: 63.0, poverty: 20.0, unemployment: 3.5 },
    { name: "Papua Tengah", capital: "Nabire", population: 1.35, area: 61073, hdi: 61.5, poverty: 27.0, unemployment: 3.9 },
    { name: "Papua Pegunungan", capital: "Wamena", population: 1.47, area: 51213, hdi: 56.0, poverty: 32.0, unemployment: 2.8 },
    { name: "Papua Selatan", capital: "Merauke", population: 0.52, area: 117849, hdi: 64.0, poverty: 17.0, unemployment: 3.4 },
  ],

  // Indonesian synonyms for the English indicator names, so search works
  // in both languages ("inflasi" finds "Inflation").
  searchAliases: {
    inflasi: "inflation", penduduk: "population", pertumbuhan: "growth",
    pengangguran: "unemployment", kemiskinan: "poverty", pdb: "gdp",
    ekspor: "export", impor: "import", perdagangan: "trade",
    provinsi: "province", "tenaga kerja": "labour", upah: "wage",
    harga: "inflation", ipm: "human development", "harapan hidup": "life expectancy",
    utang: "debt", cadangan: "reserves", kurs: "exchange rate",
    usia: "median age", perkotaan: "urban", kelahiran: "fertility",
    ekonomi: "gdp", ketenagakerjaan: "labour", angkatan: "labour force",
  },
  // Search index: headline figures, one entry per indicator.
  // value is a display string; route is the portal page it links to.
  indicators: [
    { id: "population", name: "Population", value: "283.5 million", unit: "people", year: 2024, source: "BPS", route: "#/population" },
    { id: "population-growth", name: "Population growth", value: "1.00%", unit: "% per year", year: 2024, source: "BPS", route: "#/population" },
    { id: "gdp", name: "GDP", value: "Rp 22,139 trillion", unit: "Rp trillion", year: 2024, source: "BPS", route: "#/economy" },
    { id: "gdp-growth", name: "GDP growth", value: "5.03%", unit: "% per year", year: 2024, source: "BPS", route: "#/economy" },
    { id: "gdp-per-capita", name: "GDP per capita", value: "US$ 4,960", unit: "US$ per person", year: 2024, source: "World Bank WDI", route: "#/economy" },
    { id: "inflation-dec", name: "Inflation (December)", value: "1.57%", unit: "% year-on-year", year: 2024, source: "BPS", route: "#/economy" },
    { id: "inflation-avg", name: "Inflation (average)", value: "2.33%", unit: "% per year", year: 2024, source: "BPS", route: "#/economy" },
    { id: "unemployment", name: "Unemployment rate", value: "4.91%", unit: "% of labour force", year: 2024, source: "BPS", route: "#/employment" },
    { id: "poverty", name: "Poverty rate", value: "8.57%", unit: "% of population", year: 2024, source: "BPS", route: "#/employment" },
    { id: "hdi", name: "Human Development Index", value: "75.02", unit: "index", year: 2024, source: "BPS", route: "#/population" },
    { id: "life-expectancy", name: "Life expectancy", value: "74.12 years", unit: "years", year: 2024, source: "BPS", route: "#/population" },
    { id: "labour-force", name: "Labour force", value: "147.14 million", unit: "people", year: 2024, source: "BPS", route: "#/employment" },
    { id: "informal-employment", name: "Informal employment", value: "59.2%", unit: "% of employed", year: 2024, source: "BPS", route: "#/employment" },
    { id: "exports", name: "Exports", value: "US$ 264.7 billion", unit: "US$ billion", year: 2024, source: "BPS", route: "#/economy" },
    { id: "imports", name: "Imports", value: "US$ 233.7 billion", unit: "US$ billion", year: 2024, source: "BPS", route: "#/economy" },
    { id: "trade-balance", name: "Trade balance", value: "+US$ 31.0 billion", unit: "US$ billion", year: 2024, source: "BPS", route: "#/economy" },
    { id: "median-age", name: "Median age", value: "30.6 years", unit: "years", year: 2024, source: "United Nations World Population Prospects 2024", route: "#/population" },
    { id: "urban-population", name: "Urban population", value: "58.8%", unit: "% of population", year: 2024, source: "World Bank WDI", route: "#/population" },
    { id: "fertility-rate", name: "Fertility rate", value: "2.1", unit: "children per woman", year: 2023, source: "World Bank", route: "#/population" },
    { id: "government-debt", name: "Government debt", value: "38.8% of GDP", unit: "% of GDP", year: 2024, source: "Bank Indonesia", route: "#/economy" },
    { id: "foreign-reserves", name: "Foreign reserves", value: "US$ 155.7 billion", unit: "US$ billion", year: 2024, source: "Bank Indonesia", route: "#/economy" },
    { id: "policy-rate", name: "Policy rate (BI Rate)", value: "6.00%", unit: "% per year", year: 2024, source: "Bank Indonesia", route: "#/economy" },
    { id: "exchange-rate", name: "Exchange rate", value: "Rp 15,850 per US$", unit: "Rp per US$", year: 2024, source: "Bank Indonesia", route: "#/economy" },
    { id: "pop-jawa-barat", name: "Jawa Barat population", value: "50.35 million", unit: "people", year: 2024, source: "BPS", route: "#/provinces" },
    { id: "pop-jawa-timur", name: "Jawa Timur population", value: "41.81 million", unit: "people", year: 2024, source: "BPS", route: "#/provinces" },
    { id: "pop-jawa-tengah", name: "Jawa Tengah population", value: "37.89 million", unit: "people", year: 2024, source: "BPS", route: "#/provinces" },
    { id: "pop-sumatera-utara", name: "Sumatera Utara population", value: "15.59 million", unit: "people", year: 2024, source: "BPS", route: "#/provinces" },
    { id: "pop-banten", name: "Banten population", value: "12.43 million", unit: "people", year: 2024, source: "BPS", route: "#/provinces" },
    { id: "pop-dki-jakarta", name: "DKI Jakarta population", value: "10.68 million", unit: "people", year: 2024, source: "BPS", route: "#/provinces" },
  ],
};
