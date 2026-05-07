import type { QuestionFeedback } from "@/types/defense";

interface DetailedFeedbackProps {
  feedbacks: QuestionFeedback[];
}

export default function DetailedFeedback({ feedbacks }: DetailedFeedbackProps) {
  const getEvalColor = (evaluation: string) => {
    if (evaluation === "好") return "bg-green-100 text-green-700";
    if (evaluation === "一般") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <h3 className="font-medium text-gray-900 mb-4">关键问题详细评价</h3>
      <div className="space-y-4">
        {feedbacks.map((fb, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-gray-800 flex-1">
                问题{i + 1}：{fb.question}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ml-2 ${getEvalColor(fb.evaluation)}`}>
                {fb.evaluation}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p><span className="text-gray-400">回答要点：</span>{fb.answerSummary}</p>
              <p><span className="text-gray-400">导师评价：</span>{fb.feedback}</p>
              {fb.improvement && (
                <p className="text-blue-600">
                  <span className="text-gray-400">改进建议：</span>{fb.improvement}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
