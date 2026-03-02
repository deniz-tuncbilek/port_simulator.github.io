import React, { useRef, useState, useEffect } from 'react';
import { generateInsights } from '../lib/simulation';
import { DailyForecast } from '../types';
import { Lightbulb, AlertCircle, Info, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface AlertsProps {
  forecasts: DailyForecast[];
  maxCapacity: number;
}

export const Alerts: React.FC<AlertsProps> = ({ forecasts, maxCapacity }) => {
  const insights = generateInsights(forecasts, maxCapacity);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Show indicator if there is scrollable content and we are not at the bottom
      setShowScrollIndicator(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [insights]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-800">Insights & Alerts</h3>
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin pb-4"
      >
        {insights.map((insight, idx) => {
          const isAlarm = insight.includes('exceeded') || insight.includes('constrained');
          const isWarning = insight.includes('Approaching') || insight.includes('trending upward');
          
          return (
            <div 
              key={idx} 
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border text-sm shrink-0",
                isAlarm ? "bg-rose-50 border-rose-200 text-rose-800" :
                isWarning ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-blue-50 border-blue-200 text-blue-800"
              )}
            >
              {isAlarm ? (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
              ) : isWarning ? (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              ) : (
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
              )}
              <span className="leading-tight font-medium">{insight}</span>
            </div>
          );
        })}
      </div>

      {showScrollIndicator && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none flex items-end justify-center pb-2">
          <ChevronDown className="w-5 h-5 text-slate-400 animate-bounce" />
        </div>
      )}
    </div>
  );
};
