
/**
 * Carbon footprint calculator for different transport modes
 * Values are based on UK government conversion factors for greenhouse gas reporting
 */

// Carbon emission factors in kg CO2e per passenger kilometer
const EMISSION_FACTORS = {
  // Public transport
  bus: 0.089,          // Average bus
  coach: 0.027,        // Long-distance coach
  tube: 0.028,         // London Underground
  tram: 0.024,         // Tram/Light rail
  rail: 0.035,         // National rail average
  // Private transport
  car: {
    petrol: 0.170,     // Average petrol car
    diesel: 0.156,     // Average diesel car
    hybrid: 0.108,     // Average hybrid car
    electric: 0.045,   // Electric car (UK grid mix)
    // Car occupancy factors - divide by these numbers for shared journeys
    occupancy: {
      single: 1,
      shared: 2.5      // Average UK car occupancy is about 1.6, using 2.5 for shared journeys
    }
  },
  // Active transport
  walking: 0,          // No direct emissions
  cycling: 0,          // No direct emissions
  electricBike: 0.008  // E-bike
};

/**
 * Calculate carbon savings over time based on commute frequency
 * @param {Object} journey - Journey with carbon savings information
 * @param {Object} frequency - How often the journey is taken (e.g., {perDay: 2, daysPerWeek: 5})
 * @param {number} timeSpan - Number of weeks to calculate for
 * @returns {Object} Carbon savings over the specified time period
 */
const calculateSavingsOverTime = (journey, frequency, timeSpan = 52) => { // Default to yearly (52 weeks)
  const journeysPerWeek = frequency.perDay * frequency.daysPerWeek;
  const totalJourneys = journeysPerWeek * timeSpan;
  
  const totalSavings = journey.savings * totalJourneys;
  const equivalentActivities = getEquivalentActivities(totalSavings);
  
  return {
    timeSpan: {
      weeks: timeSpan,
      description: timeSpan === 52 ? 'year' : `${timeSpan} weeks`
    },
    journeysPerWeek,
    totalJourneys,
    totalSavings,
    carbonFootprintUnit: 'kg CO2e',
    equivalentActivities
  };
};

/**
 * Get equivalent activities for the amount of carbon saved
 * @param {number} kgCO2e - Carbon savings in kg CO2e
 * @returns {Object} Equivalent activities
 */
const getEquivalentActivities = (kgCO2e) => {
  return {
    treeMonths: Math.round(kgCO2e / 21), // One tree absorbs ~21kg CO2 per month
    smartphoneCharges: Math.round(kgCO2e / 0.009), // ~9g CO2e per full smartphone charge
    milesDriven: Math.round(kgCO2e / 0.170), // Average petrol car kg CO2e per km, converted to miles
    homeEnergyDays: Math.round(kgCO2e / 8.5) // Average UK home emits ~8.5kg CO2e per day
  };
};



/**
 * Calculate carbon footprint for a journey
 * @param {string} mode - Transport mode
 * @param {number} distance - Distance in kilometers
 * @param {Object} options - Additional options (car type, occupancy)
 * @returns {Object} Carbon footprint and savings information
 */
const calculateCarbonFootprint = (mode, distance, options = {}) => {
  let carbonFootprint = 0;
  
  if (mode === 'car') {
    const carType = options.carType || 'petrol';
    const occupancy = options.occupancy || 'single';
    carbonFootprint = (EMISSION_FACTORS.car[carType] / EMISSION_FACTORS.car.occupancy[occupancy]) * distance;
  } else if (EMISSION_FACTORS[mode] !== undefined) {
    carbonFootprint = EMISSION_FACTORS[mode] * distance;
  } else {
    throw new Error(`Unknown transport mode: ${mode}`);
  }
  
  // Calculate savings compared to average petrol car (single occupancy)
  const standardCarEmissions = EMISSION_FACTORS.car.petrol * distance;
  const savings = standardCarEmissions - carbonFootprint;
  const savingsPercentage = (savings / standardCarEmissions) * 100;
  
  return {
    mode,
    distance,
    carbonFootprint,
    carbonFootprintUnit: 'kg CO2e',
    savings,
    savingsPercentage,
    options
  };
};

/**
 * Compare carbon footprints of multiple journey options
 * @param {Array} journeyOptions - Array of journey options, each with mode, distance and options
 * @returns {Array} Sorted array of journey options with carbon footprint information
 */
const compareJourneyOptions = (journeyOptions) => {
  const results = journeyOptions.map(journey => {
    return {
      ...journey,
      ...calculateCarbonFootprint(journey.mode, journey.distance, journey.options)
    };
  });
  
  // Sort by carbon footprint (lowest first)
  return results.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
};

module.exports = {
  calculateCarbonFootprint,
  compareJourneyOptions,
  calculateSavingsOverTime,
  EMISSION_FACTORS
};