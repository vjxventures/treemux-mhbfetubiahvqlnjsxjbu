import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { code, language } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    system: `You are an expert code reviewer and mentor. Analyze the provided ${language} code and provide:
1. Brief explanation of what the code does
2. Potential bugs or issues
3. Performance optimizations
4. Best practices suggestions
5. Security considerations if applicable

Be concise, helpful, and constructive. Focus on actionable insights.`,
    messages: [
      {
        role: 'user',
        content: `Please analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
      }
    ],
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
