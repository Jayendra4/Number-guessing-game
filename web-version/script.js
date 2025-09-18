class NumberGuessingGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.maxAttempts = 0;
        this.isEasy = true;
        this.gameStarted = false;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.startBtn = document.getElementById('startBtn');
        this.diffBtn = document.getElementById('diffBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.continueBtn = document.getElementById('continueBtn');
        this.numberInput = document.getElementById('numberInput');
        this.attemptsText = document.getElementById('attemptsText');
        this.result = document.getElementById('result');
        this.helpModal = document.getElementById('helpModal');
        this.closeBtn = document.querySelector('.close');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.diffBtn.addEventListener('click', () => this.toggleDifficulty());
        this.helpBtn.addEventListener('click', () => this.showHelp());
        this.submitBtn.addEventListener('click', () => this.submitGuess());
        this.continueBtn.addEventListener('click', () => this.resetGame());
        this.closeBtn.addEventListener('click', () => this.hideHelp());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.helpModal) {
                this.hideHelp();
            }
        });
        
        // Allow Enter key to submit
        this.numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.submitBtn.disabled) {
                this.submitGuess();
            }
        });
    }
    
    startGame() {
        this.gameStarted = true;
        this.startBtn.disabled = true;
        this.diffBtn.disabled = true;
        this.numberInput.disabled = false;
        this.submitBtn.disabled = false;
        this.continueBtn.disabled = true;
        
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.maxAttempts = this.isEasy ? 10 : 7;
        this.attempts = this.maxAttempts;
        
        this.updateAttemptsDisplay();
        this.clearResult();
        this.numberInput.focus();
        
        console.log('Game started! Target number:', this.targetNumber);
    }
    
    toggleDifficulty() {
        this.isEasy = !this.isEasy;
        this.diffBtn.textContent = this.isEasy ? 'Easy' : 'Hard';
    }
    
    submitGuess() {
        const guess = parseInt(this.numberInput.value);
        
        if (isNaN(guess)) {
            this.showResult('Please provide a valid number', 'error');
            return;
        }
        
        this.attempts--;
        this.updateAttemptsDisplay();
        
        if (guess === this.targetNumber) {
            this.showResult('Yay! You guessed the number', 'success');
            this.endGame();
        } else if (this.attempts <= 0) {
            this.showResult(`Game Over! The number was ${this.targetNumber}`, 'error');
            this.endGame();
        } else if (guess > this.targetNumber) {
            this.showResult(`Target Number is Lower than ${guess}`, 'info');
        } else {
            this.showResult(`Target Number is Higher than ${guess}`, 'info');
        }
        
        this.numberInput.value = '';
    }
    
    showResult(message, type) {
        this.result.textContent = message;
        this.result.className = `result ${type}`;
    }
    
    clearResult() {
        this.result.textContent = '';
        this.result.className = 'result';
    }
    
    updateAttemptsDisplay() {
        this.attemptsText.textContent = `Attempts Remaining: ${this.attempts}`;
    }
    
    endGame() {
        this.submitBtn.disabled = true;
        this.numberInput.disabled = true;
        this.continueBtn.disabled = false;
        this.gameStarted = false;
    }
    
    resetGame() {
        this.startBtn.disabled = false;
        this.diffBtn.disabled = false;
        this.submitBtn.disabled = true;
        this.continueBtn.disabled = true;
        this.numberInput.disabled = true;
        this.numberInput.value = '';
        this.clearResult();
        this.attempts = 0;
        this.updateAttemptsDisplay();
    }
    
    showHelp() {
        this.helpModal.style.display = 'block';
    }
    
    hideHelp() {
        this.helpModal.style.display = 'none';
    }
    
    // API methods for chatbot integration
    getGameState() {
        return {
            gameStarted: this.gameStarted,
            attempts: this.attempts,
            maxAttempts: this.maxAttempts,
            difficulty: this.isEasy ? 'Easy' : 'Hard',
            targetNumber: this.gameStarted ? this.targetNumber : null
        };
    }
    
    makeGuess(guess) {
        if (!this.gameStarted) {
            return { error: 'Game not started. Please start the game first.' };
        }
        
        const numGuess = parseInt(guess);
        if (isNaN(numGuess)) {
            return { error: 'Please provide a valid number' };
        }
        
        this.attempts--;
        this.updateAttemptsDisplay();
        
        if (numGuess === this.targetNumber) {
            this.showResult('Yay! You guessed the number', 'success');
            this.endGame();
            return { 
                success: true, 
                message: 'Congratulations! You guessed the number correctly!',
                attemptsUsed: this.maxAttempts - this.attempts
            };
        } else if (this.attempts <= 0) {
            this.showResult(`Game Over! The number was ${this.targetNumber}`, 'error');
            this.endGame();
            return { 
                gameOver: true, 
                message: `Game Over! The number was ${this.targetNumber}`,
                attemptsUsed: this.maxAttempts
            };
        } else if (numGuess > this.targetNumber) {
            this.showResult(`Target Number is Lower than ${numGuess}`, 'info');
            return { 
                hint: 'lower', 
                message: `Target Number is Lower than ${numGuess}`,
                attemptsRemaining: this.attempts
            };
        } else {
            this.showResult(`Target Number is Higher than ${numGuess}`, 'info');
            return { 
                hint: 'higher', 
                message: `Target Number is Higher than ${numGuess}`,
                attemptsRemaining: this.attempts
            };
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new NumberGuessingGame();
});

// Expose game instance globally for chatbot integration
window.NumberGuessingGame = NumberGuessingGame;
