import type { MentorRole } from "@/types/mentor";
import { MENTOR_ORDER, MENTORS } from "@/types/mentor";
import type { FollowUpDecision } from "@/types/defense";

/** 答辩流程动作 */
export type DefenseAction =
  | { type: "ASK_QUESTION" }
  | { type: "FOLLOW_UP"; question: string }
  | { type: "GUIDANCE"; hint: string }
  | { type: "SWITCH_MENTOR"; nextMentor: MentorRole; announcement: string }
  | { type: "EVALUATE" }
  | { type: "END" };

/** 答辩流程状态 */
export interface DefenseEngineState {
  currentMentorIndex: number;
  questionCount: number;
  followUpCount: number;
  consecutivePoorCount: number;
  guidanceUsedCount: number;
  questionsPerMentor: Record<MentorRole, number>;
}

/** 每位导师的问题数量配置 */
const QUESTIONS_PER_MENTOR: Record<MentorRole, number> = {
  chief: 2,
  professional: 2,
  expansion: 1,
  reviewer: 0,
};

/** 每位导师的最大追问轮数 */
const MAX_FOLLOW_UP: Record<MentorRole, number> = {
  chief: 1,
  professional: 1,
  expansion: 1,
  reviewer: 0,
};

/** 最大引导次数（全局） */
const MAX_GUIDANCE_TOTAL = 2;

/** 连续回答差几次触发引导 */
const POOR_THRESHOLD = 2;

/**
 * 根据追问决策结果，决定下一步动作
 */
export function decideNextAction(
  state: DefenseEngineState,
  decision: FollowUpDecision | null
): DefenseAction {
  const currentMentor = MENTOR_ORDER[state.currentMentorIndex];
  const maxFollowUp = MAX_FOLLOW_UP[currentMentor];
  const maxQuestions = QUESTIONS_PER_MENTOR[currentMentor];

  // 如果没有决策结果（解析失败），直接切换导师
  if (!decision) {
    return decideAfterQuestion(state);
  }

  // 判断是否需要引导
  const shouldGuide =
    decision.needs_guidance &&
    state.consecutivePoorCount >= POOR_THRESHOLD &&
    state.guidanceUsedCount < MAX_GUIDANCE_TOTAL;

  if (shouldGuide && decision.guidance_hint) {
    return { type: "GUIDANCE", hint: decision.guidance_hint };
  }

  // 判断是否需要追问
  const shouldFollowUp =
    decision.should_follow_up &&
    decision.follow_up_question &&
    state.followUpCount < maxFollowUp;

  if (shouldFollowUp) {
    return { type: "FOLLOW_UP", question: decision.follow_up_question };
  }

  // 不需要追问，判断是否需要切换导师
  return decideAfterQuestion(state);
}

/**
 * 当前导师提问结束后，决定下一步
 */
export function decideAfterQuestion(state: DefenseEngineState): DefenseAction {
  const currentMentor = MENTOR_ORDER[state.currentMentorIndex];
  const maxQuestions = QUESTIONS_PER_MENTOR[currentMentor];
  const currentMentorQuestions = state.questionsPerMentor[currentMentor] || 0;

  // 当前导师还没问完所有问题
  if (currentMentorQuestions < maxQuestions) {
    return { type: "ASK_QUESTION" };
  }

  // 当前导师问完了，切换到下一个
  const nextIndex = state.currentMentorIndex + 1;

  if (nextIndex >= MENTOR_ORDER.length) {
    // 所有导师问完，进入评审
    return { type: "EVALUATE" };
  }

  const nextMentor = MENTOR_ORDER[nextIndex];
  const announcement = getMentorAnnouncement(nextMentor);

  return { type: "SWITCH_MENTOR", nextMentor, announcement };
}

/**
 * 更新引擎状态（在执行动作后调用）
 */
export function updateEngineState(
  state: DefenseEngineState,
  action: DefenseAction,
  decision?: FollowUpDecision | null
): DefenseEngineState {
  const newState = { ...state };

  switch (action.type) {
    case "ASK_QUESTION":
      newState.questionCount++;
      newState.questionsPerMentor = {
        ...newState.questionsPerMentor,
        [MENTOR_ORDER[state.currentMentorIndex]]:
          (newState.questionsPerMentor[MENTOR_ORDER[state.currentMentorIndex]] || 0) + 1,
      };
      newState.followUpCount = 0;
      break;

    case "FOLLOW_UP":
      newState.followUpCount++;
      if (decision?.answer_quality === "差") {
        newState.consecutivePoorCount++;
      } else {
        newState.consecutivePoorCount = 0;
      }
      break;

    case "GUIDANCE":
      newState.guidanceUsedCount++;
      newState.consecutivePoorCount++;
      break;

    case "SWITCH_MENTOR":
      newState.currentMentorIndex = MENTOR_ORDER.indexOf(action.nextMentor);
      newState.followUpCount = 0;
      newState.consecutivePoorCount = 0;
      break;
  }

  return newState;
}

/**
 * 创建初始引擎状态
 */
export function createInitialState(): DefenseEngineState {
  return {
    currentMentorIndex: 0,
    questionCount: 0,
    followUpCount: 0,
    consecutivePoorCount: 0,
    guidanceUsedCount: 0,
    questionsPerMentor: {
      chief: 0,
      professional: 0,
      expansion: 0,
      reviewer: 0,
    },
  };
}

/**
 * 获取导师切换的过渡语
 */
function getMentorAnnouncement(mentor: MentorRole): string {
  const config = MENTORS[mentor];
  const roleLabel =
    mentor === "professional" ? "专业导师" : "学术拓展导师";
  return `--- ${roleLabel} ${config.name}${config.title} 开始提问 ---`;
}
