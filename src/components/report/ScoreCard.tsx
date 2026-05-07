import type { ScoreDimension } from "@/types/defense";
import { getScoreColor, getScoreBg, getScoreBarColor } from "@/lib/utils/score-colors";

interface ScoreCardProps {
  title: string;
  dimension: ScoreDimension;
}

export default function ScoreCard({ title, dimension }: ScoreCardProps) {

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className={`text-2xl font-bold ${getScoreColor(dimension.score)}`}>
          {dimension.score}/10
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all ${getScoreBarColor(dimension.score)}`}
          style={{ width: `${dimension.score * 10}%` }}
        />
      </div>
      {dimension.pros.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-1">优点</p>
          {dimension.pros.map((p, i) => (
            <p key={i} className="text-sm text-green-700">+ {p}</p>
          ))}
        </div>
      )}
      {dimension.cons.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1">不足</p>
          {dimension.cons.map((c, i) => (
            <p key={i} className="text-sm text-red-600">- {c}</p>
          ))}
        </div>
      )}
    </div>
  );
}
