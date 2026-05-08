"use client";

import { useRef, useEffect } from "react";
import MentorMessage from "./MentorMessage";
import UserAnswer from "./UserAnswer";
import OpeningCeremony from "./OpeningCeremony";
import { useDefenseStore } from "@/store/defenseStore";

interface DefenseStageProps {
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  onSubmitAnswer: (answer: string) => void;
  onStart: () => void;
}

export default function DefenseStage({
  isLoading,
  isStreaming,
  streamingContent,
  onSubmitAnswer,
  onStart,
}: DefenseStageProps) {
  const messages = useDefenseStore((s) => s.messages);
  const phase = useDefenseStore((s) => s.phase);
  const currentMentor = useDefenseStore((s) => s.currentMentor);
  const thesisInfo = useDefenseStore((s) => s.thesisInfo);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  return (
    <div className="flex flex-col h-full">
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {phase === "opening" && (
          <OpeningCeremony onStart={onStart} thesisTitle={thesisInfo?.title} />
        )}

        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: "var(--lp-surface-hover)", color: "var(--lp-text-subtle)" }}
                >
                  {msg.content}
                </span>
              </div>
            );
          }
          if (msg.sender === "mentor") {
            return (
              <MentorMessage
                key={msg.id}
                role={msg.mentorRole || "chief"}
                content={msg.content}
              />
            );
          }
          // user message
          return (
            <div key={msg.id} className="flex gap-3 mb-4 justify-end">
              <div className="flex-1 flex justify-end">
                <div className="max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1 justify-end">
                    <span className="text-xs" style={{ color: "var(--lp-text-subtle)" }}>我</span>
                  </div>
                  <div
                    className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed"
                    style={{
                      background: "var(--lp-text-strong)",
                      color: "#fff",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                我
              </div>
            </div>
          );
        })}

        {/* 流式输出中的导师消息 */}
        {isStreaming && streamingContent && (
          <MentorMessage
            role={currentMentor}
            content={streamingContent}
            isStreaming
          />
        )}

        {/* 加载中 */}
        {isLoading && !isStreaming && (
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 rounded-full animate-pulse" style={{ background: "var(--lp-surface-hover)" }} />
            <div className="flex-1">
              <div className="h-4 rounded-full w-24 mb-2 animate-pulse" style={{ background: "var(--lp-surface-hover)" }} />
              <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: "var(--lp-surface-hover)" }}>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--lp-border-strong)", animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--lp-border-strong)", animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--lp-border-strong)", animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 回答输入区域 */}
      {phase === "questioning" && !isLoading && !isStreaming && (
        <UserAnswer onSubmit={onSubmitAnswer} />
      )}

      {/* 答辩完成提示 */}
      {phase === "reviewing" && (
        <div className="glass border-t border-white/30 p-6 text-center" style={{ borderRadius: 0 }}>
          <div className="inline-flex items-center gap-3">
            <div
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--lp-text-strong)", borderTopColor: "transparent" }}
            />
            <span style={{ color: "var(--lp-text-muted)" }}>答辩结束，评审导师正在撰写评语...</span>
          </div>
        </div>
      )}
    </div>
  );
}
