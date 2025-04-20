import React from 'react';
import { useAccidentStore } from '../store/accidentStore';
import { Clock, Navigation } from 'lucide-react';

export function EmergencyRoute() {
  const { emergencyRoute } = useAccidentStore();

  if (!emergencyRoute) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-500" />
          <span className="font-semibold">{emergencyRoute.hospital}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">{emergencyRoute.duration} mins</span>
        </div>
      </div>
      
      <div className="w-full h-64 rounded-lg overflow-hidden bg-slate-800/50 p-4">
        <div className="h-full flex flex-col">
          <div className="flex-1 relative">
            {/* Route visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-0.5 bg-blue-500/20 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-blue-500 animate-[route_2s_ease-in-out_forwards]" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Current Location</span>
              <span>{emergencyRoute.hospital}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-green-500">●</span>
              <span className="text-red-500">●</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm space-y-2">
        <p className="text-slate-400">Distance: {emergencyRoute.distance}</p>
        <div className="space-y-2">
          {emergencyRoute.route.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-blue-500">{index + 1}</span>
              </div>
              <p className="text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}