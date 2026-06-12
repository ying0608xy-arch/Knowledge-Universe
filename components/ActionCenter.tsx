
import React, { useState } from 'react';
import { TaskItem, TopicInterest } from '../types';
import { CheckCircle2, Circle, ListTodo, Radio, ChevronRight, Newspaper, ArrowRight } from 'lucide-react';

interface ActionCenterProps {
  tasks: TaskItem[];
  topics: TopicInterest[];
}

const ActionCenter: React.FC<ActionCenterProps> = ({ tasks, topics }) => {
  const [activeTab, setActiveTab] = useState<'TASKS' | 'RADAR'>('TASKS');
  // Local state to simulate checking tasks for UI responsiveness
  const [localTasks, setLocalTasks] = useState(tasks);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setLocalTasks(prev => prev.map(t => 
       t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : t
    ));
  };

  return (
    <div className="flex flex-col h-full animate-fade-in overflow-hidden">
      
      {/* Tab Switcher */}
      <div className="flex items-center border-b border-white/5 px-6 pt-4 pb-0 gap-6">
         <button 
           onClick={() => setActiveTab('TASKS')}
           className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'TASKS' ? 'text-white border-cyan-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
         >
            <ListTodo size={14} /> 待办行动
            <span className="bg-white/10 text-[9px] px-1.5 rounded-full text-slate-300">{localTasks.filter(t => t.status === 'PENDING').length}</span>
         </button>
         <button 
           onClick={() => setActiveTab('RADAR')}
           className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 border-b-2 ${activeTab === 'RADAR' ? 'text-white border-purple-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
         >
            <Radio size={14} /> 话题雷达
            {topics.some(t => t.newsFlash) && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
         </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-20">
         
         {/* TASKS VIEW */}
         {activeTab === 'TASKS' && (
           <div className="space-y-3">
              <p className="text-[10px] text-slate-500 font-mono mb-4 uppercase">
                 AI 已从你的输入中自动拆解以下任务：
              </p>
              
              {localTasks.length === 0 && (
                <div className="text-center py-10 opacity-30">
                   <ListTodo size={32} className="mx-auto mb-2" />
                   <p className="text-xs">暂无待办</p>
                </div>
              )}

              {localTasks.map(task => (
                 <div 
                   key={task.id} 
                   className={`rounded-xl border transition-all duration-300 ${task.status === 'COMPLETED' ? 'bg-white/[0.02] border-white/5 opacity-50' : 'bg-white/5 border-white/10 hover:border-cyan-500/30'}`}
                 >
                    <div 
                      className="p-4 flex items-start gap-3 cursor-pointer"
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    >
                       <button 
                         onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                         className={`mt-0.5 ${task.status === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-500 hover:text-cyan-400'}`}
                       >
                          {task.status === 'COMPLETED' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                       </button>
                       <div className="flex-1">
                          <h4 className={`text-sm ${task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                             {task.title}
                          </h4>
                          {task.subTasks && task.subTasks.length > 0 && (
                             <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                                <span>{task.subTasks.length} 个子步骤</span>
                                <ChevronRight size={10} className={`transition-transform ${expandedTask === task.id ? 'rotate-90' : ''}`} />
                             </div>
                          )}
                       </div>
                    </div>
                    
                    {/* Expanded Breakdown */}
                    {expandedTask === task.id && task.subTasks && (
                       <div className="px-4 pb-4 pl-10 space-y-2 animate-slide-up">
                          <div className="h-[1px] w-full bg-white/5 mb-3"></div>
                          {task.subTasks.map((sub, idx) => (
                             <div key={idx} className="flex items-center gap-2 text-xs text-slate-400 font-light">
                                <div className="w-1 h-1 rounded-full bg-cyan-500/50"></div>
                                {sub}
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              ))}
           </div>
         )}

         {/* RADAR VIEW */}
         {activeTab === 'RADAR' && (
            <div className="space-y-4">
               <p className="text-[10px] text-slate-500 font-mono mb-4 uppercase">
                 根据你的关注点追踪到的最新资讯：
              </p>

              {topics.map(topic => (
                 <div key={topic.id} className="relative group overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:bg-white/10 transition-colors">
                     {/* Relevance Bar */}
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-transparent" style={{ height: `${topic.relevance * 100}%` }}></div>
                     
                     <div className="p-4 pl-6">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="text-sm font-bold text-slate-200">{topic.name}</h4>
                           <span className="text-[9px] font-mono text-purple-300 bg-purple-900/20 px-1.5 py-0.5 rounded border border-purple-500/20">
                              关注度 {Math.round(topic.relevance * 100)}%
                           </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-3">
                           <Radio size={10} className="animate-pulse text-purple-400" />
                           上次更新: {topic.lastUpdate}
                        </div>

                        {topic.newsFlash && (
                           <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3 items-start">
                              <Newspaper size={14} className="text-slate-400 mt-0.5 shrink-0" />
                              <div className="flex-1">
                                 <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                                    {topic.newsFlash}
                                 </p>
                                 <button className="flex items-center gap-1 text-[9px] text-cyan-400 mt-2 hover:underline">
                                    阅读详情 <ArrowRight size={8} />
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                 </div>
              ))}
              
              <div className="p-4 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-slate-500 hover:text-slate-300 hover:border-white/20 cursor-pointer transition-colors">
                 + 添加新的关注话题
              </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default ActionCenter;
