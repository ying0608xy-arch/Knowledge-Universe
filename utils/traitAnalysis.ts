import { VisualState } from "../types";

export interface TraitResult {
  archetype: string;
  description: string;
  traits: {
    label: string;
    value: number; // 0-1
    leftLabel: string;
    rightLabel: string;
  }[];
  dominantTag: string;
  guidance: string; // NEW: AI Suggestion/Summary
}

export const analyzeCognitiveTraits = (vs: VisualState): TraitResult => {
  // 1. Map VisualState to Cognitive Dimensions
  const traits = [
    {
      label: "情感光谱", // Based on Temperature
      value: vs.temperature,
      leftLabel: "纯逻辑",
      rightLabel: "共情",
    },
    {
      label: "思维速度", // Based on Energy
      value: vs.energy,
      leftLabel: "沉稳",
      rightLabel: "迅捷",
    },
    {
      label: "信息密度", // Based on Density
      value: vs.density,
      leftLabel: "本质主义",
      rightLabel: "百科全书",
    },
    {
      label: "聚焦模式", // Based on Focus
      value: vs.focus,
      leftLabel: "发散关联",
      rightLabel: "激光聚焦",
    },
    {
      label: "基调", // Based on Seriousness
      value: vs.seriousness,
      leftLabel: "活泼",
      rightLabel: "严谨",
    }
  ];

  // 2. Determine Archetype based on key combinations
  let archetype = "观察者";
  let description = "数字宇宙的平衡观察者。";
  let dominantTag = "平衡者";
  let guidance = "当前的宇宙处于完美的静力平衡中。保持观察，等待下一个引力波的到来。";

  // Logic tree for archetypes & Guidance
  if (vs.seriousness > 0.7 && vs.focus > 0.7) {
    archetype = "晶体架构师";
    description = "构建严密的思维体系，追求精确。重结构胜于混沌。";
    dominantTag = "结构主义";
    guidance = "结构极其稳固，但可能过于刚性。试着引入一些无序的‘彗星’（随机灵感），也许能打破现有的晶体边界。";
  } else if (vs.energy > 0.8 && vs.temperature > 0.6) {
    archetype = "星云编织者";
    description = "快速连接不相关的想法，富有情感共鸣。混沌的创造力。";
    dominantTag = "创造者";
    guidance = "恒星诞生速度极快，能量四溢。建议定期‘冷却’部分区域，将稍纵即逝的花火凝结成稳定的行星。";
  } else if (vs.density > 0.8) {
    archetype = "深空档案员";
    description = "吸收海量信息，建立密集的知识网络。";
    dominantTag = "收藏家";
    guidance = "该扇区质量过大，正面临坍缩风险。是时候进行一次‘霍金辐射’（输出），释放积压的信息密度了。";
  } else if (vs.temperature < 0.3 && vs.focus > 0.6) {
    archetype = "虚空行者";
    description = "以冷静的超然和逻辑游走于抽象与理论之间。";
    dominantTag = "分析师";
    guidance = "逻辑路径清晰可见，但缺乏温度。试着靠近那些充满情感色彩的星云，这会让你的理论更具生命力。";
  } else if (vs.energy < 0.3 && vs.seriousness < 0.4) {
    archetype = "漂流卫星";
    description = "在想法中轻柔穿行，重情绪与流动，轻结构。";
    dominantTag = "漫游者";
    guidance = "自由漂流带来了独特的视角。但若想留下痕迹，你需要寻找一颗主恒星作为引力锚点。";
  } else {
    // Balanced variations
    if (vs.energy > 0.6) {
        guidance = "思维活跃度正在上升。这是一个扩张边界的好时机，不要害怕进入未知领域。";
    } else {
        guidance = "这是一个内省的周期。整理现有的轨道，比探索新星系更重要。";
    }
  }

  return {
    archetype,
    description,
    traits,
    dominantTag,
    guidance
  };
};