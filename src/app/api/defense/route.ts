import { NextRequest } from "next/server";
import { llmClient } from "@/lib/llm/client";
import { buildSystemPrompt } from "@/lib/prompts/system";
import { mentorZhangPrompt } from "@/lib/prompts/mentor-zhang";
import { buildMentorWangPrompt } from "@/lib/prompts/mentor-wang";
import { mentorLinPrompt } from "@/lib/prompts/mentor-lin";
import { followUpPrompt } from "@/lib/prompts/follow-up";
import {
  buildStructureSummary,
  buildQuestionUserMessage,
  buildFollowUpUserMessage,
} from "@/lib/defense/prompt-builder";
import type { ThesisInfo, ThesisChapter } from "@/types/thesis";
import type { DefenseMessage } from "@/types/defense";
import type { MentorRole } from "@/types/mentor";
import type { LLMMessage } from "@/lib/llm/types";

interface DefenseRequest {
  action: "question" | "follow_up";
  thesisInfo: ThesisInfo;
  chapters: ThesisChapter[];
  currentMentor: MentorRole;
  chapterIndex: number;
  questionCount: number;
  followUpCount: number;
  consecutivePoorCount: number;
  stressLevel: number;
  messages: DefenseMessage[];
  userAnswer?: string;
  originalQuestion?: string;
}

/** 获取导师Prompt */
function getMentorPrompt(role: MentorRole, thesisInfo: ThesisInfo): string {
  switch (role) {
    case "chief":
      return mentorZhangPrompt;
    case "professional":
      return buildMentorWangPrompt(thesisInfo);
    case "expansion":
      return mentorLinPrompt;
    default:
      return mentorZhangPrompt;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DefenseRequest = await request.json();
    const {
      action,
      thesisInfo,
      chapters,
      currentMentor,
      chapterIndex,
      questionCount,
      followUpCount,
      consecutivePoorCount,
      stressLevel,
      messages,
      userAnswer,
      originalQuestion,
    } = body;

    const structureSummary = buildStructureSummary(chapters);
    const mentorPrompt = getMentorPrompt(currentMentor, thesisInfo);

    const systemPrompt = buildSystemPrompt({
      thesisInfo,
      thesisStructureSummary: structureSummary,
      currentMentorRole: currentMentor,
      currentPhase: action === "question" ? "questioning" : "questioning",
      questionCount,
      followUpCount,
      stressLevel,
    });

    let userMessage: string;

    if (action === "question") {
      userMessage = buildQuestionUserMessage(chapters, chapterIndex, messages);
    } else {
      // follow_up action
      userMessage = buildFollowUpUserMessage(
        originalQuestion || "",
        userAnswer || "",
        chapters,
        chapterIndex,
        followUpCount,
        consecutivePoorCount,
        stressLevel
      );
    }

    const llmMessages: LLMMessage[] = [
      { role: "system", content: systemPrompt + "\n\n" + mentorPrompt },
    ];

    // 添加历史对话
    for (const msg of messages) {
      if (msg.sender === "mentor") {
        llmMessages.push({ role: "assistant", content: msg.content });
      } else if (msg.sender === "user") {
        llmMessages.push({ role: "user", content: msg.content });
      }
    }

    // 如果是追问，添加follow-up prompt
    if (action === "follow_up") {
      llmMessages.push({ role: "system", content: followUpPrompt });
    }

    llmMessages.push({ role: "user", content: userMessage });

    const stream = llmClient.chatStream({
      messages: llmMessages,
      temperature: action === "follow_up" ? 0.3 : 0.7,
      maxTokens: 1024,
    });

    // 将纯文本流包装为SSE格式
    const sseStream = new ReadableStream({
      start: async (controller) => {
        const reader = stream.getReader();
        const encoder = new TextEncoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = typeof value === "string" ? value : new TextDecoder().decode(value);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(sseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Defense API error:", error);
    return Response.json(
      { error: "答辩服务暂时不可用，请稍后再试" },
      { status: 500 }
    );
  }
}
