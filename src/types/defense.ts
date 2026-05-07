import type { MentorRole } from "./mentor";

/** 答辩阶段 */
export type DefensePhase =
  | "idle"
  | "opening"
  | "questioning"
  | "reviewing"
  | "completed";

/** 消息来源 */
export type MessageSender = "mentor" | "user" | "system";

/** 答辩消息 */
export interface DefenseMessage {
  id: string;
  sender: MessageSender;
  mentorRole?: MentorRole;
  content: string;
  timestamp: number;
}

/** 追问决策结果 */
export interface FollowUpDecision {
  answer_quality: "好" | "一般" | "差";
  answer_feedback: string;
  is_complete: boolean;
  is_accurate: boolean;
  has_logic_gap: boolean;
  logic_gap_description: string;
  should_follow_up: boolean;
  needs_guidance: boolean;
  follow_up_type: string;
  anchor_chapter: string;
  anchor_content: string;
  follow_up_question: string;
  guidance_hint: string;
}

/** 评分维度 */
export interface ScoreDimension {
  score: number;
  pros: string[];
  cons: string[];
}

/** 关键问题详细评价 */
export interface QuestionFeedback {
  question: string;
  answerSummary: string;
  evaluation: "好" | "一般" | "差";
  feedback: string;
  improvement: string;
}

/** 评分报告 */
export interface EvaluationReport {
  logic: ScoreDimension;
  professional: ScoreDimension;
  innovation: ScoreDimension;
  expression: ScoreDimension;
  overallScore: number;
  result: "通过" | "修改后通过" | "修改后重审" | "不通过";
  summary: string;
  suggestions: string[];
  detailedFeedback: QuestionFeedback[];
}
