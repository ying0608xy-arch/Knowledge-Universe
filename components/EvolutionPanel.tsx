
import React, { useState } from 'react';
import { DnaHistoryPoint } from '../types';
import { TraitResult } from '../utils/traitAnalysis';
import CognitiveDna from './CognitiveDna';
import { TrendingUp, Calendar, Zap, Activity, Focus, X, History } from 'lucide-react';

interface EvolutionPanelProps {
  history: DnaHistoryPoint[];
  traitData: TraitResult; // NEW: Current real-time state
  onClose: () => void;    // NEW: Control to close the panel
}

const EvolutionPanel: React.FC<EvolutionPanelProps> = ({ history, traitData, onClose }) => {
  const [timeRange, setTimeRange] = useState<'WEEK' | 'MONTH' | 'YEAR'>('WEEK');

  // Simple SVG Line Chart generator
  const renderChart = (trait: 'energy' | 'focus' | 'temperature', color: string) => {
    if (history.length < 2) return null;
    
    const height = 60;
    const maxVal = 1;
    
    const points = history.map((h, i) => {
      const x = (i / (history.length - 1)) * 100;
      const val = h.visualState[trait];
      const y = height - (val / maxVal) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative h-[60px] w-full mt-2">
         <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 100 ${height}`}>
            {/* Gradient Fill */}
            <defs>
              <linearGradient id={`grad-${trait}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`M0,${height} L${points} L100,${height} Z`} fill={`url(#grad-${trait})`} />
            {/* Line */}
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots */}
            {history.map((h, i) => {
               const val = h.visualState[trait];
               const cx = (i / (history.length - 1)) * 100;
               const cy = height - (val / maxVal) * height;
               return <circle key={i} cx={cx} cy={cy} r="2" fill="white" className="opacity-0 group-hover:opacity-100 transition-opacity" />
            })}
         </svg>
      </div>
    );
  };

  const calculateChange = (trait: 'energy' | 'focus' | 'temperature') => {
    if (history.length < 2) return 0;
    const first = history[0].visualState[trait];
    const last = history[history.length - 1].visualState[trait];
    return Math.round(((last - first) / first) * 100);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b1221]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl animate-slide-left w-full max-w-lg ml-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
         <div className="flex items-center gap-2 text-slate-200">
            <History size={18} className="text-[hsl(var(--theme-hue),60%,70%)]" />
            <h2 className="font-bold text-sm uppercase tracking-wider">演化视图 (Evolution)</h2>
         </div>
         <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-20">
        
        {/* Section 1: Real-time State (Cognitive DNA) */}
        <section>
            <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity size={12} /> 实时状态快照
            </h3>
            <CognitiveDna traitData={traitData} />
        </section>

        {/* Section 2: Historical Trends */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={12} /> 历史演变趋势
                </h3>
                <div className="flex bg-white/5 rounded-lg p-0.5">
                    {['WEEK', 'MONTH', 'YEAR'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range as any)}
                        className={`px-2 py-1 rounded-md text-[9px] font-mono transition-all ${timeRange === range ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {range === 'WEEK' ? '周' : range === 'MONTH' ? '月' : '年'}
                    </button>
                    ))}
                </div>
            </div>

            {/* AI Summary */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 mb-4">
                <h3 className="text-xs text-purple-300 font-bold mb-2 flex items-center gap-2">
                    <Calendar size={12} />
                    周期总结
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed opacity-90">
                    过去一周，你的<strong>思维能量</strong>呈现上升趋势 (+{calculateChange('energy')}%)，表明你正处于一个高产出阶段。
                    与此同时，<strong>专注度</strong>保持在较高水平，说明你有效地控制了信息摄入。
                </p>
            </div>

            {/* Charts Grid */}
            <div className="space-y-4">
                {/* Energy Chart */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider">
                            <Zap size={12} className="text-amber-400" /> 能量 (Energy)
                        </div>
                        <span className="text-xs font-mono text-amber-200">{history[history.length-1].visualState.energy.toFixed(2)}</span>
                    </div>
                    {renderChart('energy', '#fbbf24')}
                </div>

                {/* Focus Chart */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider">
                            <Focus size={12} className="text-emerald-400" /> 专注度 (Focus)
                        </div>
                        <span className="text-xs font-mono text-emerald-200">{history[history.length-1].visualState.focus.toFixed(2)}</span>
                    </div>
                    {renderChart('focus', '#34d399')}
                </div>

                {/* Temperature Chart */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider">
                            <Activity size={12} className="text-cyan-400" /> 情感温度 (Temp)
                        </div>
                        <span className="text-xs font-mono text-cyan-200">{history[history.length-1].visualState.temperature.toFixed(2)}</span>
                    </div>
                    {renderChart('temperature', '#22d3ee')}
                </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-slate-600 px-2 mt-2">
                {history.map((h,i) => <span key={i}>{h.date}</span>)}
            </div>
        </section>

      </div>
    </div>
  );
};

export default EvolutionPanel;
