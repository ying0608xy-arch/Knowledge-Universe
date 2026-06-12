
import React, { useState, useEffect, useRef, useMemo } from 'react';
import UniverseGraph from './components/UniverseGraph';
import InsightCard from './components/InsightCard';
import PublicProfile from './components/PublicProfile';
import CognitiveDna from './components/CognitiveDna';
import EvolutionPanel from './components/EvolutionPanel'; 
import ActionCenter from './components/ActionCenter'; 
import { UniverseState } from './types';
import { analyzeInputWithGemini, generateDailySignature, MOCK_DATA, MOCK_FRIEND_DATA } from './services/geminiService';
import { analyzeCognitiveTraits } from './utils/traitAnalysis';
import { generateThemeVariables } from './utils/theme';
import { Send, Eye, RefreshCw, Sparkles, AlertCircle, Activity, Database, Layers, Image as ImageIcon, Link as LinkIcon, Mic, Paperclip, X, Users, Dna, TrendingUp, CheckSquare, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<UniverseState>(MOCK_DATA);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPublic, setShowPublic] = useState(false);
  const [viewingFriend, setViewingFriend] = useState(false); 
  
  // Updated View Modes: Removed 'EVOLUTION'
  const [viewMode, setViewMode] = useState<'STREAM' | 'LOG' | 'ACTIONS'>('STREAM');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  // Replaced showDna with showEvolution
  const [showEvolution, setShowEvolution] = useState(false); 
  
  const [isRegeneratingSig, setIsRegeneratingSig] = useState(false);

  const [activeAttachment, setActiveAttachment] = useState<'IMAGE' | 'LINK' | 'AUDIO' | 'FILE' | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const themeVariables = useMemo(() => {
    return generateThemeVariables(state.visualState);
  }, [state.visualState]);

  const traitData = useMemo(() => analyzeCognitiveTraits(state.visualState), [state.visualState]);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSubmit = async () => {
    if ((!inputValue.trim() && !activeAttachment) || isProcessing) return;
    setIsProcessing(true);
    
    let processedInput = inputValue;
    if (activeAttachment) {
      const prefixes = {
        'IMAGE': '[图片解析] ',
        'LINK': '[链接摘要] ',
        'AUDIO': '[语音转写] ',
        'FILE': '[文件分析] '
      };
      processedInput = `${prefixes[activeAttachment]}${inputValue || '内容已上传...'}`;
    }

    const updatedState = await analyzeInputWithGemini(processedInput, state);
    setState(updatedState);
    setInputValue("");
    setActiveAttachment(null);
    setIsProcessing(false);
    if (viewMode === 'LOG') setViewMode('STREAM');
  };

  const handleRegenerateSignature = async () => {
    setIsRegeneratingSig(true);
    const newSig = await generateDailySignature(state.visualState);
    setState(prev => ({
      ...prev,
      dailySignature: { text: newSig, generatedAt: new Date().toISOString() }
    }));
    setIsRegeneratingSig(false);
  };

  const toggleCardPublic = (cardId: string) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.map(c => 
        c.id === cardId ? { ...c, isPublic: !c.isPublic } : c
      )
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const openMyPublicProfile = () => {
     setViewingFriend(false);
     setShowPublic(true);
  }

  const openFriendProfile = () => {
     setViewingFriend(true);
     setShowPublic(true);
  }

  if (showPublic) {
    return (
      <PublicProfile 
         state={viewingFriend ? MOCK_FRIEND_DATA : state} 
         viewerState={viewingFriend ? state : undefined} 
         onClose={() => setShowPublic(false)} 
         onVisitFriend={!viewingFriend ? openFriendProfile : undefined} 
      />
    );
  }

  return (
    <div 
      className="flex h-screen w-full overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-100 transition-colors duration-[1500ms]"
      style={{
        ...themeVariables,
        backgroundColor: 'hsl(var(--theme-bg-h), var(--theme-bg-s), var(--theme-bg-l))', 
        color: 'hsl(var(--theme-hue), 10%, 90%)'
      }}
    >
      
      {/* LEFT: Universe Visualization (The "Interface") */}
      <div 
        className="hidden md:flex flex-col w-1/2 lg:w-3/5 h-full relative border-r border-white/5 transition-colors duration-[1500ms] bg-black/20"
      >
        {/* Navigation / Header */}
        <div className="absolute top-8 left-8 z-10 w-full max-w-md pointer-events-none">
          <div className="pointer-events-auto">
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2 font-mono text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
              <Sparkles size={16} className="text-[hsl(var(--theme-hue),60%,70%)]"/>
              知识宇宙 (Knowledge Universe)
            </h1>
            
            {/* Feature 2: Daily Signature */}
            <div className="mt-4 flex items-start gap-3 group">
                <div className="w-[2px] h-8 bg-gradient-to-b from-[hsl(var(--theme-hue),60%,70%)] to-transparent opacity-50"></div>
                <div>
                   <p className="text-xs text-slate-400 font-light italic leading-relaxed max-w-xs">
                      "{state.dailySignature?.text}"
                   </p>
                   <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-mono text-slate-600 uppercase">
                         今日特质 · {new Date(state.dailySignature?.generatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <button 
                        onClick={handleRegenerateSignature}
                        disabled={isRegeneratingSig}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                         <RotateCcw size={10} className={`text-slate-500 ${isRegeneratingSig ? 'animate-spin' : ''}`} />
                      </button>
                   </div>
                </div>
            </div>
          </div>
        </div>

        <div className="absolute top-8 right-8 z-30 flex gap-2">
           {/* Toggle Evolution Panel */}
           <button 
            onClick={() => setShowEvolution(!showEvolution)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono border transition-all hover:scale-105 active:scale-95 backdrop-blur-md ${showEvolution ? 'bg-[hsl(var(--theme-hue),30%,20%)] border-[hsl(var(--theme-hue),30%,50%)] text-white' : 'bg-black/10 hover:bg-white/5 border-white/5 text-slate-400'}`}
          >
            <Dna size={12} />
            {showEvolution ? '关闭演化' : '演化视图'}
          </button>
          
          <button 
            onClick={openMyPublicProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono border border-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-md bg-black/20 hover:bg-white/5 text-slate-300"
          >
            <Eye size={12} />
            我的公开页
          </button>
        </div>

        <div className="flex-1 w-full h-full relative z-0 overflow-hidden">
          <UniverseGraph structure={state.structure} visualState={state.visualState} />
        </div>

        {/* Evolution Overlay Panel - MOVED HERE (Outside flex-1 container for proper Z-indexing) */}
        {showEvolution && (
            <div className="absolute inset-0 z-50 flex justify-end animate-[fadeIn_0.3s_ease-out] bg-black/40 backdrop-blur-[2px]">
                {/* Click outside to close */}
                <div className="absolute inset-0 z-0" onClick={() => setShowEvolution(false)}></div>
                
                {/* Panel Slider */}
                <div className="relative z-10 h-full w-full max-w-lg">
                  <EvolutionPanel 
                     history={state.dnaHistory} 
                     traitData={traitData} 
                     onClose={() => setShowEvolution(false)} 
                  />
                </div>
            </div>
        )}

        {/* Status Bar */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-10 border-t border-white/5 backdrop-blur-sm flex items-center justify-between px-8 text-[9px] font-mono uppercase tracking-widest z-10 bg-black/10"
        >
           <span className="flex items-center gap-2">
             <Activity size={10} className="text-emerald-500 animate-pulse"/> 
             系统在线
           </span>
           <span className="opacity-40">核心: {state.coreTheme}</span>
           <span className="opacity-40">上次同步: {new Date(state.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* RIGHT: Input & Feed & Actions */}
      <div 
        className="w-full md:w-1/2 lg:w-2/5 h-full flex flex-col relative border-l border-white/5 shadow-2xl transition-colors duration-[1500ms] backdrop-blur-xl bg-[rgba(10,10,15,0.4)]"
      >
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-black/60 backdrop-blur-lg">
           <h1 className="font-bold text-sm font-mono tracking-wide text-slate-200">知识宇宙</h1>
           <div className="flex gap-2">
              <button onClick={openFriendProfile} className="p-2 bg-white/5 rounded text-slate-200">
                <Users size={16} />
              </button>
              <button onClick={openMyPublicProfile} className="p-2 bg-white/5 rounded text-slate-200">
                <Eye size={16} />
              </button>
           </div>
        </div>
        
        {/* Mobile Universe Preview */}
        <div className="md:hidden h-48 w-full border-b border-white/10 bg-black/60 relative overflow-hidden">
           <UniverseGraph structure={state.structure} visualState={state.visualState} />
        </div>

        {/* Improved Navigation / Toggle View */}
        <div 
          className="flex items-center justify-between px-6 py-5 border-b border-white/5 transition-colors duration-[1500ms] overflow-x-auto"
        >
           <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/5 shadow-inner">
              <button 
                onClick={() => setViewMode('STREAM')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-[10px] font-medium transition-all ${viewMode === 'STREAM' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Layers size={12} /> 宇宙流
              </button>
              {/* Removed EVOLUTION from here */}
              <button 
                onClick={() => setViewMode('ACTIONS')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-[10px] font-medium transition-all ${viewMode === 'ACTIONS' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <CheckSquare size={12} /> 行动
              </button>
              <button 
                onClick={() => setViewMode('LOG')}
                className={`px-2 py-1.5 rounded-md flex items-center gap-2 text-[10px] font-medium transition-all ${viewMode === 'LOG' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Database size={12} />
              </button>
           </div>
        </div>

        {/* Content Area Container */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* VIEW: STREAM (Default) */}
          {viewMode === 'STREAM' && (
             <div className="h-full overflow-y-auto custom-scrollbar p-[var(--space-page)]">
                <div className="space-y-[var(--space-card-gap)] pb-20">
                  {state.cards.map((card) => (
                    <InsightCard 
                      key={card.id} 
                      card={card} 
                      onTogglePublic={toggleCardPublic}
                    />
                  ))}
                </div>
             </div>
          )}

          {/* VIEW: ACTIONS (Feature 3) */}
          {viewMode === 'ACTIONS' && (
             <ActionCenter tasks={state.tasks} topics={state.trackedTopics} />
          )}

          {/* VIEW: LOG */}
          {viewMode === 'LOG' && (
             <div className="h-full overflow-y-auto custom-scrollbar p-[var(--space-page)]">
                <div className="space-y-1 font-mono text-xs pb-20">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
                    <span className="text-[10px] opacity-50 uppercase tracking-widest">原始输入记录 ({state.rawLog.length})</span>
                  </div>
                  {state.rawLog.map((log) => (
                    <div key={log.id} className="group flex gap-4 p-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-default">
                        <div className="flex flex-col gap-1 min-w-[50px] text-[10px] opacity-40 group-hover:opacity-70">
                          <span>{log.timestamp}</span>
                        </div>
                        <div className="flex-1">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] bg-white/5 opacity-60 font-bold tracking-wider mb-2 text-slate-300">
                              {log.type}
                          </span>
                          <p className="text-slate-300 opacity-80 leading-relaxed text-sm">{log.summary}</p>
                        </div>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>

        {/* FLOATING INPUT DOCK */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
           <div className="pointer-events-auto">
             {apiKeyMissing && (
              <div className="mb-4 flex items-center gap-2 text-amber-400 text-[10px] font-mono bg-amber-900/10 p-2 rounded border border-amber-900/20 backdrop-blur-md justify-center">
                <AlertCircle size={10} />
                <span>演示模式：请添加 API_KEY 以启用 AI 分析。</span>
              </div>
            )}

            <div 
              className={`
                relative flex flex-col rounded-2xl border transition-all duration-300 group shadow-2xl
                ${isProcessing ? 'opacity-70' : 'opacity-100'}
                focus-within:border-[hsl(var(--theme-hue),50%,40%)] focus-within:ring-1 focus-within:ring-[hsl(var(--theme-hue),50%,40%,0.3)]
              `}
              style={{
                borderColor: 'var(--surface-glass-border)',
                backgroundColor: 'rgba(10, 10, 15, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Active Attachment Badge */}
              {activeAttachment && (
                <div className="px-3 pt-3 flex animate-fade-in">
                  <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300">
                    {activeAttachment === 'IMAGE' && <ImageIcon size={12} />}
                    {activeAttachment === 'LINK' && <LinkIcon size={12} />}
                    {activeAttachment === 'AUDIO' && <Mic size={12} />}
                    {activeAttachment === 'FILE' && <Paperclip size={12} />}
                    <span className="font-mono uppercase tracking-wide">{activeAttachment} 模式</span>
                    <button onClick={() => setActiveAttachment(null)} className="hover:text-white ml-2"><X size={10}/></button>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2 p-2">
                {/* Tools Left */}
                <div className="flex gap-1 pb-1">
                  {[
                    { type: 'IMAGE', Icon: ImageIcon },
                    { type: 'LINK', Icon: LinkIcon },
                    { type: 'AUDIO', Icon: Mic }
                  ].map(({ type, Icon }) => (
                    <button 
                        key={type}
                        onClick={() => setActiveAttachment(type as any)} 
                        className={`p-2.5 rounded-xl transition-all ${activeAttachment === type ? 'bg-[hsl(var(--theme-hue),30%,25%)] text-white' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>

                {/* Input */}
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder={activeAttachment ? "添加描述..." : "输入想法、粘贴链接或上传文件..."}
                  className="flex-1 bg-transparent text-[14px] text-slate-200 py-3 max-h-[120px] outline-none resize-none placeholder:text-slate-600 font-sans leading-relaxed"
                  style={{ minHeight: '44px' }}
                />

                {/* Send Button */}
                <button
                  onClick={handleSubmit}
                  disabled={(!inputValue.trim() && !activeAttachment) || isProcessing}
                  className={`
                    p-2.5 rounded-xl flex items-center justify-center transition-all mb-0.5
                    ${(!inputValue.trim() && !activeAttachment) || isProcessing ? 'opacity-30 cursor-not-allowed bg-white/5 text-slate-500' : 'hover:scale-105 active:scale-95 bg-[hsl(var(--theme-hue),50%,40%)] text-white shadow-lg'}
                  `}
                >
                  {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between px-2 mt-2 opacity-40">
              <span className="text-[9px] text-slate-400 font-mono">CMD+ENTER 发送</span>
              <span className="text-[9px] text-slate-400 font-mono">Secure Connection</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
