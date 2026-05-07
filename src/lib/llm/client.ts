import type { LLMClient, LLMMessage, LLMOptions, LLMResponse } from "./types";

const BASE_URL = process.env.LLM_BASE_URL || "https://api.deepseek.com";
const API_KEY = process.env.DEEPSEEK_API_KEY || "";
const MODEL = process.env.LLM_MODEL || "deepseek-chat";

class DeepSeekClient implements LLMClient {
  private async request(body: object): Promise<Response> {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`LLM API error (${res.status}): ${error}`);
    }

    return res;
  }

  async chat(options: LLMOptions): Promise<LLMResponse> {
    const res = await this.request({
      model: MODEL,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
      stream: false,
    });

    const data = await res.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
    };
  }

  chatStream(options: LLMOptions): ReadableStream<string> {
    return new ReadableStream({
      start: async (controller) => {
        try {
          const res = await this.request({
            model: MODEL,
            messages: options.messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxTokens ?? 2048,
            stream: true,
          });

          const reader = res.body?.getReader();
          if (!reader) throw new Error("No response body");

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(content);
                }
              } catch {
                // skip malformed JSON
              }
            }
          }

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  }
}

/** 全局LLM客户端实例 */
export const llmClient = new DeepSeekClient();
