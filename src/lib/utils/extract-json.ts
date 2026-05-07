/**
 * 从LLM输出文本中提取并解析JSON
 * @param text - LLM返回的原始文本
 * @param validator - 可选的字段校验函数
 * @returns 解析成功返回对象，失败返回null
 */
export function extractJSON<T>(
  text: string,
  validator?: (data: Record<string, unknown>) => boolean
): T | null {
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) return null;

  try {
    const data = JSON.parse(jsonMatch[0]);
    if (validator && !validator(data)) return null;
    return data as T;
  } catch {
    return null;
  }
}
