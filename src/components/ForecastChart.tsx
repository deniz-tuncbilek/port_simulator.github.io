import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { DailyForecast } from '../types';

interface ForecastChartProps {
  forecasts: DailyForecast[];
  maxCapacity: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecasts, maxCapacity }) => {
  const data = forecasts.map(f => ({
    name: `Day ${f.day}`,
    capacity: f.forecastedCapacity,
    status: f.status,
    inflow: f.totalInflow,
    outflow: f.totalOutflow,
    net: f.netChange
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-lg rounded-xl text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="flex justify-between gap-4"><span className="text-slate-500">Forecast:</span> <span className="font-mono font-bold text-slate-900">{data.capacity.toLocaleString()}</span></p>
            <p className="flex justify-between gap-4"><span className="text-slate-500">Inflow:</span> <span className="font-mono text-slate-700">+{data.inflow.toLocaleString()}</span></p>
            <p className="flex justify-between gap-4"><span className="text-slate-500">Outflow:</span> <span className="font-mono text-slate-700">-{data.outflow.toLocaleString()}</span></p>
            <p className="flex justify-between gap-4 pt-1 border-t border-slate-100"><span className="text-slate-500">Net:</span> <span className="font-mono font-bold text-slate-900">{data.net > 0 ? '+' : ''}{data.net.toLocaleString()}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomReferenceLabel = (props: any) => {
    const { viewBox, value, fill } = props;
    const width = 64;
    const height = 18;
    const x = viewBox.x + viewBox.width - width;
    const y = viewBox.y - height / 2;
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill="rgba(255, 255, 255, 0.8)" rx={4} />
        <text x={x + width / 2} y={y + 12} fill={fill} fontSize={10} fontWeight="bold" textAnchor="middle">
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-[300px] bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col">
      <h3 className="text-sm font-bold text-slate-800 mb-4 shrink-0">14-Day Capacity Forecast</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              dy={10}
            />
            <YAxis 
              domain={[0, Math.max(maxCapacity * 1.2, ...data.map(d => d.capacity))]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(val) => `${val / 1000}k`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine 
              y={maxCapacity} 
              stroke="#f43f5e" 
              strokeDasharray="3 3" 
              label={(props) => <CustomReferenceLabel {...props} value="100% MAX" fill="#f43f5e" />} 
            />
            <ReferenceLine 
              y={maxCapacity * 0.9} 
              stroke="#f59e0b" 
              strokeDasharray="3 3" 
              label={(props) => <CustomReferenceLabel {...props} value="90% WARN" fill="#f59e0b" />} 
            />
            
            <Line 
              type="monotone" 
              dataKey="capacity" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const fill = payload.status === 'red' ? '#f43f5e' : payload.status === 'yellow' ? '#f59e0b' : '#10b981';
                return (
                  <circle cx={cx} cy={cy} r={4} fill={fill} stroke="white" strokeWidth={2} key={`dot-${payload.name}`} />
                );
              }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
