interface SuggestionListProps {
  suggestions: string[];
  summary: string;
}

function getPriorityTag(suggestion: string): { label: string; color: string } | null {
  if (suggestion.includes("高优先级")) return { label: "高", color: "bg-red-100 text-red-700" };
  if (suggestion.includes("中优先级")) return { label: "中", color: "bg-yellow-100 text-yellow-700" };
  if (suggestion.includes("低优先级")) return { label: "低", color: "bg-green-100 text-green-700" };
  return null;
}

function cleanSuggestion(suggestion: string): string {
  return suggestion.replace(/【[高中低]优先级】\s*/g, "").trim();
}

export default function SuggestionList({ suggestions, summary }: SuggestionListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <h3 className="font-medium text-gray-900 mb-3">修改建议</h3>
      <p className="text-gray-600 text-sm mb-4 pb-4 border-b border-gray-100">
        {summary}
      </p>
      <ul className="space-y-3">
        {suggestions.map((s, i) => {
          const priority = getPriorityTag(s);
          const text = cleanSuggestion(s);
          return (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1">
                {priority && (
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mr-2 ${priority.color}`}>
                    {priority.label}
                  </span>
                )}
                {text}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
