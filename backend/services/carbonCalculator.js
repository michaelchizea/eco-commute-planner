
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
  EMISSION_FACTORS
};