// routes/carbonRoutes.js
const express = require('express');
const router = express.Router();
const { calculateCarbonFootprint, compareJourneyOptions, EMISSION_FACTORS } = require('../services/carbonCalculator');

// Get emission factors
router.get('/factors', (req, res) => {
  res.json(EMISSION_FACTORS);
});

// Calculate carbon footprint for a single journey
router.post('/calculate', (req, res) => {
  try {
    const { mode, distance, options } = req.body;
    
    if (!mode || !distance) {
      return res.status(400).json({ error: 'Mode and distance are required' });
    }
    
    const result = calculateCarbonFootprint(mode, distance, options);
    res.json(result);
  } catch (error) {
    console.error('Carbon calculation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Compare multiple journey options
router.post('/compare', (req, res) => {
  try {
    const { journeyOptions } = req.body;
    
    if (!journeyOptions || !Array.isArray(journeyOptions) || journeyOptions.length === 0) {
      return res.status(400).json({ error: 'Valid journey options array is required' });
    }
    
    const results = compareJourneyOptions(journeyOptions);
    res.json(results);
  } catch (error) {
    console.error('Journey comparison error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;