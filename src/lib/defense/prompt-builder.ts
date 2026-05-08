import type { ThesisChapter } from "@/types/thesis";
import type { DefenseMessage } from "@/types/defense";
import type { MentorRole } from "@/types/mentor";

/** 构建论文章节结构摘要 */
export function buildStructureSummary(chapters: ThesisChapter[]): string {
  return chapters
    .map((ch) => `- 第${ch.index + 1}部分 "${ch.title}": ${ch.summary}`)
    .join("\n");
}

/** 获取当前章节全文 + 其他章节摘要 */
export function buildChapterContext(
  chapters: ThesisChapter[],
  currentIndex: number
): string {
  return chapters
    .map((ch) => {
      if (ch.index === currentIndex) {
        return `### 当前章节：${ch.title}\n${ch.content}`;
      }
      return `### ${ch.title}\n${ch.summary}`;
    })
    .join("\n\n");
}

/** 构建对话历史 */
export function buildMessageHistory(messages: DefenseMessage[]): string {
  return messages
    .filter((m) => m.sender !== "system")
    .map((m) => {
      if (m.sender === "mentor") {
        return `[${m.content}]`;
      }
      return `学生回答：${m.content}`;
    })
    .join("\n\n");
}

/** 构建提问阶段的用户消息 */
export function buildQuestionUserMessage(
  chapters: ThesisChapter[],
  currentIndex: number,
  messageHistory: DefenseMessage[],
  mentorRole?: MentorRole
): string {
  const chapterContext = buildChapterContext(chapters, currentIndex);
  const history = buildMessageHistory(messageHistory);

  let msg = `## 论文内容\n\n${chapterContext}`;

  if (history) {
    msg += `\n\n## 已有对话记录\n\n${history}`;
  }

  // 导师3（学术拓展导师）需要特殊指令：复盘前面的回答
  if (mentorRole === "expansion" && history) {
    msg += `\n\n## 特别指令
你是学术拓展导师林婉清教授。请仔细分析上面的对话记录：
- 如果这是你的第1或第2个问题：从学生的回答中找出优点或漏洞，引用具体回答内容进行追问。指出矛盾、含糊或不充分的地方。
- 如果这是你的第3个问题：提出一个发散性的开放问题，跳出论文本身考察思维广度。
只输出问题，不要输出其他内容。`;
  } else {
    msg += `\n\n请基于以上论文内容提出一个专业问题。只输出问题，不要输出其他内容。`;
  }

  return msg;
}

/** 构建追问决策的用户消息 */
export function buildFollowUpUserMessage(
  originalQuestion: string,
  userAnswer: string,
  chapters: ThesisChapter[],
  chapterIndex: number,
  followUpCount: number,
  consecutivePoorCount: number,
  stressLevel: number
): string {
  const currentChapter = chapters[chapterIndex];
  const chapterList = chapters
    .map((ch, i) => `- 第${i + 1}部分：${ch.title}`)
    .join("\n");

  return `## 上下文
- 当前压力等级：${stressLevel}/5
- 当前问题已追问轮数：${followUpCount}/3
- 用户连续回答不佳次数：${consecutivePoorCount}/2

## 论文章节结构
${chapterList}

## 原始问题
${originalQuestion}

## 用户回答
${userAnswer}

## 当前章节内容（${currentChapter?.title || "未知"}）
${currentChapter?.content?.slice(0, 3000) || "无"}

请根据决策规则判断是否需要追问。如果追问，必须在anchor_chapter中注明引用的章节，在anchor_content中引用论文原文或数据。输出JSON结果。`;
}

/** 构建评审评分的用户消息 */
export function buildEvaluationUserMessage(
  messageHistory: DefenseMessage[]
): string {
  const history = buildMessageHistory(messageHistory);
  return `## 完整答辩记录\n\n${history}\n\n请根据以上答辩记录，按照评分标准输出JSON格式的评分报告。`;
}
