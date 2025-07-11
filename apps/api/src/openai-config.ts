import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function getChatResponse(
  messages: ChatMessage[],
  systemMessage?: string
): Promise<string> {
  try {
    const systemPrompt =
      systemMessage ||
      'You are a helpful AI assistant for a car dealership. You can help customers with information about cars, features, pricing, and general questions. Be friendly, knowledgeable, and helpful. If asked about specific cars, refer to the car inventory when possible.';

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Return a helpful error message without exposing internal details
    if (error instanceof Error && error.message.includes('API key')) {
      return "I'm sorry, the AI service is not properly configured. Please check back later.";
    }

    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
  }
}

export function isOpenAIConfigured(): boolean {
  return !!(
    process.env.OPENAI_API_KEY
  );
}
