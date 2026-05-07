"use client";

import { useState } from "react";
import { parseDOCX } from "@/lib/thesis/docx-parser";
import { parseThesis } from "@/lib/thesis/structure";
import type { DegreeType, ThesisParseResult } from "@/types/thesis";

interface UseThesisParserReturn {
  parse: (file: File, degree: DegreeType, major: string, title: string) => Promise<ThesisParseResult>;
  isParsing: boolean;
  error: string | null;
  progress: string;
}

export function useThesisParser(): UseThesisParserReturn {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  const parse = async (
    file: File,
    degree: DegreeType,
    major: string,
    title: string
  ): Promise<ThesisParseResult> => {
    setIsParsing(true);
    setError(null);
    setProgress("正在解析文件...");

    try {
      if (!file.name.endsWith(".docx")) {
        throw new Error("请上传DOCX格式的文件");
      }

      setProgress("正在解析DOCX...");
      const text = await parseDOCX(file);

      if (!text || text.trim().length < 100) {
        throw new Error("文件内容过少或无法解析，请检查文件是否正确");
      }

      setProgress("正在识别论文结构...");
      const result = parseThesis(text, degree, major, title);

      setProgress("解析完成");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "解析失败，请重试";
      setError(message);
      throw err;
    } finally {
      setIsParsing(false);
    }
  };

  return { parse, isParsing, error, progress };
}
