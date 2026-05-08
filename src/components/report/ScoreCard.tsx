import type { ScoreDimension } from "@/types/defense";
import { getScoreColor, getScoreBg, getScoreBarColor } from "@/lib/utils/score-colors";

interface ScoreCardProps {
  title: string;
  dimension: ScoreDimension;
}

export default function ScoreCard({ title, dimension }: ScoreCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium" style={{ color: "var(--lp-text-strong)" }}>{title}</h3>
        <span className={`text-2xl font-bold ${getScoreColor(dimension.score)}`}>
          {dimension.score}/10
        </span>
      </div>
      <div className="w-full rounded-full h-2 mb-4" style={{ background: "var(--lp-surface-hover)" }}>
        <div
          className={`h-2 rounded-full transition-all ${getScoreBarColor(dimension.score)}`}
          style={{ width: `${dimension.score * 10}%` }}
        />
      </div>
      {dimension.pros.length > 0 && (
        <div className="mb-2">
          <p className="text-xs mb-1" style={{ color: "var(--lp-text-subtle)" }}>优点</p>
          {dimension.pros.map((p, i) => (
            <p key={i} className="text-sm text-green-700">+ {p}</p>
          ))}
        </div>
      )}
      {dimension.cons.length > 0 && (
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--lp-text-subtle)" }}>不足</p>
          {dimension.cons.map((c, i) => (
            <p key={i} className="text-sm text-red-600">- {c}</p>
          ))}
        </div>
      )}
    </div>
  );
}
