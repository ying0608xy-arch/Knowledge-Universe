import React, { useState } from 'react';
import { ContentType, InsightCardData } from '../types';
import { MessageSquare, FileText, Layers, Clock, Zap, GitCommit, ChevronDown, Eye, EyeOff } from 'lucide-react';

interface InsightCardProps {
  card: InsightCardData;
  onTogglePublic: (id: string) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ card, onTogglePublic }) => {
  const [isTraceOpen, setIsTraceOpen] = useState(false);

  // Refined Icon Colors (Desaturated)
  const getIcon = () => {
    switch (card.type) {
      case ContentType.VIEWPOINT: return <MessageSquare size={14} className="text-[hsl(var(--theme-hue),60%,70%)]" />;
      case ContentType.SUMMARY: return <FileText size={14} className="text-emerald-400/80" />; 
      case ContentType.COLLECTION: return <Layers size={14} className="text-indigo-400/80" />;
      case ContentType.TIMELINE: return <Clock size={14} className="text-amber-400/80" />;
      case ContentType.INSPIRATION: return <Zap size={14} className="text-rose-400/80" />;
      default: return <FileText size={14} />;
    }
  };

  const getLabel = () => {
    switch (card.type) {
      case ContentType.VIEWPOINT: return "观点";
      case ContentType.SUMMARY: return "摘要";
      case ContentType.COLLECTION: return "合集";
      case ContentType.TIMELINE: return "轨迹";
      case ContentType.INSPIRATION: return "灵感";
      default: return "笔记";
    }
  };

  return (
    <div 
      className="relative group transition-all duration-500 overflow-hidden"
      style={{
        borderRadius: 'var(--radius-base)',
        marginBottom: 'var(--space-card-gap)',
        backgroundColor: 'var(--surface-glass)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        border: '1px solid var(--surface-glass-border)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Subtle shadow
      }}
    >
      {/* Inner Highlight (Top Gradient) for Glass Effect */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>

      {/* Main Container */}
      <div style={{ padding: 'var(--space-card-inner)' }}>
        
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div 
              className="flex items-center justify-center w-6 h-6 rounded-md bg-white/5 border border-white/5 shadow-inner"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {getIcon()}
            </div>
            <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
              {getLabel()}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500/80">{card.timestamp}</span>
        </div>
        
        {/* Content */}
        <h3 className="text-[15px] font-semibold text-slate-100 mb-3 leading-snug tracking-tight group-hover:text-[hsl(var(--theme-hue),var(--theme-accent-s),85%)] transition-colors">
          {card.title}
        </h3>
        
        <div className="space-y-2 mb-5">
          {card.content.map((line, idx) => (
            <p key={idx} className="text-[13px] text-slate-400 leading-relaxed font-light">
              {line}
            </p>
          ))}
        </div>
        
        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-2">
          {/* Source/Trace Toggle */}
          <button 
            onClick={() => setIsTraceOpen(!isTraceOpen)}
            className="flex items-center gap-2 group/trace focus:outline-none"
          >
             <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors ${isTraceOpen ? 'bg-white/10 text-slate-200' : 'bg-transparent text-slate-500 hover:text-slate-300'}`}>
                <GitCommit size={11} />
                <span className="text-[10px] font-medium tracking-wide">溯源</span>
                <ChevronDown size={10} className={`transform transition-transform duration-300 ${isTraceOpen ? 'rotate-180' : ''}`}/>
             </div>
             
             {card.sourceCount > 1 && !isTraceOpen && (
               <span className="text-[9px] text-slate-600 px-1.5 py-0.5 rounded-full bg-black/20 border border-white/5">
                 +{card.sourceCount - 1}
               </span>
             )}
          </button>

          {/* Privacy Toggle */}
          <button 
            onClick={(e) => { e.stopPropagation(); onTogglePublic(card.id); }}
            className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide border transition-all
              ${card.isPublic 
                ? 'bg-[hsl(var(--theme-hue),30%,20%)] border-[hsl(var(--theme-hue),30%,30%)] text-[hsl(var(--theme-hue),60%,80%)]' 
                : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'}
            `}
          >
            {card.isPublic ? <Eye size={11} /> : <EyeOff size={11} />}
            {card.isPublic ? '已公开' : '私密'}
          </button>
        </div>
      </div>

      {/* Expanded Trace Log */}
      <div 
        className={`overflow-hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isTraceOpen ? 'max-h-40 opacity-100 border-t border-white/5' : 'max-h-0 opacity-0'}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
      >
        <div className="p-4 space-y-3">
           <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-slate-600">
             <div className="w-1 h-1 rounded-full bg-slate-500"></div>
             DATA LINKAGE
           </div>
           
           <div className="space-y-2">
            {card.sources?.map((source) => (
              <div key={source.id} className="flex items-start gap-3 group/log">
                 <div className="w-[1px] h-full bg-white/5 absolute left-[19px] -z-10"></div> 
                 <span className="text-[9px] font-mono text-slate-600 min-w-[32px] pt-0.5">{source.timestamp}</span>
                 <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{source.type}</span>
                       <span className="text-[10px] text-slate-400 group-hover/log:text-slate-200 transition-colors line-clamp-1">{source.summary}</span>
                    </div>
                 </div>
              </div>
            )) || (
               <span className="text-[10px] text-slate-600 italic pl-8">无溯源数据</span>
            )}
           </div>
        </div>
      </div>

    </div>
  );
};

export default InsightCard;