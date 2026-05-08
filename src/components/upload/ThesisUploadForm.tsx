"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useThesisParser } from "@/hooks/useThesisParser";
import { useDefenseStore } from "@/store/defenseStore";
import type { DegreeType } from "@/types/thesis";

export default function ThesisUploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { parse, isParsing, error, progress } = useThesisParser();
  const setThesisData = useDefenseStore((s) => s.setThesisData);

  const [file, setFile] = useState<File | null>(null);
  const [degree, setDegree] = useState<DegreeType>("硕士");
  const [major, setMajor] = useState("");
  const [title, setTitle] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !major) return;

    try {
      const result = await parse(file, degree, major, title);
      setThesisData(result);
      router.push("/defense");
    } catch {
      // error is handled by the hook
    }
  };

  return (
    <div className="glass-card p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--lp-text-primary)" }}>
            上传论文文件（DOCX）
          </label>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
            style={{
              borderColor: "var(--lp-border-strong)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--lp-text-strong)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--lp-border-strong)")}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <p style={{ color: "var(--lp-text-primary)" }}>
                <span className="font-medium">{file.name}</span>
                <span className="ml-2" style={{ color: "var(--lp-text-subtle)" }}>
                  ({(file.size / 1024 / 1024).toFixed(1)}MB)
                </span>
              </p>
            ) : (
              <div>
                <p style={{ color: "var(--lp-text-muted)" }}>点击此处选择文件</p>
                <p className="text-sm mt-1" style={{ color: "var(--lp-text-subtle)" }}>支持 DOCX 格式</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--lp-text-primary)" }}>学位类型</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value as DegreeType)}
              className="w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
              style={{ border: "1px solid var(--lp-border-strong)", color: "var(--lp-text-primary)" }}
            >
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--lp-text-primary)" }}>专业领域 *</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="如：计算机科学与技术"
              className="w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
              style={{ border: "1px solid var(--lp-border-strong)", color: "var(--lp-text-primary)" }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--lp-text-primary)" }}>论文标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="可选，自动识别"
              className="w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300"
              style={{ border: "1px solid var(--lp-border-strong)", color: "var(--lp-text-primary)" }}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg p-3 text-sm" style={{ background: "#fef2f2", color: "#dc2626" }}>{error}</div>
        )}

        {isParsing && (
          <div className="rounded-lg p-3 text-sm" style={{ background: "rgba(25, 25, 25, 0.03)", color: "var(--lp-text-muted)" }}>{progress}</div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isParsing}
          disabled={!file || !major}
        >
          {isParsing ? "正在解析论文..." : "开始模拟答辩"}
        </Button>
      </form>
    </div>
  );
}
