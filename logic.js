// logic.js
// All the calculation functions for the Travel Budget Finder.
// No internet connection needed — everything runs locally.

// ─── 1. BUDGET MATH ──────────────────────────────────────────────────────────
// Answers: "after keeping a safety buffer, how much can I actually spend on travel?"
//
// If monthlyIncome > 0, we project 3 months of net earnings to get a better
// picture of your real financial position (past 3 months net savings added to
// declared savings). This lets part-time or salaried workers see a more accurate
// travel budget even if their savings figure is slightly out of date.

function calculateTravelBudget(savings, monthlyIncome, monthlyEssentialSpend, allocationPct, bufferMonths) {
  bufferMonths  = bufferMonths  || 3;
  monthlyIncome = monthlyIncome || 0;

  // 3-month safety net (kept off-limits regardless of travel plans)
  var emergencyBuffer = monthlyEssentialSpend * bufferMonths;

  // Net income over past 3 months adds to (or reduces) the effective savings base
  var threeMonthNet    = monthlyIncome > 0 ? (monthlyIncome - monthlyEssentialSpend) * 3 : 0;
  var effectiveSavings = savings + threeMonthNet;

  var travelBudget = (effectiveSavings * allocationPct) - emergencyBuffer;

  return {
    emergencyBuffer:  Math.round(emergencyBuffer),
    threeMonthNet:    Math.round(threeMonthNet),
    effectiveSavings: Math.round(effectiveSavings),
    travelBudget:     travelBudget
  };
}


// ─── 2. HAVERSINE DISTANCE ────────────────────────────────────────────────────
// Answers: "how many km is it (as the crow flies) between two points on Earth?"
// Uses latitude and longitude coordinates.

function haversineDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Earth's radius in km
  var toRad = function(deg) { return deg * Math.PI / 180; };

  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // result in km
}


// ─── 3. FLIGHT COST ESTIMATE ──────────────────────────────────────────────────
// Answers: "based on distance, what's a rough flight cost range (low to high)?"
// Returns an object like { low: 300, high: 450 } — always a range, never a single number.

function flightCostRange(distanceKm) {
  var ratePerKm;
  if (distanceKm < 500) {
    ratePerKm = 0.30;
  } else if (distanceKm < 2000) {
    ratePerKm = 0.18;
  } else if (distanceKm < 6000) {
    ratePerKm = 0.12;
  } else {
    ratePerKm = 0.09;
  }

  var midpoint = distanceKm * ratePerKm;
  return {
    low:  Math.round(midpoint * 0.8),
    high: Math.round(midpoint * 1.2)
  };
}


// ─── 4. FILTER + RANK ────────────────────────────────────────────────────────
// Answers: "which cities from the list can I actually afford, and in what order?"
// Takes the user's situation + the full CITIES array, returns only affordable ones.

var TIER_MULTIPLIERS = { budget: 0.8, mid: 1.2, lavish: 1.8 };

function findAffordableDestinations(homeLat, homeLon, travelBudget, days, style, cities) {
  var multiplier = TIER_MULTIPLIERS[style] || TIER_MULTIPLIERS.mid;
  var results = [];

  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];

    var distanceKm = haversineDistance(homeLat, homeLon, city.lat, city.lon);
    if (distanceKm < 10) continue; // skip — this is the home city itself
    var flight     = flightCostRange(distanceKm);
    var flightMid  = (flight.low + flight.high) / 2;

    // Apply tier multiplier to each cost category independently
    var dMeals      = city.daily_meals         * multiplier;
    var dAccomm     = city.daily_accommodation * multiplier;
    var dActivities = city.daily_activities    * multiplier;
    var dShopping   = city.daily_shopping      * multiplier;
    var dailyLand   = dMeals + dAccomm + dActivities + dShopping;

    var totalMid = flightMid + dailyLand * days;

    if (totalMid <= travelBudget) {
      var bucket = days <= 2 ? 'Weekend' : days <= 5 ? 'Short trip' : 'Week+';

      results.push({
        city:              city.city,
        country:           city.country,
        distanceKm:        Math.round(distanceKm),
        flightLow:         flight.low,
        flightHigh:        flight.high,
        // Per-day category costs (after multiplier)
        dailyMeals:        Math.round(dMeals),
        dailyAccomm:       Math.round(dAccomm),
        dailyActivities:   Math.round(dActivities),
        dailyShopping:     Math.round(dShopping),
        dailyLandCost:     Math.round(dailyLand),
        // Trip totals
        totalLow:          flight.low  + Math.round(dailyLand * days),
        totalHigh:         flight.high + Math.round(dailyLand * days),
        totalMid:          Math.round(totalMid),
        popularity:        city.popularity_score,
        bucket:            bucket,
        math:              'Flight ~$' + flight.low + '–$' + flight.high +
                           ' (est) + $' + Math.round(dailyLand) + '/day × ' + days + ' days'
      });
    }
  }

  // Sort: cheapest total first; ties broken by popularity (higher = better)
  results.sort(function(a, b) {
    if (a.totalMid !== b.totalMid) return a.totalMid - b.totalMid;
    return b.popularity - a.popularity;
  });

  return results;
}


