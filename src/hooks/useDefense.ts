"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDefenseStore } from "@/store/defenseStore";
import { MENTOR_ORDER, MENTORS } from "@/types/mentor";
import type { MentorRole } from "@/types/mentor";
import type { DefenseMessage, FollowUpDecision } from "@/types/defense";
import {
  createInitialState,
  decideNextAction,
  decideAfterQuestion,
  updateEngineState,
  type DefenseEngineState,
  type DefenseAction,
} from "@/lib/defense/engine";
import { extractJSON } from "@/lib/utils/extract-json";

let msgIdCounter = 0;
function nextId() {
  return `msg-${++msgIdCounter}-${Date.now()}`;
}

export function useDefense() {
  const router = useRouter();
  const store = useDefenseStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [lastMentorRole, setLastMentorRole] = useState<MentorRole>("chief");

  // 使用ref保存引擎状态，避免闭包问题
  const engineRef = useRef<DefenseEngineState>(createInitialState());

  const chapters = store.chapters;
  const thesisInfo = store.thesisInfo;

  const getChapterIndex = useCallback(() => {
    return engineRef.current.questionCount % chapters.length;
  }, [chapters.length]);

  // === 流式读取 ===
  const readStream = useCallback(async (response: Response): Promise<string> => {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    setIsStreaming(true);
    setStreamingContent("");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || parsed.content || "";
          if (content) {
            fullText += content;
            setStreamingContent(fullText);
          }
        } catch {
          fullText += data;
          setStreamingContent(fullText);
        }
      }
    }

    setIsStreaming(false);
    return fullText;
  }, []);

  // === 执行动作 ===
  const executeAction = useCallback(
    async (action: DefenseAction) => {
      switch (action.type) {
        case "ASK_QUESTION": {
          const mentorRole = MENTOR_ORDER[engineRef.current.currentMentorIndex];
          setLastMentorRole(mentorRole);
          store.setCurrentMentor(mentorRole);

          const stressLevel = MENTORS[mentorRole].stressLevel;
          store.setStressLevel(stressLevel);

          setIsLoading(true);
          try {
            const response = await fetch("/api/defense", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "question",
                thesisInfo,
                chapters,
                currentMentor: mentorRole,
                chapterIndex: getChapterIndex(),
                questionCount: engineRef.current.questionCount,
                followUpCount: 0,
                consecutivePoorCount: engineRef.current.consecutivePoorCount,
                stressLevel,
                messages: store.messages,
              }),
            });

            if (!response.ok) throw new Error("请求失败");

            const content = await readStream(response);
            const cleanContent = cleanMentorOutput(content);

            store.addMessage({
              id: nextId(),
              sender: "mentor",
              mentorRole,
              content: cleanContent,
              timestamp: Date.now(),
            });

            engineRef.current = updateEngineState(engineRef.current, action);
            store.incrementQuestionCount();
            store.resetFollowUpCount();
            setLastQuestion(cleanContent);
          } catch (err) {
            console.error("提问失败:", err);
            store.addMessage({
              id: nextId(),
              sender: "system",
              content: "导师提问请求失败，请检查网络后重试",
              timestamp: Date.now(),
            });
          } finally {
            setIsLoading(false);
          }
          break;
        }

        case "FOLLOW_UP": {
          store.addMessage({
            id: nextId(),
            sender: "mentor",
            mentorRole: lastMentorRole,
            content: action.question,
            timestamp: Date.now(),
          });
          setLastQuestion(action.question);
          break;
        }

        case "GUIDANCE": {
          store.addMessage({
            id: nextId(),
            sender: "mentor",
            mentorRole: lastMentorRole,
            content: action.hint,
            timestamp: Date.now(),
          });
          setLastQuestion(action.hint);
          break;
        }

        case "SWITCH_MENTOR": {
          store.addMessage({
            id: nextId(),
            sender: "system",
            content: action.announcement,
            timestamp: Date.now(),
          });

          engineRef.current = updateEngineState(engineRef.current, action);
          store.resetFollowUpCount();
          store.resetConsecutivePoor();

          // 延迟后请求新导师提问
          setTimeout(() => {
            const nextAction: DefenseAction = { type: "ASK_QUESTION" };
            executeAction(nextAction);
          }, 800);
          break;
        }

        case "EVALUATE": {
          store.setPhase("reviewing");
          await requestEvaluation();
          break;
        }
      }
    },
    [thesisInfo, chapters, store, lastMentorRole, getChapterIndex, readStream]
  );

  // === 追问决策 ===
  const requestFollowUp = useCallback(
    async (userAnswer: string) => {
      if (!thesisInfo || chapters.length === 0) return;

      setIsLoading(true);
      try {
        const response = await fetch("/api/defense", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "follow_up",
            thesisInfo,
            chapters,
            currentMentor: lastMentorRole,
            chapterIndex: getChapterIndex(),
            questionCount: engineRef.current.questionCount,
            followUpCount: engineRef.current.followUpCount,
            consecutivePoorCount: engineRef.current.consecutivePoorCount,
            stressLevel: store.stressLevel,
            messages: store.messages,
            userAnswer,
            originalQuestion: lastQuestion,
          }),
        });

        if (!response.ok) throw new Error("请求失败");

        const content = await readStream(response);
        const decision = parseFollowUpDecision(content);

        // 显示导师评价
        if (decision?.answer_feedback) {
          store.addMessage({
            id: nextId(),
            sender: "mentor",
            mentorRole: lastMentorRole,
            content: decision.answer_feedback,
            timestamp: Date.now(),
          });
        }

        // 更新引擎状态（追问/引导计数）
        if (decision) {
          if (decision.should_follow_up) {
            engineRef.current = updateEngineState(
              engineRef.current,
              { type: "FOLLOW_UP", question: decision.follow_up_question },
              decision
            );
            store.incrementFollowUpCount();
            if (decision.answer_quality === "差") {
              store.incrementConsecutivePoor();
            } else {
              store.resetConsecutivePoor();
            }
          } else if (decision.needs_guidance) {
            engineRef.current = updateEngineState(engineRef.current, {
              type: "GUIDANCE",
              hint: decision.guidance_hint,
            });
            store.incrementGuidanceUsed();
            store.incrementConsecutivePoor();
          }
        }

        // 用引擎决定下一步
        const nextAction = decideNextAction(engineRef.current, decision);
        await executeAction(nextAction);
      } catch (err) {
        console.error("追问决策失败:", err);
        // 降级：跳过追问，直接判断是否切换导师
        const fallbackAction = decideAfterQuestion(engineRef.current);
        await executeAction(fallbackAction);
      } finally {
        setIsLoading(false);
      }
    },
    [thesisInfo, chapters, store, lastMentorRole, lastQuestion, getChapterIndex, readStream, executeAction]
  );

  // === 评审评分 ===
  const requestEvaluation = useCallback(async () => {
    if (!thesisInfo) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: store.messages }),
      });

      if (!response.ok) throw new Error("评分请求失败");

      const report = await response.json();
      store.setReport(report);
      store.setPhase("completed");
      router.push("/report");
    } catch (err) {
      console.error("评分失败:", err);
      store.addMessage({
        id: nextId(),
        sender: "system",
        content: "评分生成失败，请重试",
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [thesisInfo, store, router]);

  // === 用户操作 ===
  const handleSubmitAnswer = useCallback(
    (answer: string) => {
      store.addMessage({
        id: nextId(),
        sender: "user",
        content: answer,
        timestamp: Date.now(),
      });
      requestFollowUp(answer);
    },
    [store, requestFollowUp]
  );

  const initDefense = useCallback(() => {
    if (!thesisInfo || chapters.length === 0) {
      router.push("/");
      return;
    }
    engineRef.current = createInitialState();
    store.setPhase("opening");
  }, [thesisInfo, chapters, store, router]);

  const startDefense = useCallback(() => {
    store.setPhase("questioning");
    const action: DefenseAction = { type: "ASK_QUESTION" };
    executeAction(action);
  }, [store, executeAction]);

  return {
    isLoading,
    isStreaming,
    streamingContent,
    initDefense,
    startDefense,
    handleSubmitAnswer,
  };
}

function cleanMentorOutput(text: string): string {
  return text
    .replace(/^\[[一-龥]+\]\s*[一-龥]+教授[：:]\s*/g, "")
    .replace(/^[""「]|[""」]$/g, "")
    .trim();
}

function parseFollowUpDecision(text: string): FollowUpDecision | null {
  return extractJSON<FollowUpDecision>(text, (data) => typeof data.should_follow_up === "boolean");
}
