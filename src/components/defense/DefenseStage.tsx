"use client";

import { useRef, useEffect } from "react";
import MentorMessage from "./MentorMessage";
import UserAnswer from "./UserAnswer";
import OpeningCeremony from "./OpeningCeremony";
import Loading from "@/components/ui/Loading";
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
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {phase === "opening" && (
          <OpeningCeremony onStart={onStart} thesisTitle={thesisInfo?.title} />
        )}

        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
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
                    <span className="text-xs text-gray-400">我</span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
                    {msg.content}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
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
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-100 rounded-full w-24 mb-2 animate-pulse" />
              <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
        <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-6 text-center">
          <div className="inline-flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">答辩结束，评审导师正在撰写评语...</span>
          </div>
        </div>
      )}
    </div>
  );
}
