
import { GoogleGenAI, Type } from "@google/genai";
import { UniverseState, ContentType, VisualState, UniverseNode, InsightCardData, RawSource, TaskItem, TopicInterest, DnaHistoryPoint } from "../types";

// Helper to create mock sources
const createSource = (id: string, type: any, summary: string, time: string): RawSource => ({
  id, type, summary, timestamp: time
});

const sourcePool = [
  createSource('s1', 'THOUGHT', '随手记：好的工具像眼镜，戴上就忘了它的存在...', '10:42'),
  createSource('s2a', 'LINK', '文章：Deep Work Summary / Cal Newport', '09:15'),
  createSource('s2b', 'THOUGHT', '读后感：不管怎么忙，每天得留 2 小时...', '09:45'),
  createSource('s2c', 'IMAGE', '截图：Kindle 读书笔记高亮', '09:50'),
  createSource('s3', 'THOUGHT', '和 GPT 讨论：关于 AI 替代性的辩论...', '昨天'),
  createSource('s4a', 'TEXT', '备忘录：下周开始关闭朋友圈入口', '3天前'),
  createSource('s4b', 'LINK', '文章：数字极简主义实践', '3天前'),
  createSource('s-unused-1', 'AUDIO', '语音备忘：关于下个季度的旅行计划...', '4天前'), 
  createSource('s-unused-2', 'THOUGHT', '突然想到一个无关的笑话...', '5天前'), 
];

// Generate Mock History for Evolution Chart
const generateMockHistory = (): DnaHistoryPoint[] => {
  const points: DnaHistoryPoint[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    points.push({
      date: d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
      visualState: {
        temperature: 0.4 + Math.random() * 0.4,
        energy: 0.3 + Math.random() * 0.5,
        density: 0.4 + Math.random() * 0.3,
        focus: 0.5 + Math.random() * 0.4,
        seriousness: 0.2 + Math.random() * 0.4
      }
    });
  }
  return points;
};

// Rich Mock Data (User)
const MOCK_DATA: UniverseState = {
  coreTheme: "数字化生存",
  lastUpdated: new Date().toISOString(),
  visualState: {
    temperature: 0.7, 
    energy: 0.6,      
    density: 0.5,     
    focus: 0.85,
    seriousness: 0.4 
  },
  dailySignature: {
    text: "在数据的洪流中，保持清醒比获取信息更重要。",
    generatedAt: new Date().toISOString()
  },
  structure: {
    id: "star-1",
    name: "数字化生存",
    type: "STAR",
    description: "关于在数字时代如何保持清醒与高效的核心关注。",
    children: [
      {
        id: "planet-1",
        name: "深度思考",
        type: "PLANET",
        children: [
          { id: "moon-1-1", name: "注意力经济", type: "MOON" },
          { id: "moon-1-2", name: "心流状态", type: "MOON" }
        ]
      },
      {
        id: "planet-2",
        name: "AI 协作",
        type: "PLANET",
        children: [
          { id: "moon-2-1", name: "思维外挂", type: "MOON" },
          { id: "moon-2-2", name: "创造力增强", type: "MOON" },
          { id: "moon-2-3", name: "工具伦理", type: "MOON" }
        ]
      },
      {
        id: "planet-3",
        name: "信息摄入",
        type: "PLANET",
        children: [
          { id: "moon-3-1", name: "信噪比", type: "MOON" }
        ]
      }
    ]
  },
  rawLog: sourcePool, 
  cards: [
    {
      id: "c1",
      type: ContentType.VIEWPOINT,
      title: "工具的“透明化”",
      content: ["真正的效率工具应该在使用时感受不到它的存在，就像肢体的延伸。"],
      timestamp: "10分钟前",
      sourceType: "THOUGHT",
      sourceCount: 1,
      isPublic: true,
      sources: [sourcePool[0]]
    },
    {
      id: "c2",
      type: ContentType.SUMMARY,
      title: "关于《深度工作》的思考",
      content: [
        "浅薄工作（Shallow Work）正在吞噬我们的创造力。",
        "拥抱无聊是训练专注力的关键。",
        "要在日程表中为深度思考预留固定的“神圣时间”。"
      ],
      timestamp: "2小时前",
      sourceType: "ARTICLE",
      sourceCount: 3,
      isPublic: false,
      sources: [sourcePool[1], sourcePool[2], sourcePool[3]]
    },
    {
      id: "c3",
      type: ContentType.INSPIRATION,
      title: "人机共生的未来",
      content: ["AI 不会取代人，而是取代那些不会使用 AI 的人。关键在于如何定义“提问”的能力。"],
      timestamp: "昨天",
      sourceType: "CHAT",
      sourceCount: 5,
      isPublic: true,
      sources: [sourcePool[4]]
    },
    {
      id: "c4",
      type: ContentType.COLLECTION,
      title: "近期关注：数字极简主义",
      content: ["断舍离不仅是物理空间，更是数字空间。", "减少通知推送，夺回主动权。"],
      timestamp: "3天前",
      sourceType: "ARTICLE",
      sourceCount: 4,
      isPublic: true,
      sources: [sourcePool[5], sourcePool[6]]
    }
  ],
  tasks: [
    { id: 't1', title: '尝试关闭朋友圈入口一周', status: 'PENDING', subTasks: ['设置手机权限', '通知亲密好友'], sourceId: 's4a' },
    { id: 't2', title: '整理 Kindle 高亮笔记', status: 'COMPLETED', subTasks: [], sourceId: 's2c' }
  ],
  trackedTopics: [
    { id: 'tp1', name: 'AI Agent 发展', relevance: 0.9, lastUpdate: '1小时前', newsFlash: 'OpenAI 发布关于 Operator 的最新论文...' },
    { id: 'tp2', name: '数字游民生活方式', relevance: 0.7, lastUpdate: '昨天', newsFlash: '2025 全球数字游民签证政策汇总更新...' }
  ],
  dnaHistory: generateMockHistory()
};

