import { getResultColor } from "@/lib/utils/score-colors";

interface ResultBadgeProps {
  result: string;
  overallScore: number;
}

export default function ResultBadge({ result, overallScore }: ResultBadgeProps) {
  return (
    <div className="glass-card text-center py-8 mb-6">
      <div className="text-6xl font-bold mb-2" style={{ color: "var(--lp-text-strong)" }}>
        {overallScore}
        <span className="text-2xl" style={{ color: "var(--lp-text-subtle)" }}>/10</span>
      </div>
      <span className={`inline-block px-6 py-2 rounded-full text-lg font-semibold border ${getResultColor(result)}`}>
        {result}
      </span>
    </div>
  );
}
