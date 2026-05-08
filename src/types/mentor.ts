/** 导师角色枚举 */
export type MentorRole = "chief" | "professional" | "expansion" | "reviewer";

/** 导师配置 */
export interface MentorConfig {
  role: MentorRole;
  name: string;
  title: string;
  stressLevel: number;
  questionCount: number;
  maxFollowUp: number;
}

/** 导师角色中文映射 */
export const MENTOR_LABELS: Record<MentorRole, string> = {
  chief: "主审导师",
  professional: "专业导师",
  expansion: "学术拓展导师",
  reviewer: "评审导师",
};

/** 导师头像路径 */
export const MENTOR_AVATARS: Record<MentorRole, string> = {
  chief: "/avatars/导师1.png",
  professional: "/avatars/导师2.png",
  expansion: "/avatars/导师3.png",
  reviewer: "/avatars/导师4.png",
};

/** 导师头像回退文字（姓氏） */
export const MENTOR_INITIALS: Record<MentorRole, string> = {
  chief: "张",
  professional: "王",
  expansion: "林",
  reviewer: "陈",
};

/** 导师配置表 */
export const MENTORS: Record<MentorRole, MentorConfig> = {
  chief: {
    role: "chief",
    name: "张明远",
    title: "教授",
    stressLevel: 2,
    questionCount: 2,
    maxFollowUp: 1,
  },
  professional: {
    role: "professional",
    name: "王建华",
    title: "教授",
    stressLevel: 3,
    questionCount: 2,
    maxFollowUp: 1,
  },
  expansion: {
    role: "expansion",
    name: "林婉清",
    title: "教授",
    stressLevel: 1,
    questionCount: 1,
    maxFollowUp: 1,
  },
  reviewer: {
    role: "reviewer",
    name: "陈建国",
    title: "教授",
    stressLevel: 1,
    questionCount: 0,
    maxFollowUp: 0,
  },
};

/** 提问导师顺序（不含评审） */
export const MENTOR_ORDER: MentorRole[] = ["chief", "professional", "expansion"];