// Friend Data (Simplified for brevity, but matching structure)
const MOCK_FRIEND_DATA: UniverseState = {
  ...MOCK_DATA,
  coreTheme: "创意工程",
  visualState: { temperature: 0.2, energy: 0.9, density: 0.8, focus: 0.9, seriousness: 0.2 },
  structure: {
    id: "star-f1", name: "创意工程", type: "STAR",
    children: [
      { id: "planet-f1", name: "AI 协作", type: "PLANET", children: [{ id: "m-f1", name: "生成式艺术", type: "MOON" }] },
      { id: "planet-f2", name: "独立开发", type: "PLANET", children: [{ id: "m-f2", name: "产品设计", type: "MOON" }] }
    ]
  },
  dailySignature: { text: "代码是写给机器的情书，也是写给未来的预言。", generatedAt: new Date().toISOString() },
  cards: [
    { id: "cf1", type: ContentType.INSPIRATION, title: "AI 绘画的偶然性", content: ["Midjourney 的很多惊喜..."], timestamp: "2小时前", sourceType: "IMAGE", sourceCount: 1, isPublic: true }
  ]
};

// Feature 2: Generate Daily Signature
export const generateDailySignature = async (visualState: VisualState): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "模拟生成：灵感如星辰般闪烁，指引着未知的航向。";

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `基于以下用户的认知状态(0-1)，生成一句富有哲理、简短（20字以内）的“个人今日特质”描述。
  状态: 温度${visualState.temperature}, 能量${visualState.energy}, 密度${visualState.density}, 聚焦${visualState.focus}.
  风格：高级、隐喻、非评价性。不要包含任何解释，只返回句子。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    return response.text?.trim() || "宇宙在静默中注视着你的思考。";
  } catch (e) {
    return "连接星网失败，使用本地备用导航。";
  }
};

// Feature 3: Tasks & Topics in Analysis
export const analyzeInputWithGemini = async (
  newInput: string, 
  currentState: UniverseState
): Promise<UniverseState> => {
  
  const newSource: RawSource = {
    id: `src-${Date.now()}`,
    type: 'THOUGHT',
    summary: newInput,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    // Mock Update
    const newTemp = Math.min(1, Math.max(0, currentState.visualState.temperature + (Math.random() * 0.2 - 0.1)));
    return {
      ...currentState,
      visualState: { ...currentState.visualState, temperature: newTemp },
      rawLog: [newSource, ...currentState.rawLog],
      cards: [{
          id: `new-${Date.now()}`,
          type: ContentType.INSPIRATION,
          title: "新想法已捕获 (Demo)",
          content: [newInput],
          timestamp: "刚刚",
          sourceType: "THOUGHT",
          sourceCount: 1,
          isPublic: false,
          sources: [newSource]
        }, ...currentState.cards],
      // Add a mock task if input mentions "plan" or "do"
      tasks: newInput.includes("计划") || newInput.includes("要") 
        ? [{ id: `t-${Date.now()}`, title: `待办：${newInput.substring(0, 10)}...`, status: 'PENDING', subTasks: ['第一步', '第二步'], sourceId: newSource.id }, ...currentState.tasks]
        : currentState.tasks
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    分析用户输入，更新知识宇宙。请完全使用**简体中文**。
    
    输入: "${newInput}"
    当前恒星: ${currentState.coreTheme}
    
    任务:
    1. 确定 VisualState (0.0-1.0) 的微调。
    2. 生成 1-2 张新的 InsightCards。
    3. [新增] 提取 Action Items (待办任务)：如果输入包含行动意向，提取为任务，并拆解 2-3 个子步骤。
    4. [新增] 提取 Topic Interests (感兴趣话题)：如果输入涉及特定领域，提取话题名称。
    
    JSON Schema:
    {
      coreTheme: string,
      visualState: { temperature: number, energy: number, density: number, focus: number, seriousness: number },
      structure: { name: string, description: string, children: [{ name: string, type: "PLANET", children: [{ name: string, type: "MOON" }] }] },
      newCards: [{ type: string, title: string, content: string[], sourceType: string }],
      newTasks: [{ title: string, subTasks: string[] }],
      detectedTopics: [string]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const result = JSON.parse(response.text || "{}");

    // Process Structure & Cards (Simplified merge logic same as before)
    const newStructure: UniverseNode = {
      id: "star-new", name: result.coreTheme || currentState.coreTheme, type: "STAR",
      description: result.structure?.description,
      children: result.structure?.children?.map((p: any, i: number) => ({
        id: `planet-${i}`, name: p.name, type: "PLANET",
        children: p.children?.map((m: any, j: number) => ({ id: `moon-${i}-${j}`, name: m.name, type: "MOON" })) || []
      })) || currentState.structure.children
    };

    const newCardsFormatted: InsightCardData[] = (result.newCards || []).map((c: any, i: number) => ({
      id: `gen-${Date.now()}-${i}`,
      type: c.type || "SUMMARY",
      title: c.title || "无题",
      content: c.content || [],
      timestamp: "刚刚",
      sourceType: c.sourceType || "THOUGHT",
      sourceCount: 1,
      isPublic: false,
      sources: [newSource]
    }));

    // Process Tasks
    const createdTasks: TaskItem[] = (result.newTasks || []).map((t: any, i: number) => ({
      id: `task-${Date.now()}-${i}`,
      title: t.title,
      status: 'PENDING',
      subTasks: t.subTasks || [],
      sourceId: newSource.id
    }));

    // Process Topics (Merge with existing, boost relevance if exists)
    let updatedTopics = [...currentState.trackedTopics];
    (result.detectedTopics || []).forEach((topicName: string) => {
      const existing = updatedTopics.find(t => t.name === topicName);
      if (existing) {
        existing.relevance = Math.min(1, existing.relevance + 0.1);
        existing.lastUpdate = "刚刚";
      } else {
        updatedTopics.push({
          id: `topic-${Date.now()}-${Math.random()}`,
          name: topicName,
          relevance: 0.5,
          lastUpdate: "刚刚",
          newsFlash: "正在扫描全网资讯..." // Placeholder for tool integration
        });
      }
    });

    return {
      coreTheme: result.coreTheme || currentState.coreTheme,
      visualState: { ...currentState.visualState, ...result.visualState },
      structure: newStructure,
      rawLog: [newSource, ...currentState.rawLog],
      cards: [...newCardsFormatted, ...currentState.cards].slice(0, 20),
      tasks: [...createdTasks, ...currentState.tasks],
      trackedTopics: updatedTopics.sort((a, b) => b.relevance - a.relevance).slice(0, 5),
      dnaHistory: currentState.dnaHistory, // Keep history
      dailySignature: currentState.dailySignature, // Don't change signature on every input
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error("Gemini Error", error);
    return currentState;
  }
};

export { MOCK_DATA, MOCK_FRIEND_DATA };
