// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// TfL API example route
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});