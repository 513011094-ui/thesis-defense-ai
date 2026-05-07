"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface UserAnswerProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export default function UserAnswer({ onSubmit, disabled }: UserAnswerProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(answer.trim());
    setAnswer("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-4">
      <div className="flex gap-3 items-end">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
          我
        </div>
        <div className="flex-1 relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的回答..."
            disabled={disabled}
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-20 resize-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm transition-all"
          />
          <Button
            onClick={handleSubmit}
            disabled={disabled || !answer.trim()}
            size="sm"
            className="absolute right-2 bottom-2"
          >
            发送
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-300 mt-1.5 ml-11">Enter 发送 · Shift+Enter 换行</p>
    </div>
  );
}
