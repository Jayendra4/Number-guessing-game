# Chatbot Integration Guide

## Overview
This guide explains how to integrate the Number Guessing Game with various chatbot platforms.

## API Reference

### Base URL
```
http://localhost:3000/api/chatbot
```

### Request Format
```json
{
  "sessionId": "unique_user_identifier",
  "message": "user_message_or_number",
  "difficulty": "easy" // optional, defaults to "easy"
}
```

### Response Format
```json
{
  "success": true,
  "sessionId": "unique_user_identifier",
  "response": "Game response message",
  "attemptsRemaining": 5,
  "gameOver": false,
  "won": false
}
```

## Platform-Specific Integration

### 1. Discord Bot

#### Setup
```bash
npm init -y
npm install discord.js axios
```

#### Bot Code
```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

const API_URL = 'http://localhost:3000/api/chatbot';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Only respond to messages starting with !guess
    if (!message.content.startsWith('!guess')) return;
    
    const userMessage = message.content.slice(7).trim();
    
    try {
        const response = await axios.post(API_URL, {
            sessionId: message.author.id,
            message: userMessage,
            difficulty: 'easy'
        });
        
        // Create embed for better formatting
        const embed = {
            color: response.data.success ? 0x00ff00 : 0xff0000,
            title: '🎮 Number Guessing Game',
            description: response.data.response,
            fields: [
                {
                    name: 'Attempts Remaining',
                    value: response.data.attemptsRemaining || 'N/A',
                    inline: true
                },
                {
                    name: 'Difficulty',
                    value: 'Easy',
                    inline: true
                }
            ],
            footer: {
                text: 'Type !guess <number> to play'
            }
        };
        
        message.reply({ embeds: [embed] });
        
    } catch (error) {
        console.error('Error:', error);
        message.reply('❌ Sorry, there was an error with the game server.');
    }
});

client.login('YOUR_DISCORD_BOT_TOKEN');
```

#### Commands
- `!guess 25` - Make a guess
- `!guess start` - Start new game
- `!guess help` - Get help
- `!guess status` - Check game status

### 2. Telegram Bot

#### Setup
```bash
npm install node-telegram-bot-api axios
```

#### Bot Code
```javascript
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });
const API_URL = 'http://localhost:3000/api/chatbot';

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    // Skip if message is from bot
    if (msg.from.is_bot) return;
    
    try {
        const response = await axios.post(API_URL, {
            sessionId: chatId.toString(),
            message: text,
            difficulty: 'easy'
        });
        
        // Format response with emojis
        let responseText = `🎮 ${response.data.response}`;
        
        if (response.data.attemptsRemaining) {
            responseText += `\n\n📊 Attempts remaining: ${response.data.attemptsRemaining}`;
        }
        
        if (response.data.gameOver) {
            responseText += `\n\n🎯 Type any message to start a new game!`;
        }
        
        bot.sendMessage(chatId, responseText);
        
    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, '❌ Sorry, there was an error with the game server.');
    }
});

console.log('Telegram bot is running...');
```

### 3. Slack Bot

#### Setup
```bash
npm install @slack/bolt axios
```

#### Bot Code
```javascript
const { App } = require('@slack/bolt');
const axios = require('axios');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

const API_URL = 'http://localhost:3000/api/chatbot';

app.message(async ({ message, say }) => {
    try {
        const response = await axios.post(API_URL, {
            sessionId: message.user,
            message: message.text,
            difficulty: 'easy'
        });
        
        // Create Slack blocks for rich formatting
        const blocks = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*🎮 Number Guessing Game*\n\n${response.data.response}`
                }
            }
        ];
        
        if (response.data.attemptsRemaining) {
            blocks.push({
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `📊 Attempts remaining: ${response.data.attemptsRemaining}`
                    }
                ]
            });
        }
        
        await say({ blocks });
        
    } catch (error) {
        console.error('Error:', error);
        await say('❌ Sorry, there was an error with the game server.');
    }
});

app.start(process.env.PORT || 3000);
console.log('Slack bot is running...');
```

### 4. WhatsApp Bot (using Twilio)

#### Setup
```bash
npm install twilio axios express
```

#### Bot Code
```javascript
const twilio = require('twilio');
const axios = require('axios');
const express = require('express');

