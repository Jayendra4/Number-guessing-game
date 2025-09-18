const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for game sessions
const gameSessions = new Map();

// Game logic class
class GameSession {
    constructor(sessionId, difficulty = 'easy') {
        this.sessionId = sessionId;
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.maxAttempts = difficulty === 'easy' ? 10 : 7;
        this.attempts = this.maxAttempts;
        this.difficulty = difficulty;
        this.gameStarted = false;
        this.gameOver = false;
        this.won = false;
    }
    
    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        this.won = false;
        return {
            message: `Game started! I've picked a number between 1 and 100. You have ${this.maxAttempts} attempts.`,
            attemptsRemaining: this.attempts,
            difficulty: this.difficulty
        };
    }
    
    makeGuess(guess) {
        if (!this.gameStarted) {
            return { error: 'Game not started. Please start the game first.' };
        }
        
        if (this.gameOver) {
            return { error: 'Game is already over. Please start a new game.' };
        }
        
        const numGuess = parseInt(guess);
        if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
            return { error: 'Please provide a valid number between 1 and 100.' };
        }
        
        this.attempts--;
        
        if (numGuess === this.targetNumber) {
            this.gameOver = true;
            this.won = true;
            return {
                success: true,
                message: `🎉 Congratulations! You guessed the number ${this.targetNumber} correctly!`,
                attemptsUsed: this.maxAttempts - this.attempts,
                gameOver: true
            };
        } else if (this.attempts <= 0) {
            this.gameOver = true;
            return {
                gameOver: true,
                message: `😞 Game Over! The number was ${this.targetNumber}. Better luck next time!`,
                attemptsUsed: this.maxAttempts,
                targetNumber: this.targetNumber
            };
        } else if (numGuess > this.targetNumber) {
            return {
                hint: 'lower',
                message: `📉 The number is lower than ${numGuess}. You have ${this.attempts} attempts remaining.`,
                attemptsRemaining: this.attempts,
                lastGuess: numGuess
            };
        } else {
            return {
                hint: 'higher',
                message: `📈 The number is higher than ${numGuess}. You have ${this.attempts} attempts remaining.`,
                attemptsRemaining: this.attempts,
                lastGuess: numGuess
            };
        }
    }
    
    getStatus() {
        return {
            sessionId: this.sessionId,
            gameStarted: this.gameStarted,
            gameOver: this.gameOver,
            won: this.won,
            attempts: this.attempts,
            maxAttempts: this.maxAttempts,
            difficulty: this.difficulty,
            targetNumber: this.gameOver ? this.targetNumber : 'hidden'
        };
    }
}

// API Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Number Guessing Game API is running' });
});

// Start a new game
app.post('/api/game/start', (req, res) => {
    const { sessionId, difficulty = 'easy' } = req.body;
    
    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const game = new GameSession(sessionId, difficulty);
    gameSessions.set(sessionId, game);
    
    const result = game.startGame();
    res.json({
        success: true,
        sessionId: sessionId,
        ...result
    });
});

// Make a guess
app.post('/api/game/guess', (req, res) => {
    const { sessionId, guess } = req.body;
    
    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }
    
    if (!guess) {
        return res.status(400).json({ error: 'Guess is required' });
    }
    
    const game = gameSessions.get(sessionId);
    if (!game) {
        return res.status(404).json({ error: 'Game session not found. Please start a new game.' });
    }
    
    const result = game.makeGuess(guess);
    res.json({
        success: !result.error,
        sessionId: sessionId,
        ...result
    });
});

// Get game status
app.get('/api/game/status/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const game = gameSessions.get(sessionId);
    
    if (!game) {
        return res.status(404).json({ error: 'Game session not found' });
    }
    
    res.json({
        success: true,
        ...game.getStatus()
    });
});

// End game session
app.delete('/api/game/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const deleted = gameSessions.delete(sessionId);
    
    res.json({
        success: deleted,
        message: deleted ? 'Game session ended' : 'Game session not found'
    });
});

// Get all active sessions (for debugging)
app.get('/api/game/sessions', (req, res) => {
    const sessions = Array.from(gameSessions.entries()).map(([id, game]) => ({
        sessionId: id,
        ...game.getStatus()
    }));
    
    res.json({
        success: true,
        activeSessions: sessions.length,
        sessions: sessions
    });
});

// Chatbot integration endpoint
app.post('/api/chatbot', (req, res) => {
    const { sessionId, message, difficulty = 'easy' } = req.body;
    
    if (!sessionId || !message) {
        return res.status(400).json({ error: 'Session ID and message are required' });
    }
    
    let game = gameSessions.get(sessionId);
    
    // If no game exists, start a new one
    if (!game) {
        game = new GameSession(sessionId, difficulty);
        gameSessions.set(sessionId, game);
        const startResult = game.startGame();
        return res.json({
            success: true,
            sessionId: sessionId,
            response: startResult.message,
            ...startResult
        });
    }
    
    // Check if it's a guess (number)
    const guess = parseInt(message);
    if (!isNaN(guess)) {
        const result = game.makeGuess(guess);
        return res.json({
            success: !result.error,
            sessionId: sessionId,
            response: result.message || result.error,
            ...result
        });
    }
    
    // Handle text commands
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('start') || lowerMessage.includes('new game')) {
        const newGame = new GameSession(sessionId, difficulty);
        gameSessions.set(sessionId, newGame);
        const result = newGame.startGame();
        return res.json({
            success: true,
            sessionId: sessionId,
            response: result.message,
            ...result
        });
    }
    
    if (lowerMessage.includes('status') || lowerMessage.includes('info')) {
        const status = game.getStatus();
        return res.json({
            success: true,
            sessionId: sessionId,
            response: `Game Status: ${status.gameStarted ? 'Active' : 'Not Started'}, Attempts: ${status.attempts}/${status.maxAttempts}, Difficulty: ${status.difficulty}`,
            ...status
        });
    }
    
    if (lowerMessage.includes('help')) {
        return res.json({
            success: true,
            sessionId: sessionId,
            response: "I'm a number guessing game! Guess a number between 1-100. I'll tell you if it's higher or lower. Type 'start' for a new game or just send me a number to guess!"
        });
    }
    
    // Default response
    res.json({
        success: true,
        sessionId: sessionId,
        response: "I didn't understand that. Please send me a number to guess, or type 'start' for a new game, 'help' for instructions, or 'status' for game info."
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎮 Number Guessing Game API server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 Chatbot endpoint: http://localhost:${PORT}/api/chatbot`);
});

module.exports = app;
