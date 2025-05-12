// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const testAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    return response.data;
  } catch (error) {
    console.error('API test error:', error);
    throw error;
  }
};

export const getTflLines = async () => {
  try {
    const response = await axios.get(`${API_URL}/tfl/lines`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TfL lines:', error);
    throw error;
  }
};