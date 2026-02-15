import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { code, language, question } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    system: `You are an expert programming assistant. Answer questions about the provided ${language} code clearly and concisely.`,
    messages: [
      {
        role: 'user',
        content: `Here's the ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nQuestion: ${question}`
      }
    ],
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
