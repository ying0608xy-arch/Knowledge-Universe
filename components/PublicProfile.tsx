
import React, { useMemo, useState } from 'react';
import UniverseGraph from './UniverseGraph';
import CognitiveDna from './CognitiveDna';
import { UniverseState } from '../types';
import { analyzeCognitiveTraits } from '../utils/traitAnalysis';
import { generateThemeVariables } from '../utils/theme';
import { X, Globe, Lock, Activity, Radio, Fingerprint, GitMerge, Zap, Network, Share2, Users, Copy, Check, Download, Sparkles, Compass, Hexagon, Quote, Command } from 'lucide-react';

interface PublicProfileProps {
  state: UniverseState;
  viewerState?: UniverseState; 
  onClose: () => void;
  onVisitFriend?: () => void;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ state, viewerState, onClose, onVisitFriend }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Metrics
  const totalCards = state.cards.length;
  const publicCards = state.cards.filter(c => c.isPublic);
  const privateCount = totalCards - publicCards.length;

  // Signature
  const coreFrequency = state.structure.name;
  const subFrequencies = state.structure.children?.map(c => c.name) || [];

  // Traits Analysis
  const traitData = useMemo(() => analyzeCognitiveTraits(state.visualState), [state.visualState]);

  // Theme Generation (Fix for missing colors)
  const themeVariables = useMemo(() => {
    return generateThemeVariables(state.visualState);
  }, [state.visualState]);

  // Resonance
  const resonanceData = useMemo(() => {
    if (!viewerState) return null;
    const profileKeywords = new Set([state.coreTheme, ...(state.structure.children?.map(c => c.name) || [])]);
    const viewerKeywords = [viewerState.coreTheme, ...(viewerState.structure.children?.map(c => c.name) || [])];
    const commonTopics = viewerKeywords.filter(k => profileKeywords.has(k));
    const topicMatchScore = (commonTopics.length / Math.max(1, profileKeywords.size)) * 50; 
    const energyDiff = Math.abs(state.visualState.energy - viewerState.visualState.energy);
    const energyScore = (1 - energyDiff) * 30; 
    const baseScore = 20; 
    const totalResonance = Math.min(99, Math.round(topicMatchScore + energyScore + baseScore));
    return { score: totalResonance, commonTopics };
  }, [state, viewerState]);

  const handleCopyLink = () => {
    const mockUrl = `https://knowledge-universe.app/u/${state.coreTheme.substring(0,2)}-${Math.floor(Math.random()*1000)}`;
    navigator.clipboard.writeText(mockUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] font-sans text-slate-200 animate-fade-in flex flex-col md:flex-row transition-colors duration-1000"
      style={{
        ...themeVariables,
        backgroundColor: 'hsl(var(--theme-bg-h), var(--theme-bg-s), 5%)'
      }}
    >
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <UniverseGraph structure={state.structure} visualState={state.visualState} />
         {/* Vignette Overlay using Theme Colors for better blend */}
         <div 
            className="absolute inset-0 pointer-events-none"
            style={{
                background: `linear-gradient(to right, 
                    hsl(var(--theme-bg-h), var(--theme-bg-s), 5%) 0%, 
                    hsla(var(--theme-bg-h), var(--theme-bg-s), 5%, 0.1) 50%, 
                    hsl(var(--theme-bg-h), var(--theme-bg-s), 5%) 100%)`
            }}
         />
         <div className="absolute inset-0 bg-black/20 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* LEFT COLUMN: Hero & Navigation (Fixed on Desktop) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 lg:w-3/5 h-full p-12 z-20 pointer-events-none relative">
         <div className="pointer-events-auto inline-flex">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-md shadow-lg">
              <Globe size={14} className="text-[hsl(var(--theme-hue),60%,70%)]" />
              <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">公开频率</span>
            </div>
         </div>
         
         <div className="pl-6 border-l border-white/10 relative">
            <h1 className="text-6xl lg:text-8xl font-thin tracking-tighter text-white drop-shadow-2xl">
               {coreFrequency}
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
                {subFrequencies.map((tag, i) => (
                    <span key={i} className="text-xs font-mono px-3 py-1.5 rounded-md bg-white/5 border border-white/5 text-slate-300 uppercase tracking-wider backdrop-blur-sm">
                        {tag}
                    </span>
                ))}
            </div>
         </div>

         {/* Bottom Action Area */}
         <div className="pointer-events-auto mt-auto pt-12">
           {onVisitFriend && (
               <button 
                 onClick={onVisitFriend}
                 className="group flex items-center gap-4 p-1 pr-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md"
               >
                   <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      <Users size={18} />
                   </div>
                   <div className="text-left">
                      <div className="text-xs text-indigo-100 font-medium">访问: 创意工程师</div>
                   </div>
                   <div className="ml-4 text-[10px] opacity-50 group-hover:translate-x-1 transition-transform">
                      →
                   </div>
               </button>
           )}
         </div>
      </div>

      {/* RIGHT COLUMN: Content Feed (Scrollable) */}
      <div className="w-full md:w-1/2 lg:w-2/5 h-full z-20 flex flex-col bg-black/60 backdrop-blur-xl border-l border-white/5 shadow-2xl">
         
         {/* Sticky Header */}
         <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 bg-black/60 backdrop-blur-xl border-b border-white/5">
            <div className="md:hidden flex items-center gap-2">
               <Globe size={14} className="text-[hsl(var(--theme-hue),60%,70%)]" />
               <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">公开视图</span>
            </div>
            <div className="hidden md:block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
               宇宙快照序列
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsShareOpen(true)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 transition-all border border-white/5"
              >
                <Share2 size={14} />
                <span className="text-[10px] font-medium hidden sm:inline">分享</span>
              </button>

              <button 
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
              >
                <X size={16} />
              </button>
            </div>
         </div>

         {/* Scrollable Content */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-10">

            {/* Mobile Hero (Only visible on mobile) */}
            <div className="md:hidden animate-slide-up">
               <h1 className="text-4xl font-light text-white mb-4 leading-tight">{coreFrequency}</h1>
               <div className="flex flex-wrap gap-2">
                  {subFrequencies.map(tag => (
                     <span key={tag} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">
                        {tag}
                     </span>
                  ))}
               </div>
            </div>

            {/* 1. Identity Matrix (Cards) */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Hexagon size={10} className="text-[hsl(var(--theme-hue),50%,50%)]" /> 身份矩阵
                  </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-white/10 transition-colors">
                      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                          <Activity size={20} />
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">公开广播</span>
                      <div>
                          <span className="text-3xl font-light text-white tracking-tight">{publicCards.length}</span>
                          <span className="text-xs text-slate-500 ml-1 font-mono">/ {totalCards}</span>
                      </div>
                      {/* Micro-chart */}
                      <div className="flex items-end gap-1 h-6 mt-1 opacity-50">
                          {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8].map((h, i) => (
                             <div key={i} className="flex-1 bg-cyan-400 rounded-sm" style={{ height: `${h * 100}%`, opacity: 0.5 + (i/10) }}></div>
                          ))}
                      </div>
                   </div>

                   <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-white/10 transition-colors">
                      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                          <Fingerprint size={20} />
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">认知连贯性</span>
                      <div>
                          <span className="text-3xl font-light text-white tracking-tight">{Math.round(state.visualState.energy * 100)}</span>
                          <span className="text-xs text-slate-500 ml-1">%</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-auto">
                          <div className="h-full bg-purple-400" style={{ width: `${state.visualState.energy * 100}%` }}></div>
                      </div>
                   </div>
              </div>

              {/* Cognitive DNA */}
              <div className="mt-3">
                <CognitiveDna traitData={traitData} className="border-white/5 bg-white/5" />
              </div>
            </div>

            {/* 2. Cosmic Guidance */}
            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
               <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                    <div className="flex gap-4 relative z-10">
                        <div className="mt-1 min-w-[32px] h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                            <Compass size={16} />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">来自虚空的低语</h3>
                            <p className="text-sm text-amber-100/80 leading-relaxed font-light italic">
                                "{traitData.guidance}"
                            </p>
                        </div>
                    </div>
               </div>
            </div>

            {/* 3. Resonance (If Friend) */}
            {resonanceData && (
              <div className="animate-slide-up" style={{ animationDelay: '0.18s' }}>
                  <div className="rounded-xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-transparent p-5 relative overflow-hidden">
                     <div className="flex items-start justify-between relative z-10">
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                              <GitMerge size={14} className="text-pink-400" />
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-300">
                                 神经共鸣
                              </span>
                           </div>
                           <h3 className="text-3xl font-light text-white flex items-baseline gap-2">
                              {resonanceData.score}% 
                           </h3>
                        </div>
                        <div className="p-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 animate-pulse">
                           <Network size={18} />
                        </div>
                     </div>
                     <div className="mt-3 flex flex-wrap gap-2">
                         {resonanceData.commonTopics.map(topic => (
                             <span key={topic} className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-pink-200 text-[10px]">
                               <Zap size={8} className="fill-current" />
                               {topic}
                             </span>
                         ))}
                     </div>
                  </div>
              </div>
            )}

            {/* 4. Public Feed */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
               <div className="flex items-center gap-3 mb-6 opacity-70">
                  <Radio size={16} className="text-[hsl(var(--theme-hue),60%,70%)] animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-300">广播流</span>
               </div>

               <div className="space-y-6 relative border-l border-white/10 pl-6 ml-2">
                  {publicCards.length > 0 ? publicCards.map((card) => (
                     <div key={card.id} className="relative group">
                        {/* Timeline Node */}
                        <div className="absolute -left-[31px] top-2 w-2.5 h-2.5 rounded-full bg-black border border-slate-600 group-hover:border-[hsl(var(--theme-hue),60%,70%)] group-hover:scale-125 transition-all z-10"></div>
                        
                        <div className="mb-2">
                           <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300 font-mono tracking-wide uppercase">{card.type}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{card.timestamp}</span>
                           </div>
                           <h3 className="text-lg text-slate-100 font-normal leading-snug group-hover:text-[hsl(var(--theme-hue),60%,80%)] transition-colors">
                              {card.title}
                           </h3>
                        </div>
                        <div className="text-sm text-slate-400 font-light leading-relaxed p-4 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all">
                           {card.content.map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
                        </div>
                     </div>
                  )) : (
                     <div className="py-8 text-slate-600 italic text-sm font-mono border-l-2 border-slate-800 pl-4">此扇区未检测到公开信号。</div>
                  )}
               </div>
            </div>

            {/* 5. Dark Matter / Encrypted Sector (Premium Visual) */}
            {privateCount > 0 && (
               <div className="mt-8 pt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <div className="relative rounded-2xl overflow-hidden group cursor-not-allowed border border-white/5 hover:border-white/10 transition-colors">
                     {/* Dynamic Background */}
                     <div className="absolute inset-0 bg-black/40 z-10"></div>
                     <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-950 z-0"></div>
                     <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-0 mix-blend-overlay"></div>
                     
                     <div className="relative z-20 p-8 flex flex-col items-center justify-center text-center">
                        <div className="mb-4 p-4 rounded-full bg-black/50 border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500 backdrop-blur-sm">
                           <Lock size={20} className="text-slate-500" />
                        </div>
                        
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                           检测到暗物质场
                        </h4>
                        
                        <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-light">
                           观测到 <span className="text-slate-300 font-mono mx-1">{privateCount}</span> 个高密度思想奇点。
                           <br/>由于量子观测协议，具体波函数尚未坍缩（不可见）。
                        </p>
                     </div>
                  </div>
               </div>
            )}

            <div className="pt-20 pb-10 flex flex-col items-center justify-center opacity-30 text-center">
               <Globe size={14} className="mb-2" />
               <p className="text-[10px] font-mono tracking-widest uppercase">Knowledge Universe Protocol</p>
            </div>

         </div>
      </div>

      {/* SHARE MODAL - PREMIUM REDESIGN */}
      {isShareOpen && (
        <div className="absolute inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
           <div 
             className="bg-[#0b1221] w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                 <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                    <Command size={14} className="text-[hsl(var(--theme-hue),60%,70%)]" />
                    Share Preview
                 </h3>
                 <button onClick={() => setIsShareOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                    <X size={16} />
                 </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                 
                 {/* PREVIEW CARD: PREMIUM VERTICAL LAYOUT */}
                 <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group select-none">
                     
                     {/* 1. Cinematic Background Layer */}
                     <div className="absolute inset-0 bg-[#050505] z-0"></div>
                     <div className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-black opacity-60 z-0"></div>
                     <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[60%] bg-[hsl(var(--theme-hue),60%,50%)] rounded-full blur-[120px] opacity-20 z-0 mix-blend-screen"></div>
                     <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-0"></div>
                     
                     {/* Noise Texture */}
                     <div className="absolute inset-0 opacity-[0.07] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 pointer-events-none mix-blend-overlay"></div>

                     {/* 2. Content Layer */}
                     <div className="relative z-10 h-full flex flex-col justify-between p-8">
                        
                        {/* Top: Metadata */}
                        <div className="flex justify-between items-start opacity-60">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-white">Knowledge Universe</span>
                                <span className="text-[8px] font-mono text-slate-400">{new Date().toLocaleDateString()}</span>
                            </div>
                            <Sparkles size={14} className="text-white/80" />
                        </div>

                        {/* Middle: Hero Content */}
                        <div className="flex flex-col items-center text-center space-y-6 mt-4">
                            
                            {/* Visual Anchor */}
                            <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]">
                                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_2px_white] animate-pulse"></div>
                            </div>

                            {/* Core Theme */}
                            <h2 className="text-4xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 leading-tight">
                                {coreFrequency}
                            </h2>

                            {/* The Daily Signature (Hero Feature) */}
                            <div className="relative pt-4 pb-2">
                                <Quote size={12} className="absolute -top-1 left-1/2 -translate-x-1/2 text-white/20 fill-current" />
                                <p className="font-serif italic text-lg text-indigo-100/90 leading-relaxed max-w-[240px]">
                                   "{state.dailySignature?.text || "The universe is silent, yet full of answers."}"
                                </p>
                            </div>
                        </div>

                        {/* Bottom: Footer Stats */}
                        <div className="flex items-end justify-between border-t border-white/10 pt-4 mt-2">
                             
                             {/* Archetype Tag */}
                             <div className="flex flex-col gap-1">
                                 <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Archetype</span>
                                 <span className="text-[10px] px-2 py-0.5 rounded border border-white/20 bg-white/5 text-slate-200 uppercase tracking-wider backdrop-blur-md self-start">
                                    {traitData.dominantTag}
                                 </span>
                             </div>

                             {/* Minimal Indicators */}
                             <div className="flex gap-3">
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Energy</span>
                                    <div className="flex gap-0.5">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className={`w-0.5 h-2 rounded-full ${i/4 <= state.visualState.energy ? 'bg-emerald-400' : 'bg-white/10'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Focus</span>
                                    <div className="flex gap-0.5">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className={`w-0.5 h-2 rounded-full ${i/4 <= state.visualState.focus ? 'bg-purple-400' : 'bg-white/10'}`}></div>
                                        ))}
                                    </div>
                                </div>
                             </div>

                        </div>
                     </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="mt-6 space-y-3">
                    <button 
                         onClick={handleCopyLink}
                         className="w-full py-3 rounded-xl bg-white text-black font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors shadow-lg"
                    >
                       {copied ? <Check size={16} /> : <Copy size={16} />}
                       {copied ? 'Link Copied' : 'Copy Private Link'}
                    </button>
                    
                    <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-colors">
                       <Download size={16} />
                       Save Image
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default PublicProfile;
