"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
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
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            上传论文文件（DOCX）
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
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
              <p className="text-gray-700">
                <span className="font-medium">{file.name}</span>
                <span className="text-gray-400 ml-2">
                  ({(file.size / 1024 / 1024).toFixed(1)}MB)
                </span>
              </p>
            ) : (
              <div>
                <p className="text-gray-500">点击此处选择文件</p>
                <p className="text-gray-400 text-sm mt-1">支持 DOCX 格式</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">学位类型</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value as DegreeType)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">专业领域 *</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="如：计算机科学与技术"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">论文标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="可选，自动识别"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">{error}</div>
        )}

        {isParsing && (
          <div className="bg-blue-50 text-blue-600 rounded-lg p-3 text-sm">{progress}</div>
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
    </Card>
  );
}
