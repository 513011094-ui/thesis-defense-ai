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
  const phase = useDefenseStore((s) => s.phase);
  const setSidebarVisible = useDefenseStore((s) => s.setSidebarVisible);
  const { isLoading, isStreaming, streamingContent, initDefense, startDefense, handleSubmitAnswer } =
    useDefense();

  useEffect(() => {
    if (!thesisInfo || chapters.length === 0) {
      router.push("/");
      return;
    }
    initDefense();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 答辩提问/评审阶段隐藏侧边栏，保持全屏沉浸
  useEffect(() => {
    const immersivePhases = ["questioning", "reviewing"];
    setSidebarVisible(!immersivePhases.includes(phase));

    // 离开页面时恢复侧边栏
    return () => setSidebarVisible(true);
  }, [phase, setSidebarVisible]);

  if (!thesisInfo) return null;

  return (
    <main className="h-screen flex flex-col">
      {/* 顶部信息栏 */}
      <div
        className="glass border-b border-white/30 px-6 py-3 flex items-center justify-between"
        style={{ borderRadius: 0 }}
      >
        <div>
          <h1 className="font-semibold flex items-center gap-2" style={{ color: "var(--lp-text-strong)" }}>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            模拟答辩进行中
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--lp-text-subtle)" }}>
            {thesisInfo.title} · {thesisInfo.degreeType} · {thesisInfo.major}
          </p>
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-full"
          style={{ background: "var(--lp-surface-hover)", color: "var(--lp-text-muted)" }}
        >
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
