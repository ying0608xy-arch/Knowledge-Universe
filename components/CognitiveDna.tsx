import React from 'react';
import { Dna, ScanLine } from 'lucide-react';
import { TraitResult } from '../utils/traitAnalysis';

interface CognitiveDnaProps {
  traitData: TraitResult;
  className?: string;
}

const CognitiveDna: React.FC<CognitiveDnaProps> = ({ traitData, className = "" }) => {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-md ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2">
            <Dna size={16} className="text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-100">认知 DNA</span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-900/30 text-cyan-200 border border-cyan-500/20 font-mono uppercase">
            {traitData.dominantTag}
          </span>
      </div>

      <div className="p-6">
          {/* Archetype Title */}
          <div className="mb-6 flex items-start gap-4">
            <div className="p-3 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <ScanLine size={24} strokeWidth={1.5} />
            </div>
            <div>
                <h3 className="text-lg text-white font-light mb-1">{traitData.archetype}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {traitData.description}
                </p>
            </div>
          </div>

          {/* Trait Bars */}
          <div className="space-y-4">
            {traitData.traits.map((trait, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase mb-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      <span>{trait.leftLabel}</span>
                      <span className="text-slate-400 font-bold">{trait.label}</span>
                      <span>{trait.rightLabel}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden relative">
                      {/* Indicator Line */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_white] z-10 transition-all duration-1000"
                        style={{ left: `${trait.value * 100}%` }}
                      />
                      {/* Filled Bar (Gradient) */}
                      <div 
                        className="h-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-60"
                        style={{ width: '100%' }}
                      />
                  </div>
                </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default CognitiveDna;