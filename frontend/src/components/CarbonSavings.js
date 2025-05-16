import React, { useState } from 'react';
import { calculateSavingsOverTime } from '../services/carbonService';

const CarbonSavings = ({ selectedJourney }) => {
  const [frequency, setFrequency] = useState({ perDay: 2, daysPerWeek: 5 });
  const [timeSpan, setTimeSpan] = useState(52); // Default to 1 year (52 weeks)
  const [savings, setSavings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCalculate = async () => {
    if (!selectedJourney) return;
    
    setIsLoading(true);
    try {
      const data = await calculateSavingsOverTime(selectedJourney, frequency, timeSpan);
      setSavings(data);
    } catch (error) {
      console.error('Failed to calculate savings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!selectedJourney) {
    return (
      <div className="carbon-savings">
        <h3>Track Your Carbon Savings</h3>
        <p>Please select a journey option first to track potential savings.</p>
      </div>
    );
  }
  
  return (
    <div className="carbon-savings">
      <h3>Track Your Carbon Savings</h3>
      <p>See how much carbon you could save by choosing {selectedJourney.mode} instead of a petrol car.</p>
      
      <div className="savings-calculator">
        <div className="calculator-form">
          <div className="form-group">
            <label>Journeys per day:</label>
            <select 
              value={frequency.perDay} 
              onChange={(e) => setFrequency({...frequency, perDay: parseInt(e.target.value)})}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Days per week:</label>
            <select 
              value={frequency.daysPerWeek} 
              onChange={(e) => setFrequency({...frequency, daysPerWeek: parseInt(e.target.value)})}
            >
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Calculate for:</label>
            <select 
              value={timeSpan} 
              onChange={(e) => setTimeSpan(parseInt(e.target.value))}
            >
              <option value={4}>1 month</option>
              <option value={12}>3 months</option>
              <option value={26}>6 months</option>
              <option value={52}>1 year</option>
            </select>
          </div>
          
          <button 
            className="calculate-button" 
            onClick={handleCalculate}
            disabled={isLoading}
          >
            {isLoading ? 'Calculating...' : 'Calculate Savings'}
          </button>
        </div>
        
        {savings && (
          <div className="savings-results">
            <div className="savings-highlight">
              <span className="savings-value">{savings.totalSavings.toFixed(2)}</span>
              <span className="savings-unit">kg CO₂e</span>
              <span className="savings-period">saved over {savings.timeSpan.description}</span>
            </div>
            
            <div className="savings-equivalents">
              <h4>This is equivalent to:</h4>
              <ul>
                <li>🌳 {savings.equivalentActivities.treeMonths} months of carbon absorption by a tree</li>
                <li>🔋 {savings.equivalentActivities.smartphoneCharges.toLocaleString()} smartphone charges</li>
                <li>🚗 {savings.equivalentActivities.milesDriven.toLocaleString()} miles not driven in a petrol car</li>
                <li>🏠 {savings.equivalentActivities.homeEnergyDays} days of home energy use</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonSavings;