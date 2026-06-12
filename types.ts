
export enum ContentType {
  VIEWPOINT = 'VIEWPOINT', // 观点卡
  SUMMARY = 'SUMMARY', // 摘要卡
  COLLECTION = 'COLLECTION', // 主题合集卡
  TIMELINE = 'TIMELINE', // 时间轨迹卡
  INSPIRATION = 'INSPIRATION', // 灵感片段
}

export interface RawSource {
  id: string;
  type: 'TEXT' | 'IMAGE' | 'AUDIO' | 'LINK' | 'THOUGHT';
  summary: string; // The snippet or description of the original input
  timestamp: string;
}

export interface InsightCardData {
  id: string;
  type: ContentType;
  title: string;
  content: string[]; // Bullet points or short text
  timestamp: string;
  sourceType: 'ARTICLE' | 'CHAT' | 'IMAGE' | 'AUDIO' | 'THOUGHT';
  sourceCount: number; // e.g., "Based on 3 inputs"
  sources?: RawSource[]; // Traceability data
  isPublic: boolean; // Whether the user has chosen to share this card
}

export interface UniverseNode {
  id: string;
  name: string;
  type: 'STAR' | 'PLANET' | 'MOON';
  description?: string;
  children?: UniverseNode[];
}

export interface VisualState {
  temperature: number; // 0.0 (Cool/Blue) to 1.0 (Warm/Red)
  energy: number; // 0.0 (Static) to 1.0 (Dynamic/Fast)
  density: number; // 0.0 (Sparse) to 1.0 (Dense)
  focus: number; // 0.0 (Diffused) to 1.0 (Sharp)
  seriousness: number; // 0.0 (Playful/Round) to 1.0 (Serious/Sharp)
}

// --- NEW FEATURES TYPES ---

export interface TaskItem {
  id: string;
  title: string;
  status: 'PENDING' | 'COMPLETED';
  subTasks?: string[]; // AI suggested breakdown
  sourceId?: string; // Linked to original input
}

export interface TopicInterest {
  id: string;
  name: string;
  relevance: number; // 0-1
  lastUpdate: string;
  newsFlash?: string; // Simulated "Latest News"
}

export interface DnaHistoryPoint {
  date: string;
  visualState: VisualState;
}

export interface DailySignature {
  text: string;
  generatedAt: string; // ISO Date
}

export interface UniverseState {
  coreTheme: string; // The Star Name
  structure: UniverseNode;
  visualState: VisualState;
  cards: InsightCardData[];
  rawLog: RawSource[]; // Master list of all inputs (Traceability Layer)
  lastUpdated: string;
  
  // New Fields
  tasks: TaskItem[];
  trackedTopics: TopicInterest[];
  dnaHistory: DnaHistoryPoint[]; // For Evolution Chart
  dailySignature: DailySignature;
}

export interface UserInput {
  text: string;
  type: 'TEXT' | 'URL' | 'THOUGHT';
}
