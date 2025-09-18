# Number Guessing Game - Deployment Guide

## Project Overview
This is a Java Swing-based number guessing game that has been converted to multiple deployment formats for different use cases.

## Deployment Options

### 1. Desktop Application (Original Java Swing)

#### Prerequisites
- Java 8 or higher installed
- Windows/Linux/Mac OS

#### Build and Deploy
1. **Using the provided build script:**
   ```bash
   # Windows
   build.bat
   
   # Linux/Mac
   chmod +x build.sh
   ./build.sh
   ```

2. **Manual build:**
   ```bash
   # Compile
   javac -d dist *.java
   
   # Create JAR
   cd dist
   jar cfm ../NumberGuessingGame.jar ../MANIFEST.MF *.class
   ```

3. **Run the application:**
   ```bash
   java -jar NumberGuessingGame.jar
   ```

#### Distribution
- Distribute the `NumberGuessingGame.jar` file
- Users need Java installed to run
- Double-click to run on most systems

### 2. Web Application

#### Prerequisites
- Web server (Apache, Nginx, or any static file server)
- Modern web browser

#### Deploy
1. Copy the `web-version/` folder contents to your web server
2. Access via browser: `http://your-domain.com/index.html`
3. No server-side processing required (pure HTML/CSS/JS)

#### Features
- Responsive design
- Same game logic as desktop version
- Chatbot integration ready
- Mobile-friendly

### 3. API Server (For Chatbot Integration)

#### Prerequisites
- Node.js 14 or higher
- npm or yarn

#### Setup and Deploy
1. **Install dependencies:**
   ```bash
   cd api-server
   npm install
   ```

2. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

3. **Environment variables (optional):**
   ```bash
   export PORT=3000
   ```

#### API Endpoints

##### Health Check
```
GET /health
```

##### Start Game
```
POST /api/game/start
Content-Type: application/json

{
  "sessionId": "user123",
  "difficulty": "easy" // or "hard"
}
```

##### Make Guess
```
POST /api/game/guess
Content-Type: application/json

{
  "sessionId": "user123",
  "guess": 42
}
```

##### Get Game Status
```
GET /api/game/status/user123
```

##### Chatbot Integration
```
POST /api/chatbot
Content-Type: application/json

{
  "sessionId": "user123",
  "message": "25",
  "difficulty": "easy"
}
```

## Chatbot Integration Examples

### Discord Bot Example
```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const API_URL = 'http://localhost:3000/api/chatbot';

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    try {
        const response = await axios.post(API_URL, {
            sessionId: message.author.id,
            message: message.content,
            difficulty: 'easy'
        });
        
        message.reply(response.data.response);
    } catch (error) {
        message.reply('Sorry, there was an error with the game server.');
    }
});

client.login('YOUR_BOT_TOKEN');
```

### Telegram Bot Example
```javascript
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });
const API_URL = 'http://localhost:3000/api/chatbot';

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    try {
        const response = await axios.post(API_URL, {
            sessionId: chatId.toString(),
            message: text,
            difficulty: 'easy'
        });
        
        bot.sendMessage(chatId, response.data.response);
    } catch (error) {
        bot.sendMessage(chatId, 'Sorry, there was an error with the game server.');
    }
});
```

### Slack Bot Example
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
        
        await say(response.data.response);
    } catch (error) {
        await say('Sorry, there was an error with the game server.');
    }
});

app.start(process.env.PORT || 3000);
```

## Production Deployment

### Docker Deployment (API Server)
```dockerfile
# Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t number-guessing-api .
docker run -p 3000:3000 number-guessing-api
```

### Cloud Deployment Options

#### Heroku
1. Create `Procfile`:
   ```
   web: node api-server/server.js
   ```

2. Deploy:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku create your-app-name
   git push heroku main
   ```

#### AWS EC2
1. Launch EC2 instance
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start api-server/server.js --name "number-guessing-api"
   pm2 startup
   pm2 save
   ```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build command: `npm install`
3. Configure run command: `npm start`
4. Set environment variables

## Monitoring and Maintenance

### Health Checks
- API endpoint: `GET /health`
- Monitor response times
- Set up alerts for downtime

### Logging
- Application logs in `console.log`
- Consider using Winston or similar for production
- Monitor error rates

### Scaling
- Use PM2 cluster mode for Node.js
- Consider Redis for session storage in production
- Load balancer for multiple instances

## Security Considerations

1. **Rate Limiting**: Implement rate limiting for API endpoints
2. **Input Validation**: Validate all inputs
3. **CORS**: Configure CORS properly for web clients
4. **Environment Variables**: Use environment variables for sensitive data
5. **HTTPS**: Use HTTPS in production

## Troubleshooting

### Common Issues

1. **Java Application Won't Start**
   - Check Java version: `java -version`
   - Verify JAR file integrity
   - Check system requirements

2. **API Server Issues**
   - Check Node.js version: `node --version`
   - Verify all dependencies installed
   - Check port availability

3. **Web Application Issues**
   - Check browser console for errors
   - Verify file paths
   - Test in different browsers

### Support
For issues or questions, contact: Jayendra Bamne (Internship Project for Afame Technologies)
