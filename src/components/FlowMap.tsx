import React from 'react';
import { motion } from 'motion/react';
import { Anchor, Container, Truck, Train } from 'lucide-react';
import { DailyForecast } from '../types';
import { cn } from '../lib/utils';

interface FlowMapProps {
  forecast: DailyForecast;
  maxCapacity: number;
}

const Node = ({ 
  icon: Icon, 
  label, 
  metrics, 
  className 
}: { 
  icon: any, 
  label: string, 
  metrics?: { label: string, value: number, type: 'in' | 'out' }[], 
  className?: string 
}) => (
  <div className={cn("flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 z-10 w-44", className)}>
    <div className="p-3 bg-slate-50 rounded-full mb-2">
      <Icon className="w-6 h-6 text-slate-700" />
    </div>
    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-1">{label}</span>
    {metrics && (
      <div className="w-full flex flex-col gap-1 mt-2 border-t border-slate-100 pt-2">
        {metrics.map((m, i) => (
          <div key={i} className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 uppercase">{m.label}</span>
            <span className="font-mono font-bold text-slate-900">
              {m.value.toLocaleString()} <span className="text-[8px] text-slate-400">TEU</span>
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Pipeline = ({ 
  direction, 
  value, 
  maxExpected = 10000, 
  className,
  label
}: { 
  direction: 'right' | 'left' | 'up' | 'down', 
  value: number, 
  maxExpected?: number,
  className?: string,
  label: string
}) => {
  const thickness = Math.max(2, Math.min(12, (value / maxExpected) * 12));
  const isHorizontal = direction === 'right' || direction === 'left';
  
  // Determine animation direction based on flow direction
  const animClass = 
    direction === 'right' ? 'animate-[flow-right_1s_linear_infinite]' :
    direction === 'left' ? 'animate-[flow-left_1s_linear_infinite]' :
    direction === 'down' ? 'animate-[flow-down_1s_linear_infinite]' :
    'animate-[flow-up_1s_linear_infinite]';

  const speed = Math.max(0.5, 3 - (value / maxExpected) * 2);

  return (
    <div 
      className={cn("absolute flex items-center justify-center group z-0", className)} 
      title={`${label}: ${value} TEUs/day`}
    >
      <div 
        className={cn(
          "bg-slate-200 rounded-full overflow-hidden relative",
          isHorizontal ? "w-full" : "h-full"
        )}
        style={{ 
          height: isHorizontal ? `${thickness}px` : '100%',
          width: isHorizontal ? '100%' : `${thickness}px`
        }}
      >
        {value > 0 && (
          <div
            className={cn("absolute bg-blue-500/50", animClass)}
            style={{
              width: isHorizontal ? '50%' : '100%',
              height: isHorizontal ? '100%' : '50%',
              animationDuration: `${speed}s`
            }}
          />
        )}
      </div>
      <span className="absolute -top-6 text-[10px] font-mono text-slate-500 bg-white/90 px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        {label}: {value.toLocaleString()}
      </span>
    </div>
  );
};

export const FlowMap: React.FC<FlowMapProps> = ({ forecast, maxCapacity }) => {
  const percent = Math.min(100, Math.max(0, forecast.percentOfMax));
  
  const statusColors = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    red: 'bg-rose-500'
  };

  const statusBorderColors = {
    green: 'border-emerald-500',
    yellow: 'border-amber-500',
    red: 'border-rose-500'
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-50 rounded-2xl border border-slate-200 p-8 flex items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }} />

      <div className="relative w-full max-w-5xl h-full mx-auto">
        
        {/* Left Node: Vessel / Berth */}
        <Node 
          icon={Anchor} 
          label="Vessel / Berth" 
          metrics={[
            { label: 'Import', value: forecast.vesselImport, type: 'in' },
            { label: 'Export', value: forecast.vesselExport, type: 'out' }
          ]}
          className="absolute left-0 top-1/2 -translate-y-1/2" 
        />

        {/* Center Node: Yard */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className={cn(
            "w-64 h-64 bg-white rounded-2xl shadow-xl border-2 flex flex-col overflow-hidden transition-colors duration-500",
            statusBorderColors[forecast.status]
          )}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-2">
                <Container className="w-5 h-5 text-slate-700" />
                <span className="font-bold text-slate-800">YARD</span>
              </div>
              <span className={cn("text-xs font-bold px-2 py-1 rounded-full text-white", statusColors[forecast.status])}>
                {Math.round(percent)}%
              </span>
            </div>
            
            <div className="flex-1 relative bg-slate-100 flex items-end">
              {/* 100% Max Capacity Line */}
              <div className="absolute w-full border-t-2 border-dashed border-rose-500 z-20" style={{ bottom: '100%' }}>
                <span className="absolute -top-2.5 right-2 text-[10px] font-bold text-rose-600 bg-white/80 px-1 rounded">100% MAX</span>
              </div>

              {/* 90% Threshold Line */}
              <div className="absolute w-full border-t-2 border-dashed border-amber-500 z-20" style={{ bottom: '90%' }}>
                <span className="absolute -top-2.5 right-2 text-[10px] font-bold text-amber-600 bg-white/80 px-1 rounded">90% WARN</span>
              </div>
              
              {/* Fill Level */}
              <motion.div 
                className={cn("w-full opacity-50", statusColors[forecast.status])}
                initial={{ height: 0 }}
                animate={{ height: `${percent}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              >
                {/* Container Texture */}
                <div className="w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent)', backgroundSize: '20px 20px' }} />
              </motion.div>
            </div>
            
            <div className="p-3 bg-white border-t border-slate-100 z-10 text-center">
              <div className="text-2xl font-mono font-bold text-slate-900">
                {Math.round(forecast.forecastedCapacity).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                / {maxCapacity.toLocaleString()} TEUs
              </div>
            </div>
          </div>
        </div>

        {/* Right Nodes: Truck Gate & Rail Ramp */}
        <Node 
          icon={Truck} 
          label="Truck Gate" 
          metrics={[
            { label: 'Unloading', value: forecast.truckUnloading, type: 'in' },
            { label: 'Loading', value: forecast.truckLoading, type: 'out' }
          ]}
          className="absolute right-0 top-1/4 -translate-y-1/2" 
        />
        <Node 
          icon={Train} 
          label="Rail Ramp" 
          metrics={[
            { label: 'Unloading', value: forecast.trainUnloading, type: 'in' },
            { label: 'Loading', value: forecast.trainLoading, type: 'out' }
          ]}
          className="absolute right-0 top-3/4 -translate-y-1/2" 
        />

        {/* Pipelines: Vessel <-> Yard */}
        <div className="absolute left-[176px] right-[calc(50%+128px)] top-1/2 -translate-y-1/2 h-16 pointer-events-none flex flex-col justify-center gap-4 px-4">
          <Pipeline direction="right" value={forecast.vesselImport} label="Vessel Import" className="relative w-full" />
          <Pipeline direction="left" value={forecast.vesselExport} label="Vessel Export" className="relative w-full" />
        </div>

        {/* Pipelines: Yard <-> Truck Gate */}
        <div className="absolute left-[calc(50%+128px)] right-[176px] top-1/4 -translate-y-1/2 h-16 pointer-events-none flex flex-col justify-center gap-4 px-4">
          <Pipeline direction="left" value={forecast.truckUnloading} label="Truck Unloading" className="relative w-full" />
          <Pipeline direction="right" value={forecast.truckLoading} label="Truck Loading" className="relative w-full" />
        </div>

        {/* Pipelines: Yard <-> Rail Ramp */}
        <div className="absolute left-[calc(50%+128px)] right-[176px] top-3/4 -translate-y-1/2 h-16 pointer-events-none flex flex-col justify-center gap-4 px-4">
          <Pipeline direction="left" value={forecast.trainUnloading} label="Train Unloading" className="relative w-full" />
          <Pipeline direction="right" value={forecast.trainLoading} label="Train Loading" className="relative w-full" />
        </div>

      </div>
    </div>
  );
};
