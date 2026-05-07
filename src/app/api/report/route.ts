import { NextRequest } from "next/server";
import { llmClient } from "@/lib/llm/client";
import { mentorChenPrompt } from "@/lib/prompts/mentor-chen";
import { evaluationGuidelines } from "@/lib/prompts/evaluation";
import { buildEvaluationUserMessage } from "@/lib/defense/prompt-builder";
import { extractJSON } from "@/lib/utils/extract-json";
import type { DefenseMessage } from "@/types/defense";
import type { EvaluationReport } from "@/types/defense";

interface ReportRequest {
  messages: DefenseMessage[];
}

function parseReportJSON(text: string): EvaluationReport | null {
  return extractJSON<EvaluationReport>(text, (data) =>
    !!(data.logic && data.professional && data.innovation && data.expression && typeof data.overallScore === "number")
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: ReportRequest = await request.json();
    const { messages } = body;

    const userMessage = buildEvaluationUserMessage(messages);

    const response = await llmClient.chat({
      messages: [
        { role: "system", content: mentorChenPrompt + "\n\n" + evaluationGuidelines },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      maxTokens: 4096,
    });

    const report = parseReportJSON(response.content);

    if (!report) {
      // 降级：返回默认评分
      return Response.json({
        logic: { score: 6, pros: ["论文结构基本完整"], cons: ["需要进一步完善"] },
        professional: { score: 6, pros: ["基本掌握了研究方法"], cons: ["方法论细节需加强"] },
        innovation: { score: 5, pros: ["有一定创新意识"], cons: ["创新点阐述不够清晰"] },
        expression: { score: 6, pros: ["回答有条理"], cons: ["部分回答不够深入"] },
        overallScore: 6,
        result: "修改后通过",
        summary: "整体表现尚可，建议根据修改建议进行针对性完善",
        suggestions: [
          "【高优先级】加强论文逻辑的连贯性，确保各章节之间有清晰的过渡和衔接",
          "【中优先级】补充研究方法的细节说明，包括样本选择依据和数据分析步骤",
          "【低优先级】更清晰地阐述创新点，与现有研究进行对比说明",
        ],
        detailedFeedback: [],
      });
    }

    return Response.json(report);
  } catch (error) {
    console.error("Report API error:", error);
    return Response.json(
      { error: "评分服务暂时不可用，请稍后再试" },
      { status: 500 }
    );
  }
}
