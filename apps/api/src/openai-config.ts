import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { tools } from './ai-tools';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getChatResponse(
  messages: ChatMessage[],
  systemMessage?: string
) {
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

    // Use streamText for real-time streaming responses
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: formattedMessages,
      tools,
      maxTokens: 500,
      temperature: 0.7,
      maxSteps: 10,
    });

    console.log('✅ AI Stream initiated');

    // Return the stream result for the API endpoint to handle
    return result;
  } catch (error) {
    console.error('❌ AI API error:', error);

    // For errors, we'll throw them so the API endpoint can handle them
    throw error;
  }
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
