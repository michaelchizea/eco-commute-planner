import React from 'react';

const CarbonResults = ({ results, onSelectJourney }) => {
  if (!results || results.length === 0) {
    return null;
  }
  
  return (
    <div className="carbon-results">
      <h3>Carbon Footprint Comparison</h3>
      <div className="results-container">
        {results.map((result, index) => (
          <div 
            key={index} 
            className={`result-card ${index === 0 ? 'best-option' : ''}`}
            onClick={() => onSelectJourney(result)}
          >
            <div className="result-header">
              <h4>{result.mode.charAt(0).toUpperCase() + result.mode.slice(1)}</h4>
              {index === 0 && <span className="best-badge">Best Option</span>}
            </div>
            <div className="result-details">
              <p><strong>Distance:</strong> {result.distance.toFixed(2)} km</p>
              <p><strong>Carbon Footprint:</strong> {result.carbonFootprint.toFixed(2)} {result.carbonFootprintUnit}</p>
              <p><strong>Savings vs Car:</strong> {result.savings.toFixed(2)} {result.carbonFootprintUnit} ({result.savingsPercentage.toFixed(0)}%)</p>
              {result.mode === 'car' && result.options && (
                <p><strong>Car Type:</strong> {result.options.carType}, {result.options.occupancy} occupancy</p>
              )}
            </div>
            <button className="select-journey-btn">Track Savings</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarbonResults;