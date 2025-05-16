import axios from 'axios';

const API_URL = 'http://localhost:5000/api/carbon';

export const getEmissionFactors = async () => {
  try {
    const response = await axios.get(`${API_URL}/factors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching emission factors:', error);
    throw error;
  }
};

export const calculateCarbonFootprint = async (mode, distance, options = {}) => {
  try {
    const response = await axios.post(`${API_URL}/calculate`, {
      mode,
      distance,
      options
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating carbon footprint:', error);
    throw error;
  }
};

export const compareJourneyOptions = async (journeyOptions) => {
  try {
    const response = await axios.post(`${API_URL}/compare`, {
      journeyOptions
    });
    return response.data;
  } catch (error) {
    console.error('Error comparing journey options:', error);
    throw error;
  }
};