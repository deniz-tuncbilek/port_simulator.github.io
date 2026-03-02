import React from 'react';
import { DailyForecast } from '../types';
import { AlertTriangle, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  forecast: DailyForecast;
  maxCapacity: number;
  selectedScenario: string;
  setSelectedScenario: (s: string) => void;
  scenarios: { id: string, name: string }[];
}

export const Header: React.FC<HeaderProps> = ({ forecast, maxCapacity, selectedScenario, setSelectedScenario, scenarios }) => {
  const statusConfig = {
    green: { icon: CheckCircle2, text: 'Clear', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    yellow: { icon: AlertTriangle, text: 'Warning', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    red: { icon: AlertCircle, text: 'Alarm', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' }
  };

  const StatusIcon = statusConfig[forecast.status].icon;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      {/* Left: Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Settings2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">Port Simulator</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">14-Day Forecast</p>
        </div>
      </div>

      {/* Middle: KPIs */}
      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Day</span>
          <span className="text-xl font-black text-slate-900">{forecast.day}</span>
        </div>

        <div className="hidden sm:block h-8 w-px bg-slate-200" />

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Yard</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-slate-900">
              {Math.round(forecast.forecastedCapacity).toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">
              / {maxCapacity.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="hidden sm:block h-8 w-px bg-slate-200" />

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Net</span>
          <div className="flex items-center gap-1">
            {forecast.netChange > 0 ? (
              <TrendingUp className="w-3 h-3 text-slate-500" />
            ) : forecast.netChange < 0 ? (
              <TrendingDown className="w-3 h-3 text-slate-500" />
            ) : (
              <Minus className="w-3 h-3 text-slate-400" />
            )}
            <span className="text-base font-mono font-bold text-slate-900">
              {forecast.netChange > 0 ? '+' : ''}{forecast.netChange.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="hidden sm:block h-8 w-px bg-slate-200" />

        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
          statusConfig[forecast.status].bg,
          statusConfig[forecast.status].border
        )}>
          <StatusIcon className={cn("w-5 h-5", statusConfig[forecast.status].color)} />
          <div className="flex flex-col">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider leading-tight", statusConfig[forecast.status].color)}>
              Status
            </span>
            <span className={cn("text-xs font-bold leading-tight", statusConfig[forecast.status].color)}>
              {statusConfig[forecast.status].text} ({Math.round(forecast.percentOfMax)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Right: Scenario */}
      <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Scenario:</label>
        <select 
          value={selectedScenario}
          onChange={(e) => setSelectedScenario(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 font-medium shadow-sm cursor-pointer max-w-[200px] truncate"
        >
          {scenarios.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
    </header>
  );
};
