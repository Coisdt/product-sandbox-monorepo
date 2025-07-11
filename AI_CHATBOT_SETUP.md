# AI Chatbot Setup Guide

## Overview

The AI chatbot is now integrated into your car inventory application! It uses OpenAI's GPT-3.5 Turbo model to provide intelligent responses about your car inventory and general assistance.

## Features

- 🤖 Intelligent AI responses using OpenAI's GPT-3.5 Turbo
- 🚗 Car inventory knowledge integration
- 💬 Conversational interface with chat history
- 📱 Responsive design that works on all devices
- 🎨 Beautiful, modern UI with smooth animations

## Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the API key (it starts with `sk-`)

### 2. Configure the Environment Variable

Create a `.env` file in the root of your project and add:

```
OPENAI_API_KEY=your-actual-api-key-here
```

### 3. Restart Your Development Server

After adding the API key, restart your development servers:

```bash
# Terminal 1 - API Server
npm run dev:api

# Terminal 2 - Frontend
npm run dev:frontend
```

## Usage

1. Open your car inventory application
2. Click the "🤖 AI Assistant" button in the top-right corner
3. Start chatting with the AI about cars, inventory, or any questions you have!

## Fallback Mode

If no OpenAI API key is configured, the chatbot will use mock responses so you can still test the interface.

## Cost Considerations

- OpenAI charges per token (input and output)
- GPT-3.5 Turbo is cost-effective for most use cases
- Monitor your usage in the OpenAI dashboard

## Troubleshooting

- **"AI service is not properly configured"** - Check your API key in the .env file
- **"Having trouble connecting"** - Verify your internet connection and API key validity
- **Chat not opening** - Check the browser console for JavaScript errors

## Customization

You can modify the AI's behavior by editing the system prompt in `apps/api/src/main.ts` around line 45.

Enjoy your new AI assistant! 🚀
