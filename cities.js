// cities.js
// Built-in list of destinations used by the Travel Budget Finder.
//
// All daily costs are in USD at a MID-RANGE neutral baseline.
// The app multiplies them by the tier the user picks:
//   budget × 0.8  |  mid × 1.2  |  lavish × 1.8
//
// ── Cost categories (what's included) ──────────────────────────────────────
//   daily_meals         3 meals/day at sit-down restaurants (neutral baseline)
//   daily_accommodation hotel / hostel / Airbnb per night
//   daily_activities    museums, tours, entrance fees, experiences per day
//   daily_shopping      souvenirs, markets, alcohol, drinks, incidentals
//
// ── Other fields ───────────────────────────────────────────────────────────
//   lat / lon           used for flight-distance math (haversine formula)
//   popularity_score    0–100; higher = shown earlier when costs are tied
//
// HOW TO ADD A CITY: copy any block, update values, save the file.

const CITIES = [

  // ── EUROPE ──────────────────────────────────────────────────────────────
  {
    city: "Lisbon",      country: "Portugal",     airport: "LIS",
    lat: 38.77,  lon:  -9.13,
    daily_meals: 42, daily_accommodation:  80, daily_activities: 15, daily_shopping: 10,
    popularity_score: 85
  },
  {
    city: "Porto",       country: "Portugal",     airport: "OPO",
    lat: 41.24,  lon:  -8.68,
    daily_meals: 36, daily_accommodation:  65, daily_activities: 12, daily_shopping:  8,
    popularity_score: 78
  },
  {
    city: "Barcelona",   country: "Spain",        airport: "BCN",
    lat: 41.30,  lon:   2.08,
    daily_meals: 48, daily_accommodation:  95, daily_activities: 18, daily_shopping: 12,
    popularity_score: 90
  },
  {
    city: "Madrid",      country: "Spain",        airport: "MAD",
    lat: 40.47,  lon:  -3.56,
    daily_meals: 46, daily_accommodation:  90, daily_activities: 15, daily_shopping: 10,
    popularity_score: 84
  },
  {
    city: "Rome",        country: "Italy",        airport: "FCO",
    lat: 41.80,  lon:  12.24,
    daily_meals: 50, daily_accommodation: 100, daily_activities: 22, daily_shopping: 10,
    popularity_score: 92
  },
  {
    city: "Paris",       country: "France",       airport: "CDG",
    lat: 49.01,  lon:   2.55,
    daily_meals: 62, daily_accommodation: 130, daily_activities: 25, daily_shopping: 12,
    popularity_score: 95
  },
  {
    city: "Amsterdam",   country: "Netherlands",  airport: "AMS",
    lat: 52.31,  lon:   4.76,
    daily_meals: 52, daily_accommodation: 120, daily_activities: 20, daily_shopping: 10,
    popularity_score: 88
  },
  {
    city: "Berlin",      country: "Germany",      airport: "BER",
    lat: 52.36,  lon:  13.50,
    daily_meals: 46, daily_accommodation:  90, daily_activities: 15, daily_shopping: 10,
    popularity_score: 86
  },
  {
    city: "Prague",      country: "Czechia",      airport: "PRG",
    lat: 50.10,  lon:  14.26,
    daily_meals: 36, daily_accommodation:  70, daily_activities: 12, daily_shopping:  8,
    popularity_score: 83
  },
  {
    city: "Vienna",      country: "Austria",      airport: "VIE",
    lat: 48.11,  lon:  16.57,
    daily_meals: 48, daily_accommodation:  95, daily_activities: 18, daily_shopping: 10,
    popularity_score: 80
  },
  {
    city: "Athens",      country: "Greece",       airport: "ATH",
    lat: 37.94,  lon:  23.94,
    daily_meals: 38, daily_accommodation:  70, daily_activities: 15, daily_shopping:  8,
    popularity_score: 82
  },
  {
    city: "Istanbul",    country: "Turkey",       airport: "IST",
    lat: 41.26,  lon:  28.74,
    daily_meals: 32, daily_accommodation:  55, daily_activities: 12, daily_shopping:  8,
    popularity_score: 87
  },

  // ── ASIA ────────────────────────────────────────────────────────────────
  {
    city: "Bangkok",     country: "Thailand",     airport: "BKK",
    lat:  13.69, lon: 100.75,
    daily_meals: 26, daily_accommodation:  35, daily_activities: 10, daily_shopping: 10,
    popularity_score: 90
  },
  {
    city: "Chiang Mai",  country: "Thailand",     airport: "CNX",
    lat:  18.77, lon:  98.96,
    daily_meals: 20, daily_accommodation:  28, daily_activities:  8, daily_shopping:  8,
    popularity_score: 76
  },
  {
    city: "Bali",        country: "Indonesia",    airport: "DPS",
    lat:  -8.75, lon: 115.17,
    daily_meals: 22, daily_accommodation:  40, daily_activities: 12, daily_shopping: 10,
    popularity_score: 89
  },
  {
    city: "Tokyo",       country: "Japan",        airport: "HND",
    lat:  35.55, lon: 139.78,
    daily_meals: 45, daily_accommodation:  85, daily_activities: 22, daily_shopping: 15,
    popularity_score: 95
  },
  {
    city: "Kyoto",       country: "Japan",        airport: "KIX",
    lat:  34.99, lon: 135.76,
    daily_meals: 42, daily_accommodation:  80, daily_activities: 18, daily_shopping: 12,
    popularity_score: 88
  },
  {
    city: "Singapore",   country: "Singapore",    airport: "SIN",
    lat:   1.36, lon: 103.99,
    daily_meals: 38, daily_accommodation: 110, daily_activities: 18, daily_shopping: 12,
    popularity_score: 84
  },
  {
    city: "Ho Chi Minh City", country: "Vietnam", airport: "SGN",
    lat:  10.82, lon: 106.65,
    daily_meals: 18, daily_accommodation:  30, daily_activities:  8, daily_shopping: 10,
    popularity_score: 78
  },
  {
    city: "Hanoi",       country: "Vietnam",      airport: "HAN",
    lat:  21.22, lon: 105.81,
    daily_meals: 16, daily_accommodation:  28, daily_activities:  8, daily_shopping:  8,
    popularity_score: 74
  },

  // ── MIDDLE EAST ─────────────────────────────────────────────────────────
  {
    city: "Dubai",       country: "UAE",          airport: "DXB",
    lat:  25.25, lon:  55.36,
    daily_meals: 50, daily_accommodation: 120, daily_activities: 22, daily_shopping: 18,
    popularity_score: 85
  },

  // ── NORTH AMERICA ───────────────────────────────────────────────────────
  {
    city: "Mexico City", country: "Mexico",       airport: "MEX",
    lat:  19.44, lon: -99.07,
    daily_meals: 28, daily_accommodation:  55, daily_activities: 12, daily_shopping: 10,
    popularity_score: 80
  },
  {
    city: "Cancún",      country: "Mexico",       airport: "CUN",
    lat:  21.04, lon: -86.87,
    daily_meals: 36, daily_accommodation:  90, daily_activities: 25, daily_shopping: 15,
    popularity_score: 82
  },
  {
    city: "Tulum",       country: "Mexico",       airport: "CUN",
    lat:  20.21, lon: -87.46,
    daily_meals: 40, daily_accommodation:  85, daily_activities: 22, daily_shopping: 18,
    popularity_score: 80
  },
  {
    city: "Oaxaca",      country: "Mexico",       airport: "OAX",
    lat:  17.07, lon: -96.74,
    daily_meals: 24, daily_accommodation:  45, daily_activities: 14, daily_shopping: 18,
    popularity_score: 77
  },
  {
    city: "Puerto Vallarta", country: "Mexico",   airport: "PVR",
    lat:  20.68, lon:-105.25,
    daily_meals: 34, daily_accommodation:  70, daily_activities: 20, daily_shopping: 14,
    popularity_score: 75
  },
  {
    city: "San Miguel de Allende", country: "Mexico", airport: "BJX",
    lat:  20.91, lon:-100.74,
    daily_meals: 32, daily_accommodation:  75, daily_activities: 18, daily_shopping: 18,
    popularity_score: 73
  },
  {
    city: "Guadalajara", country: "Mexico",       airport: "GDL",
    lat:  20.52, lon:-103.31,
    daily_meals: 26, daily_accommodation:  50, daily_activities: 12, daily_shopping: 12,
    popularity_score: 70
  },
  {
    city: "New York",    country: "USA",          airport: "JFK",
    lat:  40.64, lon: -73.78,
    daily_meals: 68, daily_accommodation: 180, daily_activities: 28, daily_shopping: 15,
    popularity_score: 93
  },
  {
    city: "Los Angeles", country: "USA",          airport: "LAX",
    lat:  33.94, lon:-118.41,
    daily_meals: 62, daily_accommodation: 160, daily_activities: 25, daily_shopping: 15,
    popularity_score: 88
  },
  {
    city: "New Orleans", country: "USA",          airport: "MSY",
    lat:  29.99, lon: -90.26,
    daily_meals: 52, daily_accommodation: 120, daily_activities: 22, daily_shopping: 15,
    popularity_score: 82
  },
  {
    city: "Vancouver",   country: "Canada",       airport: "YVR",
    lat:  49.19, lon:-123.18,
    daily_meals: 48, daily_accommodation: 110, daily_activities: 18, daily_shopping: 12,
    popularity_score: 75
  },

  // ── SOUTH AMERICA ───────────────────────────────────────────────────────
  {
    city: "Buenos Aires", country: "Argentina",   airport: "EZE",
    lat: -34.82, lon: -58.54,
    daily_meals: 26, daily_accommodation:  50, daily_activities: 12, daily_shopping: 14,
    popularity_score: 84
  },
  {
    city: "Rio de Janeiro", country: "Brazil",    airport: "GIG",
    lat: -22.81, lon: -43.25,
    daily_meals: 34, daily_accommodation:  75, daily_activities: 18, daily_shopping: 14,
    popularity_score: 87
  },
  {
    city: "Medellín",    country: "Colombia",     airport: "MDE",
    lat:   6.22, lon: -75.59,
    daily_meals: 24, daily_accommodation:  42, daily_activities: 14, daily_shopping: 10,
    popularity_score: 79
  },
  {
    city: "Cartagena",   country: "Colombia",     airport: "CTG",
    lat:  10.44, lon: -75.51,
    daily_meals: 26, daily_accommodation:  60, daily_activities: 15, daily_shopping: 12,
    popularity_score: 78
  },
  {
    city: "Bogotá",      country: "Colombia",     airport: "BOG",
    lat:   4.70, lon: -74.13,
    daily_meals: 22, daily_accommodation:  48, daily_activities: 14, daily_shopping: 10,
    popularity_score: 72
  },
  {
    city: "Lima",        country: "Peru",         airport: "LIM",
    lat: -12.02, lon: -77.11,
    daily_meals: 28, daily_accommodation:  55, daily_activities: 16, daily_shopping: 12,
    popularity_score: 74
  },
  {
    city: "Cusco",       country: "Peru",         airport: "CUZ",
    lat: -13.53, lon: -71.94,
    daily_meals: 24, daily_accommodation:  48, daily_activities: 30, daily_shopping: 15,
    popularity_score: 82
  },
  {
    city: "Santiago",    country: "Chile",        airport: "SCL",
    lat: -33.39, lon: -70.79,
    daily_meals: 34, daily_accommodation:  68, daily_activities: 16, daily_shopping: 12,
    popularity_score: 71
  },
  {
    city: "Montevideo",  country: "Uruguay",      airport: "MVD",
    lat: -34.84, lon: -56.01,
    daily_meals: 30, daily_accommodation:  55, daily_activities: 12, daily_shopping: 12,
    popularity_score: 65
  },

  // ── AFRICA ──────────────────────────────────────────────────────────────
  {
    city: "Cape Town",   country: "South Africa", airport: "CPT",
    lat: -33.97, lon:  18.60,
    daily_meals: 30, daily_accommodation:  65, daily_activities: 18, daily_shopping: 12,
    popularity_score: 83
  },
  {
    city: "Marrakech",   country: "Morocco",      airport: "RAK",
    lat:  31.61, lon:  -8.04,
    daily_meals: 24, daily_accommodation:  50, daily_activities: 12, daily_shopping: 18,
    popularity_score: 80
  },

];
