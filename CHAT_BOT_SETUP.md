# ISAV Academy Chat Bot Setup

This guide explains how to set up and configure the AI-powered chat bot for ISAV Academy.

## Prerequisites

1. Node.js and npm installed
2. A Google Cloud account with the Generative AI API enabled
3. An API key for Google's Generative AI

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install @google/generative-ai
   ```

2. **Set Up Environment Variables**
   - Create a `.env` file in the root directory of your project
   - Add your Google API key:
     ```
     REACT_APP_GEMINI_API_KEY=your_api_key_here
     ```
   - Make sure to add `.env` to your `.gitignore` file

3. **Using the Chat Bot**
   - The chat widget is available on all pages
   - Click the chat icon in the bottom-left corner to open the chat
   - The bot is pre-configured to answer questions about ISAV Academy

## Customization

You can customize the bot's behavior by modifying the prompt in `src/services/aiService.ts`. The current prompt is in Arabic and is configured to:

1. Answer questions about ISAV Academy (registration, services, programs, training courses)
2. Provide reliable and simplified information about agriculture, veterinary medicine, and sciences
3. Politely decline to answer questions outside these domains

## Troubleshooting

- If you see the message "Chat service is currently unavailable," check:
  1. Your API key is correctly set in the `.env` file
  2. The API key has the necessary permissions
  3. You have an active internet connection

## Security Notes

- Never commit your API key to version control
- Consider implementing rate limiting for production use
- Monitor your API usage to prevent unexpected charges
