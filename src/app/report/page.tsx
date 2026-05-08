"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ScoreCard from "@/components/report/ScoreCard";
import ResultBadge from "@/components/report/ResultBadge";
import SuggestionList from "@/components/report/SuggestionList";
import DetailedFeedback from "@/components/report/DetailedFeedback";
import { useDefenseStore } from "@/store/defenseStore";

export default function ReportPage() {
  const router = useRouter();
  const report = useDefenseStore((s) => s.report);
  const thesisInfo = useDefenseStore((s) => s.thesisInfo);
  const reset = useDefenseStore((s) => s.reset);

  useEffect(() => {
    if (!report) {
      router.push("/");
    }
  }, [report, router]);

  if (!report || !thesisInfo) return null;

  const handleRestart = () => {
    reset();
    router.push("/");
  };

  return (
    <main className="min-h-screen px-10 py-10">
      <div className="mx-auto max-w-2xl">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold tracking-tight" style={{ color: "var(--lp-text-strong)" }}>
            答辩评分报告
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--lp-text-muted)" }}>
            {thesisInfo.title}
          </p>
        </div>

        {/* 总分 */}
        <ResultBadge result={report.result} overallScore={report.overallScore} />

        {/* 四维度评分 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <ScoreCard title="论文逻辑" dimension={report.logic} />
          <ScoreCard title="专业理解" dimension={report.professional} />
          <ScoreCard title="创新性表达" dimension={report.innovation} />
          <ScoreCard title="临场表达" dimension={report.expression} />
        </div>

        {/* 修改建议 */}
        <SuggestionList suggestions={report.suggestions} summary={report.summary} />

        {/* 详细评价 */}
        {report.detailedFeedback && report.detailedFeedback.length > 0 && (
          <DetailedFeedback feedbacks={report.detailedFeedback} />
        )}

        {/* 操作按钮 */}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" className="flex-1" onClick={handleRestart}>
            重新答辩
          </Button>
          <Button className="flex-1" onClick={() => window.print()}>
            导出报告
          </Button>
        </div>

        {/* 底部 */}
        <p className="text-center text-xs mt-8" style={{ color: "var(--lp-text-subtle)" }}>
          一坨答辩 · AI模拟论文答辩系统
        </p>
      </div>
    </main>
  );
}