// ─── TESTS (only runs when you call this file with Node.js) ──────────────────
// In the browser, this block is ignored. In the terminal, it prints results
// so you can check whether the math looks right.

if (typeof require !== 'undefined') {
  var fs = require('fs');
  // Load cities.js so the CITIES array is available here too.
  // We swap 'const' → 'var' so the variable isn't trapped inside the eval block.
  var citiesCode = fs.readFileSync(__dirname + '/cities.js', 'utf8').replace('const CITIES', 'var CITIES');
  eval(citiesCode);

  console.log('\n========== TEST 1: Budget Math ==========');
  // No income: $20k savings, $2k/mo expenses, 50% allocation
  var budget1 = calculateTravelBudget(20000, 0, 2000, 0.50, 3);
  console.log('Savings $20k | Income $0 | Expenses $2k/mo | Use 50%');
  console.log('  Buffer:', '$' + budget1.emergencyBuffer, '| 3-month net: $' + budget1.threeMonthNet);
  console.log('  Effective savings:', '$' + budget1.effectiveSavings);
  console.log('  Travel budget:', '$' + budget1.travelBudget, '(expect $4,000)');

  // With income: $20k savings, $5k income, $2k expenses, 50%
  var budget2 = calculateTravelBudget(20000, 5000, 2000, 0.50, 3);
  console.log('\nSavings $20k | Income $5k/mo | Expenses $2k/mo | Use 50%');
  console.log('  Buffer:', '$' + budget2.emergencyBuffer, '| 3-month net: $' + budget2.threeMonthNet);
  console.log('  Effective savings:', '$' + budget2.effectiveSavings, '($20k + 3×$3k = $29k)');
  console.log('  Travel budget:', '$' + budget2.travelBudget, '(expect $8,500)');


  console.log('\n========== TEST 2: Haversine Distance ==========');
  // New York (40.64, -73.78) to London (51.48, -0.45) — should be ~5,540 km
  var d1 = haversineDistance(40.64, -73.78, 51.48, -0.45);
  console.log('New York → London:', Math.round(d1) + ' km  (expect ~5,540 km)');

  // Paris to Berlin — should be ~878 km
  var d2 = haversineDistance(49.01, 2.55, 52.36, 13.50);
  console.log('Paris → Berlin:',    Math.round(d2) + ' km  (expect ~878 km)');


  console.log('\n========== TEST 3: Flight Cost Range ==========');
  // Short hop ~878 km (500-2000 tier → $0.18/km)
  // midpoint = 878 * 0.18 = ~158, range = ~126 to ~190
  var f1 = flightCostRange(878);
  console.log('878 km flight: $' + f1.low + ' - $' + f1.high + '  (expect ~$126-$190)');

  // Long haul ~5,540 km (2000-6000 tier → $0.12/km)
  // midpoint = 5540 * 0.12 = ~665, range = ~532 to ~798
  var f2 = flightCostRange(5540);
  console.log('5,540 km flight: $' + f2.low + ' - $' + f2.high + '  (expect ~$532-$798)');

  // Ultra long ~9,000 km (>6000 tier → $0.09/km)
  // midpoint = 9000 * 0.09 = 810, range = 648 to 972
  var f3 = flightCostRange(9000);
  console.log('9,000 km flight: $' + f3.low + ' - $' + f3.high + '  (expect ~$648-$972)');


  console.log('\n========== TEST 4: Filter + Rank ==========');
  // Home: New York (40.64, -73.78)
  // Budget: $5,000 travel budget, 7 days, mid-range style
  var homeLat = 40.64, homeLon = -73.78;
  var travelBudget = 5000;
  var days = 7;

  var destinations = findAffordableDestinations(homeLat, homeLon, travelBudget, days, 'mid', CITIES);

  console.log('Home: New York | Budget: $' + travelBudget + ' | Days: ' + days + ' | Style: mid');
  console.log('Affordable destinations found:', destinations.length);
  console.log('');

  destinations.forEach(function(d, idx) {
    console.log((idx + 1) + '. ' + d.city + ', ' + d.country);
    console.log('   Total range: $' + d.totalLow + ' – $' + d.totalHigh);
    console.log('   Meals: $' + d.dailyMeals + '/day | Accomm: $' + d.dailyAccomm +
                '/day | Activities: $' + d.dailyActivities + '/day | Shopping: $' + d.dailyShopping + '/day');
    console.log('   ' + d.math);
    console.log('   Distance: ' + d.distanceKm + ' km | Popularity: ' + d.popularity);
  });

  if (destinations.length === 0) {
    console.log('No affordable destinations found. Try a higher budget or fewer days.');
  }
}
