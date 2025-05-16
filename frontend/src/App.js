import React, { useState, useEffect } from 'react';
import { testAPI, getTflLines } from './services/api';
import { compareJourneyOptions } from './services/carbonService';
import Map from './components/Map';
import CarbonResults from './components/CarbonResults';
import CarbonVisualizer from './components/CarbonVisualizer';
import './App.css';
import CarbonSavings from './components/CarbonSavings';


// Simulated geocoding function
const geocode = (address) => {
  // In a real app, you'd call a geocoding service
  // For demo purposes, we'll return random coordinates around London
  const londonLat = 51.5074;
  const londonLng = -0.1278;
  
  // Generate a point within ~5km of London center
  return [
    londonLat + (Math.random() - 0.5) * 0.05,
    londonLng + (Math.random() - 0.5) * 0.05
  ];
};

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [apiStatus, setApiStatus] = useState('');
  const [tflLines, setTflLines] = useState([]);
  const [carbonResults, setCarbonResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState(null);

  
  useEffect(() => {
    // Test API connection on component mount
    const checkAPI = async () => {
      try {
        const data = await testAPI();
        setApiStatus(data.message);
      } catch (error) {
        setApiStatus('API connection failed');
      }
    };
    
    checkAPI();
  }, []);
  
  const fetchTflLines = async () => {
    try {
      const lines = await getTflLines();
      setTflLines(lines);
    } catch (error) {
      console.error('Failed to fetch TfL lines');
    }
  };

  const handleSelectJourney = (journey) => {
    setSelectedJourney(journey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate geocoding
      const originPoint = geocode(origin);
      const destPoint = geocode(destination);
      
      setOriginCoords(originPoint);
      setDestinationCoords(destPoint);
      
      // Calculate rough distance (crude approximation, not actual route distance)
      const lat1 = originPoint[0];
      const lon1 = originPoint[1];
      const lat2 = destPoint[0];
      const lon2 = destPoint[1];
      
      // Simple haversine distance in km
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      // Simulate different journey options
      const journeyOptions = [
        { mode: 'car', distance, options: { carType: 'petrol', occupancy: 'single' } },
        { mode: 'car', distance, options: { carType: 'electric', occupancy: 'single' } },
        { mode: 'bus', distance: distance * 1.2 }, // Buses often take longer routes
        { mode: 'tube', distance: distance * 0.9 }, // Tubes might have more direct routes
        { mode: 'cycling', distance: distance * 0.95 } // Cycling paths can be slightly different
      ];
      
      const results = await compareJourneyOptions(journeyOptions);
      setCarbonResults(results);
      
      // Also fetch TfL lines
      fetchTflLines();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Eco-Commute Planner</h1>
        <p>Plan your journey with the lowest carbon footprint</p>
      </header>
      
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="origin">Starting Point:</label>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting location"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="destination">Destination:</label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Calculating...' : 'Find Eco Routes'}
          </button>
        </form>
        
        {carbonResults.length > 0 && (
          <div className="results-section">
            <CarbonVisualizer results={carbonResults} />
            <CarbonResults 
              results={carbonResults} 
              onSelectJourney={handleSelectJourney}
            />
          </div>
        )}
        
        <div className="map-section">
          <h3>Route Map</h3>
          <Map origin={originCoords} destination={destinationCoords} />
        </div>

         {/* Add the CarbonSavings component */}
        {selectedJourney && (
          <CarbonSavings selectedJourney={selectedJourney} />
        )}
        
        {apiStatus && (
          <div className="api-status">
            <p>Backend status: {apiStatus}</p>
          </div>
        )}


        
        {tflLines.length > 0 && (
          <div className="tfl-lines">
            <h3>Available TfL Lines:</h3>
            <ul>
              {tflLines.slice(0, 5).map(line => (
                <li key={line.id}>{line.name} ({line.modeName})</li>
              ))}
              {tflLines.length > 5 && <li>...and {tflLines.length - 5} more</li>}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;