const app = express();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const API_URL = 'http://localhost:3000/api/chatbot';

app.use(express.urlencoded({ extended: false }));

app.post('/webhook', async (req, res) => {
    const { From, Body } = req.body;
    
    try {
        const response = await axios.post(API_URL, {
            sessionId: From,
            message: Body,
            difficulty: 'easy'
        });
        
        const message = client.messages.create({
            from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
            to: From,
            body: `🎮 ${response.data.response}`
        });
        
        res.status(200).send('OK');
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error');
    }
});

app.listen(3001, () => {
    console.log('WhatsApp bot webhook running on port 3001');
});
```

### 5. Facebook Messenger Bot

#### Setup
```bash
npm install express axios
```

#### Bot Code
```javascript
const express = require('express');
const axios = require('axios');

const app = express();
const API_URL = 'http://localhost:3000/api/chatbot';
const PAGE_ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN';

app.use(express.json());

app.post('/webhook', async (req, res) => {
    const { entry } = req.body;
    
    for (const event of entry) {
        if (event.messaging) {
            for (const message of event.messaging) {
                if (message.message && message.message.text) {
                    await handleMessage(message.sender.id, message.message.text);
                }
            }
        }
    }
    
    res.status(200).send('OK');
});

async function handleMessage(senderId, text) {
    try {
        const response = await axios.post(API_URL, {
            sessionId: senderId,
            message: text,
            difficulty: 'easy'
        });
        
        await sendMessage(senderId, response.data.response);
        
    } catch (error) {
        console.error('Error:', error);
        await sendMessage(senderId, '❌ Sorry, there was an error with the game server.');
    }
}

async function sendMessage(senderId, text) {
    const response = await axios.post(
        `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        {
            recipient: { id: senderId },
            message: { text: text }
        }
    );
    
    return response.data;
}

app.listen(3001, () => {
    console.log('Facebook Messenger bot webhook running on port 3001');
});
```

## Advanced Features

### 1. Multiplayer Support
```javascript
// Create a room-based system
const createRoom = async (roomId) => {
    const response = await axios.post('http://localhost:3000/api/game/start', {
        sessionId: roomId,
        difficulty: 'easy'
    });
    return response.data;
};

// Multiple users can join the same room
const joinRoom = async (roomId, userId) => {
    // Store user-room mapping
    userRooms.set(userId, roomId);
};
```

### 2. Leaderboard Integration
```javascript
const updateLeaderboard = async (userId, score) => {
    // Store scores in database
    await db.scores.create({
        userId: userId,
        score: score,
        timestamp: new Date()
    });
};
```

### 3. Custom Difficulty Levels
```javascript
const customDifficulty = {
    beginner: { maxAttempts: 15, range: 50 },
    intermediate: { maxAttempts: 10, range: 100 },
    expert: { maxAttempts: 5, range: 200 }
};
```

## Testing Your Integration

### 1. Test API Endpoints
```bash
# Start game
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test123","message":"start"}'

# Make guess
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test123","message":"50"}'
```

### 2. Test Bot Responses
```javascript
// Test different scenarios
const testCases = [
    'start',
    '25',
    'help',
    'status',
    'invalid input'
];

testCases.forEach(async (testCase) => {
    const response = await axios.post(API_URL, {
        sessionId: 'test',
        message: testCase
    });
    console.log(`Input: ${testCase} -> Output: ${response.data.response}`);
});
```

## Deployment Considerations

### 1. Environment Variables
```bash
# Production
export API_URL=https://your-api-domain.com/api/chatbot
export NODE_ENV=production
export PORT=3000
```

### 2. Error Handling
```javascript
const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    
    // Log to monitoring service
    // Send alert to admin
    // Return user-friendly message
};
```

### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/chatbot', limiter);
```

## Support and Troubleshooting

### Common Issues
1. **Session not found**: User needs to start a new game
2. **Invalid input**: Validate user input before sending to API
3. **API timeout**: Implement retry logic and fallback responses

### Debug Mode
```javascript
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
    console.log('API Request:', requestData);
    console.log('API Response:', responseData);
}
```

For more help, refer to the main DEPLOYMENT.md file or contact the development team.
