const axios = require('axios');

const API_URL = 'http://localhost:3000/api/chatbot';

async function testGame() {
    console.log('🎮 Testing Number Guessing Game API...\n');
    
    const sessionId = 'test-user-' + Date.now();
    
    try {
        // Test 1: Start game
        console.log('1. Starting new game...');
        let response = await axios.post(API_URL, {
            sessionId: sessionId,
            message: 'start',
            difficulty: 'easy'
        });
        console.log('Response:', response.data.response);
        console.log('Attempts remaining:', response.data.attemptsRemaining);
        console.log('');
        
        // Test 2: Make guesses
        const guesses = [50, 25, 75, 60, 65, 62, 63];
        
        for (let i = 0; i < guesses.length; i++) {
            console.log(`${i + 2}. Making guess: ${guesses[i]}`);
            response = await axios.post(API_URL, {
                sessionId: sessionId,
                message: guesses[i].toString(),
                difficulty: 'easy'
            });
            console.log('Response:', response.data.response);
            console.log('Attempts remaining:', response.data.attemptsRemaining);
            console.log('');
            
            if (response.data.gameOver || response.data.success) {
                break;
            }
        }
        
        // Test 3: Help command
        console.log('3. Testing help command...');
        response = await axios.post(API_URL, {
            sessionId: sessionId,
            message: 'help',
            difficulty: 'easy'
        });
        console.log('Response:', response.data.response);
        console.log('');
        
        // Test 4: Status command
        console.log('4. Testing status command...');
        response = await axios.post(API_URL, {
            sessionId: sessionId,
            message: 'status',
            difficulty: 'easy'
        });
        console.log('Response:', response.data.response);
        console.log('');
        
        console.log('✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testGame();
}

module.exports = { testGame };
