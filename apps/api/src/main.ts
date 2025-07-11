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

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Convert history to the format expected by OpenAI
    const chatMessages: ChatMessage[] = [];

    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          chatMessages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      });
    }

    // Add the current message
    chatMessages.push({
      role: 'user',
      content: message,
    });

    let responseMessage: string;

    if (isOpenAIConfigured()) {
      // Use OpenAI API
      responseMessage = await getChatResponse(
        chatMessages,
        `You are a helpful AI assistant for a car dealership. You can help customers with information about cars, features, pricing, and general questions. Be friendly, knowledgeable, and helpful. 
        
        Here's information about our current car inventory:
        ${JSON.stringify(carDataset, null, 2)}
        
        Use this information to help customers find the perfect car for their needs.`
      );
    } else {
      // Fallback to mock responses when OpenAI is not configured
      const mockResponses = [
        "I'm here to help! What would you like to know about cars?",
        "That's a great question! Based on the car inventory, I can help you find the perfect vehicle.",
        'I can help you with information about our car inventory, features, pricing, and more!',
        'Would you like me to help you find a specific type of car or compare different models?',
        'I can provide detailed information about any car in our inventory. What interests you most?',
        'Note: To enable full AI capabilities, please configure your OpenAI API key.',
      ];

      responseMessage =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];

      // Add a small delay to simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    res.json({ message: responseMessage });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
