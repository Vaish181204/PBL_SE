import React, { useState } from 'react';
import { useAccidentStore } from '../store/accidentStore';

const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Bus'];
const weatherConditions = ['Clear', 'Rain', 'Snow', 'Fog'];
const roadConditions = ['Dry', 'Wet', 'Icy', 'Under Construction'];

export function PredictionForm() {
  const { predictSurvival, loading } = useAccidentStore();
  const [formData, setFormData] = useState({
    vehicleType: '',
    speed: 0,
    weatherCondition: '',
    roadCondition: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await predictSurvival(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'speed' ? parseInt(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Vehicle Type</label>
        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          className="w-full bg-slate-700 rounded-lg px-3 py-2"
          required
        >
          <option value="">Select vehicle type</option>
          {vehicleTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Speed (km/h)</label>
        <input
          type="number"
          name="speed"
          value={formData.speed}
          onChange={handleChange}
          className="w-full bg-slate-700 rounded-lg px-3 py-2"
          required
          min="0"
          max="200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Weather Condition</label>
        <select
          name="weatherCondition"
          value={formData.weatherCondition}
          onChange={handleChange}
          className="w-full bg-slate-700 rounded-lg px-3 py-2"
          required
        >
          <option value="">Select weather condition</option>
          {weatherConditions.map(condition => (
            <option key={condition} value={condition}>{condition}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Road Condition</label>
        <select
          name="roadCondition"
          value={formData.roadCondition}
          onChange={handleChange}
          className="w-full bg-slate-700 rounded-lg px-3 py-2"
          required
        >
          <option value="">Select road condition</option>
          {roadConditions.map(condition => (
            <option key={condition} value={condition}>{condition}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Now'}
      </button>
    </form>
  );
}