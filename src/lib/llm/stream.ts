/** 从ReadableStream中读取完整文本 */
export async function readStreamText(stream: ReadableStream<string>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += typeof value === "string" ? value : decoder.decode(value, { stream: true });
  }

  return result;
}

/** 将ReadableStream转为SSE Response */
export function streamToResponse(stream: ReadableStream<string>): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/** 将文本转为SSE格式的Response */
export function textToSSEResponse(text: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // 模拟流式输出，每次发送一小段
      const chunks = text.match(/.{1,20}/g) || [text];
      let i = 0;
      const interval = setInterval(() => {
        if (i < chunks.length) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunks[i] })}\n\n`));
          i++;
        } else {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          clearInterval(interval);
        }
      }, 30);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
