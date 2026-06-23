// currencies.js
// Static exchange rate table — all internal costs use USD as the base.
// Rates are approximate mid-market rates (June 2025).
//
// ── FREE OPEN-SOURCE UPGRADE PATHS (no cost, no auth for basic tiers) ─────
//  • Frankfurter API  — https://api.frankfurter.app/latest?from=USD
//    Wraps European Central Bank data. No key, CORS-enabled. ~35 currencies.
//    fetch('https://api.frankfurter.app/latest?from=USD')
//      .then(r=>r.json()).then(d=>Object.assign(CURRENCY_RATES, d.rates));
//
//  • Open Exchange Rates — https://openexchangerates.org (free tier, API key)
//    170+ currencies, updated hourly. 1,000 req/month free.
//
//  • ExchangeRate-API — https://www.exchangerate-api.com (free tier, API key)
//    160+ currencies. 1,500 req/month free.
//
//  • Cost-of-living data — https://numbeo.com (web scrape or paid API)
//    City-level prices for meals, accommodation, transport, etc.
//
//  NOTE: any live-rate fetch sends a network request and breaks the
//  "nothing leaves the browser" privacy promise unless the user opts in.
// ──────────────────────────────────────────────────────────────────────────

// 1 USD → X local units
const CURRENCY_RATES = {
  USD: 1.00,  EUR: 0.92,  GBP: 0.79,  JPY: 157,   AUD: 1.54,
  CAD: 1.36,  CHF: 0.90,  NZD: 1.62,  SEK: 10.45, DKK: 6.87,
  NOK: 10.70, HKD: 7.82,  SGD: 1.35,  KRW: 1360,  TWD: 32.0,
  MYR: 4.72,  THB: 35.5,  IDR: 16200, VND: 25400, INR: 83.5,
  PKR: 280,   BRL: 4.95,  MXN: 17.2,  COP: 4100,  ARS: 930,
  PEN: 3.72,  CLP: 945,   UYU: 39.5,  TRY: 32.5,  AED: 3.67,
  ZAR: 18.4,  KES: 129,   NGN: 1580,  EGP: 48.5,  MAD: 10.1,
  CZK: 23.0,
};

// Display metadata per currency
const CURRENCIES = {
  USD: { symbol: '$',    name: 'US Dollar',          decimals: 0 },
  EUR: { symbol: '€',    name: 'Euro',               decimals: 0 },
  GBP: { symbol: '£',    name: 'British Pound',      decimals: 0 },
  JPY: { symbol: '¥',    name: 'Japanese Yen',       decimals: 0 },
  AUD: { symbol: 'A$',   name: 'Australian Dollar',  decimals: 0 },
  CAD: { symbol: 'C$',   name: 'Canadian Dollar',    decimals: 0 },
  CHF: { symbol: 'Fr',   name: 'Swiss Franc',        decimals: 0 },
  NZD: { symbol: 'NZ$',  name: 'NZ Dollar',          decimals: 0 },
  SEK: { symbol: 'kr',   name: 'Swedish Krona',      decimals: 0 },
  DKK: { symbol: 'kr',   name: 'Danish Krone',       decimals: 0 },
  HKD: { symbol: 'HK$',  name: 'HK Dollar',          decimals: 0 },
  SGD: { symbol: 'S$',   name: 'Singapore Dollar',   decimals: 0 },
  KRW: { symbol: '₩',    name: 'South Korean Won',   decimals: 0 },
  TWD: { symbol: 'NT$',  name: 'Taiwan Dollar',      decimals: 0 },
  MYR: { symbol: 'RM',   name: 'Malaysian Ringgit',  decimals: 0 },
  THB: { symbol: '฿',    name: 'Thai Baht',          decimals: 0 },
  IDR: { symbol: 'Rp',   name: 'Indonesian Rupiah',  decimals: 0 },
  VND: { symbol: '₫',    name: 'Vietnamese Dong',    decimals: 0 },
  INR: { symbol: '₹',    name: 'Indian Rupee',       decimals: 0 },
  PKR: { symbol: '₨',    name: 'Pakistani Rupee',    decimals: 0 },
  BRL: { symbol: 'R$',   name: 'Brazilian Real',     decimals: 0 },
  MXN: { symbol: 'MX$',  name: 'Mexican Peso',       decimals: 0 },
  COP: { symbol: 'COP',  name: 'Colombian Peso',     decimals: 0 },
  ARS: { symbol: 'AR$',  name: 'Argentine Peso',     decimals: 0 },
  PEN: { symbol: 'S/',   name: 'Peruvian Sol',       decimals: 0 },
  CLP: { symbol: 'CL$',  name: 'Chilean Peso',       decimals: 0 },
  UYU: { symbol: '$U',   name: 'Uruguayan Peso',     decimals: 0 },
  TRY: { symbol: '₺',    name: 'Turkish Lira',       decimals: 0 },
  AED: { symbol: 'AED',  name: 'UAE Dirham',         decimals: 0 },
  ZAR: { symbol: 'R',    name: 'South African Rand', decimals: 0 },
  KES: { symbol: 'KSh',  name: 'Kenyan Shilling',    decimals: 0 },
  NGN: { symbol: '₦',    name: 'Nigerian Naira',     decimals: 0 },
  EGP: { symbol: 'E£',   name: 'Egyptian Pound',     decimals: 0 },
  MAD: { symbol: 'DH',   name: 'Moroccan Dirham',    decimals: 0 },
  CZK: { symbol: 'Kč',   name: 'Czech Koruna',       decimals: 0 },
};

