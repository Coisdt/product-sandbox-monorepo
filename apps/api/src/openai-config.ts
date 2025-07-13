import OpenAI from 'openai';
import { tools, executeToolCall } from './ai-tools';

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
      'You are a helpful AI assistant for a car dealership. You can help customers with information about cars, features, pricing, and general questions. Be friendly, knowledgeable, and helpful. Use the getCars tool to get current inventory information when customers ask about cars.';

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
      tools,
      tool_choice: 'auto',
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message;

    if (!response) {
      return "I'm sorry, I couldn't generate a response.";
    }

    // Check if the model wants to call tools
    if (response.tool_calls && response.tool_calls.length > 0) {
      // Execute tool calls
      const toolResults = [];

      for (const toolCall of response.tool_calls) {
        try {
          const result = await executeToolCall(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments || '{}')
          );

          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool' as const,
            name: toolCall.function.name,
            content: JSON.stringify(result),
          });
        } catch (error) {
          console.error('Tool execution error:', error);
          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool' as const,
            name: toolCall.function.name,
            content: JSON.stringify({ error: 'Failed to execute tool' }),
          });
        }
      }

      // Add the assistant's tool call message and tool results to the conversation
      const updatedMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...chatMessages,
        {
          role: 'assistant',
          content: response.content,
          tool_calls: response.tool_calls,
        },
        ...toolResults,
      ];

      // Get the final response after tool execution
      const finalCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: updatedMessages,
        max_tokens: 500,
        temperature: 0.7,
      });

      return (
        finalCompletion.choices[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response after using the tools."
      );
    }

    return response.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Return a helpful error message without exposing internal details
    if (error instanceof Error && error.message.includes('API key')) {
      return "I'm sorry, the AI service is not properly configured. Please check the OpenAI API key configuration.";
    }

    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
  }
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
