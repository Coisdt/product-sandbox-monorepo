import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { tools } from './ai-tools';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getChatResponse(
  messages: ChatMessage[],
  systemMessage?: string
): Promise<string> {
  try {
    console.log('🔑 OpenAI API Key configured:', !!process.env.OPENAI_API_KEY);
    console.log('📝 Input messages:', messages);

    const systemPrompt =
      systemMessage ||
      `You are a helpful AI assistant for a car dealership. You can help customers with information about cars, features, pricing, and general questions. Be friendly, knowledgeable, and helpful.

IMPORTANT: When customers ask about cars, inventory, what's available, car models, prices, or want to see cars, you MUST use the getCars tool to get the current inventory data. Do not make assumptions about what cars are available - always use the tool to get real data.

Examples of when to use getCars tool:
- "What cars do you have?"
- "Show me your inventory"
- "What Honda models do you have?"
- "How much does a Toyota cost?"
- "What's available?"`;

    // Convert messages to the format expected by Vercel AI SDK
    const formattedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    console.log('🔄 Formatted messages for AI:', formattedMessages);
    console.log('🛠️ Available tools:', Object.keys(tools));

    // Use generateText for simple request/response (no streaming)
    const result = await generateText({
      model: openai('gpt-3.5-turbo'),
      messages: formattedMessages,
      tools,
      maxTokens: 500,
      temperature: 0.7,
      maxSteps: 2,
    });

    console.log('✅ AI Response received:', result.text);

    return result.text;
  } catch (error) {
    console.error('❌ AI API error:', error);

    // Return a helpful error message
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return "I'm sorry, the AI service is not properly configured. Please check the OpenAI API key configuration.";
      }
      if (error.message.includes('401')) {
        return 'Authentication failed. Please check your OpenAI API key.';
      }
    }

    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
  }
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
