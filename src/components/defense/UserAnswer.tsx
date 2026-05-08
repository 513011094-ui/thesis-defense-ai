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
    <div className="glass border-t border-white/30 p-4" style={{ borderRadius: 0 }}>
      <div className="flex gap-3 items-end">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
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
            className="w-full rounded-xl px-4 py-2.5 pr-20 resize-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm transition-all"
            style={{
              border: "1px solid var(--lp-border-strong)",
              color: "var(--lp-text-primary)",
            }}
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
      <p className="text-xs mt-1.5 ml-11" style={{ color: "var(--lp-text-subtle)" }}>Enter 发送 · Shift+Enter 换行</p>
    </div>
  );
}
