import type { ThesisChapter, ThesisInfo, ThesisParseResult, DegreeType } from "@/types/thesis";

/** 章节标题正则匹配模式 */
const CHAPTER_PATTERNS = [
  /^第[一二三四五六七八九十\d]+[章部篇]/,
  /^Chapter\s+\d+/i,
  /^第\d+章/,
  /^\d+\.\s+\S+/,
  /^[一二三四五六七八九十]+[、.]\s*\S+/,
  /^摘要|^Abstract|^ABSTRACT|^目录|^关键词|^Keywords|^引言|^绪论|^结论|^参考文献|^致谢|^附录/i,
];

/** 判断一行是否是章节标题 */
function isChapterTitle(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 50) return false;
  return CHAPTER_PATTERNS.some((pattern) => pattern.test(trimmed));
}

/** 按章节分割文本 */
export function splitIntoChapters(text: string): ThesisChapter[] {
  const lines = text.split("\n");
  const chapters: ThesisChapter[] = [];
  let currentTitle = "前言";
  let currentContent: string[] = [];
  let index = 0;

  for (const line of lines) {
    if (isChapterTitle(line)) {
      // 保存上一个章节
      if (currentContent.length > 0) {
        const content = currentContent.join("\n").trim();
        if (content.length > 0) {
          chapters.push({
            index,
            title: currentTitle,
            content,
            summary: content.slice(0, 200) + (content.length > 200 ? "..." : ""),
          });
          index++;
        }
      }
      currentTitle = line.trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // 保存最后一个章节
  if (currentContent.length > 0) {
    const content = currentContent.join("\n").trim();
    if (content.length > 0) {
      chapters.push({
        index,
        title: currentTitle,
        content,
        summary: content.slice(0, 200) + (content.length > 200 ? "..." : ""),
      });
    }
  }

  return chapters;
}

/** 提取摘要 */
export function extractAbstract(text: string): string {
  // 尝试匹配中文摘要
  const zhMatch = text.match(/摘\s*要[\s:：]*([\s\S]{50,1000}?)(?:关键词|Keywords|Abstract|第|一、|1\.)/);
  if (zhMatch) return zhMatch[1].trim();

  // 尝试匹配英文摘要
  const enMatch = text.match(/Abstract[\s:：]*([\s\S]{50,1000}?)(?:Keywords|Keywords|第|一、|1\.)/i);
  if (enMatch) return enMatch[1].trim();

  // 取前500字作为摘要
  return text.slice(0, 500).trim();
}

/** 估算字数 */
export function countWords(text: string): number {
  // 中文按字符计数，英文按单词计数
  const chineseChars = (text.match(/[一-龥]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
}

/** 检测学位类型（从文本推断） */
export function detectDegreeType(text: string): DegreeType {
  if (/博士|PhD|Ph\.D/i.test(text)) return "博士";
  if (/硕士|Master|MBA|M\.A\.|M\.S/i.test(text)) return "硕士";
  return "本科";
}

/** 检测研究方法 */
export function detectMethodology(text: string): string {
  const methods: string[] = [];
  if (/问卷|调查|量表|Likert/i.test(text)) methods.push("问卷调查");
  if (/实验|对照组|变量|假设/i.test(text)) methods.push("实验研究");
  if (/案例|Case\s+Study/i.test(text)) methods.push("案例分析");
  if (/访谈|质性|扎根理论/i.test(text)) methods.push("质性研究");
  if (/数据|统计|回归|相关分析/i.test(text)) methods.push("定量分析");
  if (/文献|综述|Meta/i.test(text)) methods.push("文献研究");
  return methods.length > 0 ? methods.join("、") : "未明确识别";
}

/** 完整解析论文 */
export function parseThesis(
  text: string,
  userDegree: DegreeType,
  userMajor: string,
  userTitle: string
): ThesisParseResult {
  const chapters = splitIntoChapters(text);
  const abstract = extractAbstract(text);
  const wordCount = countWords(text);

  const info: ThesisInfo = {
    title: userTitle || chapters[0]?.title || "未命名论文",
    degreeType: userDegree,
    major: userMajor,
    wordCount,
    chapterCount: chapters.length,
  };

  return { info, chapters, fullText: text, abstract };
}
