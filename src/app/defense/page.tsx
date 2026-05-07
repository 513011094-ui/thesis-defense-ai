"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DefenseStage from "@/components/defense/DefenseStage";
import { useDefenseStore } from "@/store/defenseStore";
import { useDefense } from "@/hooks/useDefense";

export default function DefensePage() {
  const router = useRouter();
  const thesisInfo = useDefenseStore((s) => s.thesisInfo);
  const chapters = useDefenseStore((s) => s.chapters);
  const { isLoading, isStreaming, streamingContent, initDefense, startDefense, handleSubmitAnswer } =
    useDefense();

  useEffect(() => {
    if (!thesisInfo || chapters.length === 0) {
      router.push("/");
      return;
    }
    initDefense();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!thesisInfo) return null;

  return (
    <main className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* 顶部信息栏 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            模拟答辩进行中
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {thesisInfo.title} · {thesisInfo.degreeType} · {thesisInfo.major}
          </p>
        </div>
        <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
          {thesisInfo.wordCount.toLocaleString()}字 · {chapters.length}章
        </div>
      </div>

      {/* 答辩主区域 */}
      <div className="flex-1 overflow-hidden">
        <DefenseStage
          isLoading={isLoading}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          onSubmitAnswer={handleSubmitAnswer}
          onStart={startDefense}
        />
      </div>
    </main>
  );
}
