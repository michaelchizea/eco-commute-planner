import React, { useState, useEffect } from 'react';
import { testAPI, getTflLines } from './services/api';
import Map from './components/Map';
import './App.css';

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [apiStatus, setApiStatus] = useState('');
  const [tflLines, setTflLines] = useState([]);
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Planning route from', origin, 'to', destination);
    // Test the TfL API connection
    fetchTflLines();
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