// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const carbonRoutes = require('./routes/carbonRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/carbon', carbonRoutes);



// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// TfL API 
app.get('/api/tfl/lines', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.tfl.gov.uk/Line/Mode/tube',
      {
        params: {
          app_key: process.env.TFL_API_KEY
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TfL data:', error);
    res.status(500).json({ error: 'Failed to fetch TfL data' });
  }
});

// Transport API 
app.get('/api/transport/stations', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(
      `https://transportapi.com/v3/uk/places.json`,
      {
        params: {
          app_id: process.env.TRANSPORT_API_ID,
          app_key: process.env.TRANSPORT_API_KEY,
          lat,
          lon,
          type: 'train_station,bus_stop',
          rpp: 10 // Results per page
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching transport data:', error);
    res.status(500).json({ error: 'Failed to fetch transport data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});