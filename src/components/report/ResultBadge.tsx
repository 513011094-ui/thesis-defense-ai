import { getResultColor } from "@/lib/utils/score-colors";

interface ResultBadgeProps {
  result: string;
  overallScore: number;
}

export default function ResultBadge({ result, overallScore }: ResultBadgeProps) {

  return (
    <div className="text-center py-8">
      <div className="text-6xl font-bold text-gray-900 mb-2">
        {overallScore}
        <span className="text-2xl text-gray-400">/10</span>
      </div>
      <span className={`inline-block px-6 py-2 rounded-full text-lg font-semibold border ${getResultColor(result)}`}>
        {result}
      </span>
    </div>
  );
}
