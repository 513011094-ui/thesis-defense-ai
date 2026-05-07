/** 学位类型 */
export type DegreeType = "本科" | "硕士" | "博士";

/** 论文信息 */
export interface ThesisInfo {
  title: string;
  degreeType: DegreeType;
  major: string;
  wordCount: number;
  chapterCount: number;
}

/** 章节结构 */
export interface ThesisChapter {
  index: number;
  title: string;
  content: string;
  summary: string;
}

/** 论文解析结果 */
export interface ThesisParseResult {
  info: ThesisInfo;
  chapters: ThesisChapter[];
  fullText: string;
  abstract: string;
}
