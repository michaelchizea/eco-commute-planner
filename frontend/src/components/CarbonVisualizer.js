import React from 'react';

const CarbonVisualizer = ({ results }) => {
  if (!results || results.length === 0) return null;
  
  // Find the highest carbon footprint for scaling
  const maxFootprint = Math.max(...results.map(r => r.carbonFootprint));
  
  return (
    <div className="carbon-visualizer">
      <h3>Carbon Footprint Comparison</h3>
      <div className="visualizer-container">
        {results.map((result, index) => {
          // Calculate bar height as percentage of max
          const percentage = (result.carbonFootprint / maxFootprint) * 100;
          const savingsPercent = result.savingsPercentage;
          
          return (
            <div key={index} className="visualizer-item">
              <div className="visualizer-bar-container">
                <div 
                  className="visualizer-bar" 
                  style={{ height: `${percentage}%` }}
                >
                  <span className="visualizer-value">
                    {result.carbonFootprint.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="visualizer-label">
                <span className="transport-mode">{result.mode}</span>
                {savingsPercent > 0 && (
                  <span className="savings-badge">
                    -{savingsPercent.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="visualizer-legend">
        <span>Values in kg CO₂e per journey</span>
      </div>
    </div>
  );
};

export default CarbonVisualizer;