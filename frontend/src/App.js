import React, { useState } from 'react';
import './App.css';

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Planning route from', origin, 'to', destination);
    // Will implement API calls later
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
      </main>
    </div>
  );
}

export default App;