import React, { useState, useEffect } from 'react';
import { testAPI, getTflLines } from './services/api';
import Map from './components/Map';
import './App.css';
import { compareJourneyOptions } from './services/carbonService';
import CarbonResults from './components/CarbonResults';


function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [apiStatus, setApiStatus] = useState('');
  const [tflLines, setTflLines] = useState([]);
  const [carbonResults, setCarbonResults] = useState([]);


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Planning route from', origin, 'to', destination);

    try {
      // Simulate different journey options
      const journeyOptions = [
        { mode: 'car', distance: 10, options: { carType: 'petrol', occupancy: 'single' } },
        { mode: 'car', distance: 10, options: { carType: 'electric', occupancy: 'single' } },
        { mode: 'bus', distance: 10.5 },
        { mode: 'tube', distance: 9.5 },
        { mode: 'cycling', distance: 8.5 }
      ];
      
      const results = await compareJourneyOptions(journeyOptions);
      setCarbonResults(results);

    // Test the TfL API connection
    fetchTflLines();
    }
    catch (error) {
      console.error('Error calculating carbon footprint:', error);
    }


  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Eco-Commute Planner</h1>
        <p>Plan your journey with the lowest carbon footprint</p>
      </header>
      
      <main>
                {/* Add Carbon Results */}

        {carbonResults.length > 0 && (
          <CarbonResults results={carbonResults} />
        )}

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
          
          <button type="submit">Find Eco Routes</button>
        </form>

      {/* Map component to show the route */}

        <div className="map-section">
          <h3>Route Map</h3>
          <Map />
        </div>
        
        {apiStatus && (
          <div className="api-status">
            <p>Backend status: {apiStatus}</p>
          </div>
        )}
        
        {tflLines.length > 0 && (
          <div className="tfl-lines">
            <h3>Available TfL Lines Now:</h3>
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