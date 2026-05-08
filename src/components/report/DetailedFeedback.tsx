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
    <div className="glass-card p-5 mb-6">
      <h3 className="font-medium mb-4" style={{ color: "var(--lp-text-strong)" }}>关键问题详细评价</h3>
      <div className="space-y-4">
        {feedbacks.map((fb, i) => (
          <div
            key={i}
            className="rounded-lg p-4"
            style={{ border: "1px solid var(--lp-border-divider)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium flex-1" style={{ color: "var(--lp-text-primary)" }}>
                问题{i + 1}：{fb.question}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ml-2 ${getEvalColor(fb.evaluation)}`}>
                {fb.evaluation}
              </span>
            </div>
            <div className="text-sm space-y-2" style={{ color: "var(--lp-text-muted)" }}>
              <p><span style={{ color: "var(--lp-text-subtle)" }}>回答要点：</span>{fb.answerSummary}</p>
              <p><span style={{ color: "var(--lp-text-subtle)" }}>导师评价：</span>{fb.feedback}</p>
              {fb.improvement && (
                <p style={{ color: "#2563eb" }}>
                  <span style={{ color: "var(--lp-text-subtle)" }}>改进建议：</span>{fb.improvement}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
