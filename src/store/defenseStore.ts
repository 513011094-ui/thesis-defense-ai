import { create } from "zustand";
import type { ThesisInfo, ThesisChapter, ThesisParseResult } from "@/types/thesis";
import type { DefensePhase, DefenseMessage, EvaluationReport } from "@/types/defense";
import type { MentorRole } from "@/types/mentor";

interface DefenseState {
  // 论文数据
  thesisInfo: ThesisInfo | null;
  thesisText: string;
  thesisAbstract: string;
  chapters: ThesisChapter[];

  // 答辩状态
  phase: DefensePhase;
  currentMentor: MentorRole;
  messages: DefenseMessage[];
  questionCount: number;
  followUpCount: number;
  consecutivePoorCount: number;
  stressLevel: number;
  guidanceUsedCount: number;

  // 评分报告
  report: EvaluationReport | null;

  // Actions
  setThesisData: (result: ThesisParseResult) => void;
  setPhase: (phase: DefensePhase) => void;
  setCurrentMentor: (mentor: MentorRole) => void;
  addMessage: (msg: DefenseMessage) => void;
  incrementQuestionCount: () => void;
  incrementFollowUpCount: () => void;
  resetFollowUpCount: () => void;
  incrementConsecutivePoor: () => void;
  resetConsecutivePoor: () => void;
  incrementGuidanceUsed: () => void;
  setStressLevel: (level: number) => void;
  setReport: (report: EvaluationReport) => void;
  reset: () => void;
}

const initialState = {
  thesisInfo: null,
  thesisText: "",
  thesisAbstract: "",
  chapters: [],
  phase: "idle" as DefensePhase,
  currentMentor: "chief" as MentorRole,
  messages: [],
  questionCount: 0,
  followUpCount: 0,
  consecutivePoorCount: 0,
  stressLevel: 2,
  guidanceUsedCount: 0,
  report: null,
};

export const useDefenseStore = create<DefenseState>((set) => ({
  ...initialState,

  setThesisData: (result) =>
    set({
      thesisInfo: result.info,
      thesisText: result.fullText,
      thesisAbstract: result.abstract,
      chapters: result.chapters,
    }),

  setPhase: (phase) => set({ phase }),
  setCurrentMentor: (mentor) => set({ currentMentor: mentor }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  incrementQuestionCount: () => set((s) => ({ questionCount: s.questionCount + 1 })),
  incrementFollowUpCount: () => set((s) => ({ followUpCount: s.followUpCount + 1 })),
  resetFollowUpCount: () => set({ followUpCount: 0 }),
  incrementConsecutivePoor: () => set((s) => ({ consecutivePoorCount: s.consecutivePoorCount + 1 })),
  resetConsecutivePoor: () => set({ consecutivePoorCount: 0 }),
  incrementGuidanceUsed: () => set((s) => ({ guidanceUsedCount: s.guidanceUsedCount + 1 })),
  setStressLevel: (level) => set({ stressLevel: level }),
  setReport: (report) => set({ report }),
  reset: () => set(initialState),
}));
