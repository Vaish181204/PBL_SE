import React from 'react';
import { useAccidentStore } from '../store/accidentStore';
import { AlertTriangle, TrendingUp, Clock, MapPin } from 'lucide-react';

export function RiskAnalysis() {
  const { riskFactors, currentAnalysis } = useAccidentStore();

  if (!riskFactors) return null;

  return (
    <div className="space-y-4">
      {currentAnalysis && (
        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Current Analysis Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>Time: {currentAnalysis.timestamp}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-400" />
              <span>Location: {currentAnalysis.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <span>Overall Risk: {currentAnalysis.overallRisk}%</span>
            </div>
          </div>
        </div>
      )}

      {riskFactors.map((factor, index) => (
        <div key={index} className="bg-slate-800/40 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${
                factor.risk > 70 ? 'text-red-500' :
                factor.risk > 40 ? 'text-yellow-500' :
                'text-green-500'
              }`} />
              <span className="font-semibold">{factor.factor}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${
                factor.risk > 70 ? 'text-red-500' :
                factor.risk > 40 ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                Risk Level: {factor.risk}%
              </span>
              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    factor.risk > 70 ? 'bg-red-500' :
                    factor.risk > 40 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${factor.risk}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-300">{factor.description}</p>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-sm font-medium mb-2">Key Insights:</p>
            <ul className="text-sm text-slate-300 space-y-1">
              {factor.insights.map((insight, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-sm font-medium mb-2">Recommendations:</p>
            <ul className="text-sm text-slate-300 space-y-1">
              {factor.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}