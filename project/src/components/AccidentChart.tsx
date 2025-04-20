import React, { useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAccidentStore } from '../store/accidentStore';

export function AccidentChart() {
  const { accidentData, fetchAccidentData } = useAccidentStore();

  useEffect(() => {
    fetchAccidentData();
  }, [fetchAccidentData]);

  if (!accidentData.length) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-slate-400">Loading chart data...</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={accidentData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF' }}
        />
        <YAxis
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}