/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';

import { carDataset } from './car.interface';
import {
  getChatResponse,
  isOpenAIConfigured,
  type ChatMessage,
} from './openai-config';

const app = express();

// Configure CORS to allow requests from the frontend
app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
  })
);

// Add JSON parsing middleware
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api, Francois!' });
});

app.get('/api/cars', (_, res) => {
  res.send(carDataset);
});

// Streaming chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('📨 Received chat request:', req.body);

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.log('❌ Invalid messages format');
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log('💬 Messages:', messages);

    // Convert messages to the format expected by OpenAI
    const chatMessages: ChatMessage[] = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    console.log('📤 Prepared chat messages:', chatMessages);

    if (isOpenAIConfigured()) {
      console.log('🤖 Using OpenAI API with streaming');
      try {
        // Use OpenAI API with streaming
        const result = await getChatResponse(
          chatMessages,
          `You are a helpful AI assistant for a car dealership. You can help customers with information about cars, features, pricing, and general questions. Be friendly, knowledgeable, and helpful. 
          
          When customers ask about cars, inventory, or want to see what's available, use the getCars tool to get the current car inventory data. This will give you accurate, up-to-date information about all the cars we have available including their make, model, year, price, features, and other details.
          
          Always use the tool when you need car inventory information rather than making assumptions.`
        );

        // Convert to a streaming response that the AI SDK can understand
        return result.pipeDataStreamToResponse(res);
      } catch (aiError) {
        console.error('❌ AI streaming error:', aiError);

        // Handle specific AI errors
        let errorMessage =
          "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";

        if (aiError instanceof Error) {
          if (aiError.message.includes('API key')) {
            errorMessage =
              "I'm sorry, the AI service is not properly configured. Please check the OpenAI API key configuration.";
          } else if (aiError.message.includes('401')) {
            errorMessage =
              'Authentication failed. Please check your OpenAI API key.';
          } else if (aiError.message.includes('insufficient_quota')) {
            errorMessage =
              'OpenAI API quota exceeded. Please check your billing settings.';
          }
        }

        return res.json({ error: errorMessage });
      }
    } else {
      console.log('⚠️ OpenAI not configured, using mock response');
      // Fallback to mock responses when OpenAI is not configured
      const mockResponses = [
        "I'm here to help! However, to provide you with accurate car inventory information, I need the OpenAI API to be configured.",
        "That's a great question! To access our current car inventory and provide detailed information, please configure the OpenAI API key.",
        'I can help you with car information, but I need the AI service to be properly configured first.',
        'Would you like to know about cars? Please set up the OpenAI API key to enable full AI capabilities with access to our car inventory.',
        'To provide you with detailed car information and inventory access, please configure your OpenAI API key in the environment variables.',
        '⚠️  AI service not configured: Please add your OPENAI_API_KEY to environment variables to enable full chatbot functionality with car inventory access.',
      ];

      const responseMessage =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];

      // Add a small delay to simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return res.json({ message: responseMessage });
    }
  } catch (error) {
    console.error('❌ Chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  console.log(`OpenAI configured: ${isOpenAIConfigured()}`);
  if (!isOpenAIConfigured()) {
    console.log(
      '⚠️  Add OPENAI_API_KEY to environment variables to enable AI chatbot functionality'
    );
  }
});
server.on('error', console.error);
