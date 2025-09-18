# Number Guessing Game

A Java Swing-based number guessing game with multiple deployment options including web version and chatbot integration.

## 🎮 Game Features

- **Desktop Application**: Original Java Swing GUI
- **Web Application**: Browser-based version with modern UI
- **API Server**: REST API for chatbot integration
- **Multiple Difficulty Levels**: Easy (10 attempts) and Hard (7 attempts)
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Desktop Version (Java Swing)
```bash
# Build and run
build.bat  # Windows
# or
./build.sh # Linux/Mac

# Run the JAR file
java -jar NumberGuessingGame.jar
```

### Web Version
1. Open `web-version/index.html` in your browser
2. Click "Start" to begin playing
3. No server required - pure HTML/CSS/JavaScript

### API Server (for Chatbot Integration)
```bash
cd api-server
npm install
npm start
```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
number-guessing/
├── GameFrame.java          # Main window frame
├── GamePanel.java          # Game logic and UI
├── Guessgame.java          # Entry point
├── HelpWindow.java         # Help dialog
├── MANIFEST.MF             # JAR manifest
├── build.bat               # Windows build script
├── web-version/            # Web application
│   ├── index.html
│   ├── style.css
│   └── script.js
├── api-server/             # Node.js API server
│   ├── server.js
│   └── package.json
├── DEPLOYMENT.md           # Deployment guide
├── CHATBOT_INTEGRATION.md  # Chatbot integration guide
└── README.md              # This file
```

## 🤖 Chatbot Integration

The game can be integrated with various chatbot platforms:

- **Discord Bot**: Full-featured Discord integration
- **Telegram Bot**: WhatsApp-style messaging
- **Slack Bot**: Team collaboration platform
- **Facebook Messenger**: Social media integration
- **Custom Chatbots**: Use the REST API

### Quick Chatbot Test
```bash
# Install dependencies
npm install axios

# Run test
node test-api.js
```

## 🛠️ Development

### Prerequisites
- **Java**: Version 8 or higher
- **Node.js**: Version 14 or higher (for API server)
- **Web Browser**: Modern browser for web version

### Building from Source
1. Clone the repository
2. For Java version: Run `build.bat` or `build.sh`
3. For API server: `cd api-server && npm install`

### Testing
```bash
# Test API endpoints
node test-api.js

# Test web version
# Open web-version/index.html in browser
```

## 📖 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Complete deployment guide
- **[CHATBOT_INTEGRATION.md](CHATBOT_INTEGRATION.md)**: Chatbot integration examples
- **[API Reference](api-server/server.js)**: REST API documentation

## 🌐 API Endpoints

### Chatbot Integration
```
POST /api/chatbot
{
  "sessionId": "user123",
  "message": "25",
  "difficulty": "easy"
}
```

### Game Management
```
POST /api/game/start     # Start new game
POST /api/game/guess     # Make a guess
GET  /api/game/status/:id # Get game status
DELETE /api/game/:id     # End game session
```

## 🎯 Game Rules

1. **Objective**: Guess a randomly generated number between 1-100
2. **Difficulty Levels**:
   - **Easy**: 10 attempts
   - **Hard**: 7 attempts
3. **Hints**: Game tells you if your guess is higher or lower
4. **Winning**: Guess the correct number within the attempt limit
5. **Losing**: Run out of attempts without guessing correctly

## 🔧 Configuration

### Environment Variables (API Server)
```bash
PORT=3000                    # Server port
NODE_ENV=production         # Environment
```

### Game Settings
- Number range: 1-100 (configurable in code)
- Attempt limits: Easy=10, Hard=7 (configurable)
- Session timeout: None (games persist until manually ended)

## 🚀 Deployment Options

### Desktop Distribution
- **JAR File**: `NumberGuessingGame.jar`
- **Requirements**: Java 8+ installed
- **Platform**: Cross-platform (Windows, Linux, Mac)

### Web Hosting
- **Static Files**: Upload `web-version/` folder
- **Requirements**: Web server (Apache, Nginx, etc.)
- **Platform**: Any web hosting service

### Cloud Deployment
- **Heroku**: One-click deploy from GitHub
- **AWS**: EC2 instance or Lambda functions
- **DigitalOcean**: App Platform deployment
- **Docker**: Containerized deployment

## 🐛 Troubleshooting

### Common Issues

1. **Java Application Won't Start**
   - Verify Java installation: `java -version`
   - Check JAR file integrity
   - Ensure Java 8+ is installed

2. **API Server Issues**
   - Check Node.js version: `node --version`
   - Verify dependencies: `npm install`
   - Check port availability

3. **Web Version Issues**
   - Check browser console for errors
   - Verify file paths are correct
   - Test in different browsers

### Getting Help
- Check the documentation files
- Review error messages in console/logs
- Test with the provided test scripts

## 📄 License

This project was created by Jayendra Bamne as an Internship Project for Afame Technologies.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
- Review the documentation
- Check the troubleshooting section
- Contact the development team

---

**Enjoy playing the Number Guessing Game! 🎮**