// Country name → ISO currency code
const COUNTRY_CURRENCY = {
  'USA':            'USD', 'United States': 'USD',
  'UK':             'GBP', 'United Kingdom': 'GBP', 'Ireland': 'EUR',
  'Australia':      'AUD', 'New Zealand': 'NZD',
  'Canada':         'CAD',
  'India':          'INR', 'Pakistan': 'PKR',
  'Brazil':         'BRL',
  'South Korea':    'KRW',
  'Hong Kong':      'HKD',
  'Malaysia':       'MYR',
  'Thailand':       'THB',
  'Indonesia':      'IDR',
  'Vietnam':        'VND',
  'Japan':          'JPY',
  'Singapore':      'SGD',
  'Taiwan':         'TWD',
  'UAE':            'AED',
  'Mexico':         'MXN',
  'Colombia':       'COP',
  'Argentina':      'ARS',
  'Peru':           'PEN',
  'Chile':          'CLP',
  'Uruguay':        'UYU',
  'Turkey':         'TRY',
  'South Africa':   'ZAR',
  'Kenya':          'KES',
  'Nigeria':        'NGN',
  'Egypt':          'EGP',
  'Morocco':        'MAD',
  'Portugal':       'EUR', 'Spain': 'EUR', 'France': 'EUR',
  'Germany':        'EUR', 'Italy': 'EUR', 'Netherlands': 'EUR',
  'Austria':        'EUR', 'Greece': 'EUR',
  'Czechia':        'CZK',
  'Switzerland':    'CHF',
  'Sweden':         'SEK',
  'Denmark':        'DKK',
};

// Helper: convert a USD amount to a given currency
function fromUSD(usdAmount, toCurrencyCode) {
  var rate = CURRENCY_RATES[toCurrencyCode];
  if (!rate || !isFinite(rate)) rate = 1;
  var result = Math.round(usdAmount * rate);
  return isFinite(result) ? result : 0;
}

// Helper: format a USD amount as a string in the target currency
function fmtCurrency(usdAmount, currencyCode) {
  if (!isFinite(usdAmount)) return '—';
  var meta   = CURRENCIES[currencyCode] || CURRENCIES['USD'];
  var amount = fromUSD(usdAmount, currencyCode);
  if (!isFinite(amount)) return '—';
  return meta.symbol + amount.toLocaleString();
}

// Helper: format a USD range as "sym X – sym Y"
function fmtCurrencyRange(usdLow, usdHigh, currencyCode) {
  return fmtCurrency(usdLow, currencyCode) + ' – ' + fmtCurrency(usdHigh, currencyCode);
}

// Derive currency from a country string
function currencyForCountry(country) {
  return COUNTRY_CURRENCY[country] || 'USD';
}
