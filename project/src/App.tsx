import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Ambulance,
  BarChart3,
  Brain,
  Clock,
  CloudRainWind,
  MapPin,
  Shield,
  ThermometerSun,
} from 'lucide-react';
import { PredictionForm } from './components/PredictionForm';
import { AccidentChart } from './components/AccidentChart';
import { EmergencyRoute } from './components/EmergencyRoute';
import { RiskAnalysis } from './components/RiskAnalysis';
import { useAccidentStore } from './store/accidentStore';

function App() {
  const [selectedTab, setSelectedTab] = useState('prediction');
  const { 
    statistics, 
    fetchStatistics, 
    prediction,
    emergencyRoute,
    riskFactors,
    findEmergencyRoute,
    analyzeRiskFactors,
    routeLoading,
    riskLoading,
    loadKaggleData,
    alerts,
    fetchAlerts
  } = useAccidentStore();

  useEffect(() => {
    loadKaggleData();
    fetchStatistics();
    fetchAlerts();
  }, [loadKaggleData, fetchStatistics, fetchAlerts]);

  const renderContent = () => {
    switch (selectedTab) {
      case 'analysis':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold">Risk Analysis</h2>
              </div>
              {riskFactors ? (
                <RiskAnalysis />
              ) : (
                <>
                  <p className="text-slate-300 mb-4">
                    Comprehensive analysis of risk factors including weather, road conditions, and time.
                  </p>
                  <button 
                    onClick={analyzeRiskFactors}
                    disabled={riskLoading}
                    className="w-full bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {riskLoading ? 'Analyzing...' : 'View Risks'}
                  </button>
                </>
              )}
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold">Accident Trends</h2>
              </div>
              <AccidentChart />
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold">Active Alerts</h2>
            </div>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="bg-slate-700/50 p-4 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.riskLevel === 'High' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <span className="font-semibold">Risk Level: {alert.riskLevel}</span>
                    </div>
                    <span className="text-sm text-slate-400">
                      {alert.location.join(', ')}
                    </span>
                  </div>
                  <p className="text-slate-300">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Accident Severity Prediction */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold">Severity Prediction</h2>
              </div>
              {prediction ? (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-center">
                    {prediction.survivalProbability?.toFixed(1)}%
                    <span className="block text-sm text-slate-400">Survival Probability</span>
                  </div>
                  <button 
                    onClick={() => useAccidentStore.setState({ prediction: null })}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg"
                  >
                    New Analysis
                  </button>
                </div>
              ) : (
                <PredictionForm />
              )}
            </div>

            {/* Emergency Response */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Ambulance className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-semibold">Emergency Response</h2>
              </div>
              {emergencyRoute ? (
                <EmergencyRoute />
              ) : (
                <>
                  <p className="text-slate-300 mb-4">
                    Optimize emergency response with real-time routing and hospital recommendations.
                  </p>
                  <button 
                    onClick={findEmergencyRoute}
                    disabled={routeLoading}
                    className="w-full bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {routeLoading ? 'Finding Route...' : 'Find Route'}
                  </button>
                </>
              )}
            </div>

            {/* Risk Analysis */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold">Risk Analysis</h2>
              </div>
              {riskFactors ? (
                <RiskAnalysis />
              ) : (
                <>
                  <p className="text-slate-300 mb-4">
                    Comprehensive analysis of risk factors including weather, road conditions, and time.
                  </p>
                  <button 
                    onClick={analyzeRiskFactors}
                    disabled={riskLoading}
                    className="w-full bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {riskLoading ? 'Analyzing...' : 'View Risks'}
                  </button>
                </>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold">Road Accident Survival Analysis</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => setSelectedTab('prediction')}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedTab === 'prediction' ? 'bg-blue-600' : 'hover:bg-slate-700'
                }`}
              >
                Prediction
              </button>
              <button 
                onClick={() => setSelectedTab('analysis')}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedTab === 'analysis' ? 'bg-blue-600' : 'hover:bg-slate-700'
                }`}
              >
                Analysis
              </button>
              <button 
                onClick={() => setSelectedTab('alerts')}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedTab === 'alerts' ? 'bg-blue-600' : 'hover:bg-slate-700'
                }`}
              >
                Alerts
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}

        {/* Live Statistics */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-semibold mb-6">Live Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-slate-400">Response Time</p>
                <p className="text-lg font-semibold">{statistics.responseTime.toFixed(1)} mins</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-slate-400">Active Incidents</p>
                <p className="text-lg font-semibold">{statistics.activeIncidents}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CloudRainWind className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-slate-400">Weather Risk</p>
                <p className="text-lg font-semibold">{statistics.weatherRisk}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThermometerSun className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-slate-400">Road Conditions</p>
                <p className="text-lg font-semibold">{statistics.roadConditions}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;