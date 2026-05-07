/** 评分颜色映射工具 */

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-blue-600";
  if (score >= 4) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreBg(score: number): string {
  if (score >= 8) return "bg-green-50";
  if (score >= 6) return "bg-blue-50";
  if (score >= 4) return "bg-yellow-50";
  return "bg-red-50";
}

export function getScoreBarColor(score: number): string {
  if (score >= 8) return "bg-green-400";
  if (score >= 6) return "bg-blue-400";
  if (score >= 4) return "bg-yellow-400";
  return "bg-red-400";
}

export function getResultColor(result: string): string {
  if (result === "通过") return "bg-green-100 text-green-800 border-green-200";
  if (result === "修改后通过") return "bg-blue-100 text-blue-800 border-blue-200";
  if (result === "修改后重审") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
}
