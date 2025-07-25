// Import word lists from dictionary
import { WORDS, VALID_WORDS } from './dictionary.js';

// Game state
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
let targetWord = '';
let previousGuesses = new Set(); // Track previous guesses
let gameStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastPlayed: null
};

// Toast notification system
const toast = {
    container: null,
    timeoutId: null,
    
    init() {
        // Create toast container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, duration = 2000) {
        this.init();
        
        // Clear any existing timeout
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        
        // Create and show toast
        this.container.textContent = message;
        this.container.classList.add('show');
        
        // Hide toast after duration
        this.timeoutId = setTimeout(() => {
            this.container.classList.remove('show');
        }, duration);
    }
};

// Initialize the game
function initGame() {
    // Generate game board
    const board = document.getElementById('board');
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            row.appendChild(tile);
        }
        board.appendChild(row);
    }

    // Load game statistics from localStorage
    loadGameStats();

    // Select random word
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    console.log('Target word:', targetWord); // For debugging
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyPress);
    
    // Add click event listeners to keyboard buttons
    document.querySelectorAll('#keyboard button').forEach(button => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-key');
            handleKeyPress({ key });
        });
    });
    
    // Initialize toast notification system
    toast.init();
}

// Load game statistics from localStorage
function loadGameStats() {
    const savedStats = localStorage.getItem('wordleStats');
    if (savedStats) {
        gameStats = JSON.parse(savedStats);
    }
}

// Save game statistics to localStorage
function saveGameStats() {
    localStorage.setItem('wordleStats', JSON.stringify(gameStats));
}

// Handle keyboard input
function handleKeyPress(e) {
    if (isGameOver) return;

    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
        checkRow();
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
    }
}

// Add letter to current tile
function addLetter(letter) {
    if (currentTile < 5 && currentRow < 6) {
        const row = document.querySelectorAll('.row')[currentRow];
        const tile = row.children[currentTile];
        tile.textContent = letter;
        tile.setAttribute('data-letter', letter);
        currentTile++;
    }
}

// Delete letter from current tile
function deleteLetter() {
    if (currentTile > 0) {
        currentTile--;
        const row = document.querySelectorAll('.row')[currentRow];
        const tile = row.children[currentTile];
        tile.textContent = '';
        tile.removeAttribute('data-letter');
    }
}

// Check if the current row is correct
function checkRow() {
    if (currentTile !== 5) return;

    // Get the current guess
    const row = document.querySelectorAll('.row')[currentRow];
    const tiles = row.children;
    let guess = '';
    for (let i = 0; i < 5; i++) {
        guess += tiles[i].getAttribute('data-letter');
    }

    // Check if this guess has been used before
    if (previousGuesses.has(guess)) {
        shakeTiles(row);
        toast.show('You already used this word');
        return;
    }

    // Validate the word - check if it's in our dictionary
    // Make sure to use uppercase for dictionary check since our WORDS array is all uppercase
    if (!VALID_WORDS.has(guess)) {
        // Try a case-insensitive check as a fallback
        let found = false;
        for (const word of VALID_WORDS) {
            if (word.toUpperCase() === guess.toUpperCase()) {
                found = true;
                break;
            }
        }
        
        if (!found) {
            // Word not in dictionary, show error
            shakeTiles(row);
            toast.show('Not in word list');
            return;
        }
    }
    
    // Add to previous guesses
    previousGuesses.add(guess);

    let correct = 0;
    const letterCount = {};

    // Count letters in target word
    for (let i = 0; i < 5; i++) {
        const letter = targetWord[i];
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // First pass: check correct letters
    for (let i = 0; i < 5; i++) {
        const tile = tiles[i];
        const letter = tile.getAttribute('data-letter');
        
        if (letter === targetWord[i]) {
            setTimeout(() => {
                flipTile(tile, 'correct', i);
            }, i * 100);
            letterCount[letter]--;
            correct++;
            updateKeyboardButton(letter, 'correct');
        }
    }

    // Second pass: check present and absent letters
    for (let i = 0; i < 5; i++) {
        const tile = tiles[i];
        const letter = tile.getAttribute('data-letter');
        
        if (letter !== targetWord[i]) {
            if (letterCount[letter] > 0) {
                setTimeout(() => {
                    flipTile(tile, 'present', i);
                }, i * 100);
                letterCount[letter]--;
                updateKeyboardButton(letter, 'present');
            } else {
                setTimeout(() => {
                    flipTile(tile, 'absent', i);
                }, i * 100);
                updateKeyboardButton(letter, 'absent');
            }
        }
    }

    // Check win condition immediately (don't wait for animation)
    if (correct === 5) {
        isGameOver = true;
        updateStats(true);
        toast.show(`Congratulations! You won in ${currentRow + 1} ${currentRow === 0 ? 'try' : 'tries'}!`, 3000);
        return;
    }

    // Check lose condition immediately (before moving to next row)
    if (currentRow === 5) { // This was the 6th and final attempt (0-indexed)
        isGameOver = true;
        updateStats(false);
        toast.show(`Game Over! The word was ${targetWord}`, 3000);
        return;
    }

    // Move to next row after a delay to allow animations to complete
    setTimeout(() => {
        // Move to next row
        currentRow++;
        currentTile = 0;
    }, 600);
}

// Shake tiles for invalid word
function shakeTiles(row) {
    row.classList.add('shake');
    setTimeout(() => {
        row.classList.remove('shake');
    }, 500);
}

// Flip tile with animation
function flipTile(tile, state, delay) {
    tile.classList.add('flip');
    
    setTimeout(() => {
        tile.classList.add(state);
    }, 250); // Half of the flip animation duration
    
    setTimeout(() => {
        tile.classList.remove('flip');
    }, 500); // Full flip animation duration
}

// Update game statistics
function updateStats(won) {
    gameStats.gamesPlayed++;
    gameStats.lastPlayed = new Date().toISOString();
    
    if (won) {
        gameStats.gamesWon++;
        gameStats.currentStreak++;
        gameStats.guessDistribution[currentRow]++;
        
        if (gameStats.currentStreak > gameStats.maxStreak) {
            gameStats.maxStreak = gameStats.currentStreak;
        }
    } else {
        gameStats.currentStreak = 0;
    }
    
    saveGameStats();
}

// Update keyboard button state
function updateKeyboardButton(letter, state) {
    const button = document.querySelector(`button[data-key="${letter.toLowerCase()}"]`);
    if (button) {
        // Only update if the new state is "better" than the current state
        if (state === 'correct') {
            button.className = 'correct';
        } else if (state === 'present' && !button.classList.contains('correct')) {
            button.className = 'present';
        } else if (state === 'absent' && !button.classList.contains('correct') && !button.classList.contains('present')) {
            button.className = 'absent';
        }
    }
}

// Display statistics
function showStats() {
    // Update statistics display
    document.getElementById('games-played').textContent = gameStats.gamesPlayed;
    
    // Calculate win percentage
    const winPercentage = gameStats.gamesPlayed > 0 
        ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100) 
        : 0;
    document.getElementById('win-percentage').textContent = winPercentage;
    
    document.getElementById('current-streak').textContent = gameStats.currentStreak;
    document.getElementById('max-streak').textContent = gameStats.maxStreak;
    
    // Generate guess distribution
    const distributionContainer = document.getElementById('guess-distribution-container');
    distributionContainer.innerHTML = '';
    
    // Find max value for scaling
    const maxValue = Math.max(...gameStats.guessDistribution);
    
    // Create bars for each guess count
    for (let i = 0; i < gameStats.guessDistribution.length; i++) {
        const count = gameStats.guessDistribution[i];
        const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
        
        const row = document.createElement('div');
        row.className = 'guess-row';
        
        const label = document.createElement('div');
        label.className = 'guess-label';
        label.textContent = i + 1;
        
        const bar = document.createElement('div');
        bar.className = 'guess-bar';
        // Highlight the current game's winning row
        if (isGameOver && gameStats.gamesWon > 0 && currentRow === i) {
            bar.classList.add('current');
        }
        bar.style.width = `${Math.max(percentage, 5)}%`;
        bar.textContent = count;
        
        row.appendChild(label);
        row.appendChild(bar);
        distributionContainer.appendChild(row);
    }
    
    // Show the modal
    document.getElementById('stats-modal').classList.add('show');
}

// Show help modal
function showHelp() {
    document.getElementById('help-modal').classList.add('show');
}

// Start a new game
function startNewGame() {
    // Only allow new game if current game is over or user confirms
    if (!isGameOver) {
        const confirmNewGame = confirm('Are you sure you want to start a new game? Your current progress will be lost.');
        if (!confirmNewGame) return;
    }
    
    // Reset game state
    currentRow = 0;
    currentTile = 0;
    isGameOver = false;
    previousGuesses.clear(); // Clear previous guesses when starting a new game
    
    // Clear the board
    const rows = document.querySelectorAll('.row');
    rows.forEach(row => {
        Array.from(row.children).forEach(tile => {
            tile.textContent = '';
            tile.className = 'tile';
            tile.removeAttribute('data-letter');
        });
    });
    
    // Reset keyboard
    document.querySelectorAll('#keyboard button').forEach(button => {
        button.className = button.classList.contains('wide-button') ? 'wide-button' : '';
    });
    
    // Select a new word
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    console.log('New target word:', targetWord); // For debugging
    
    toast.show('New game started');
}

// Close modals when clicking the close button or outside the modal
function setupModalListeners() {
    // Close buttons
    document.querySelectorAll('.stats-close').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.stats-container').forEach(modal => {
                modal.classList.remove('show');
            });
        });
    });
    
    // Click outside to close
    document.querySelectorAll('.stats-container').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Button event listeners
    document.getElementById('stats-button').addEventListener('click', showStats);
    document.getElementById('help-button').addEventListener('click', showHelp);
    document.getElementById('new-game-button').addEventListener('click', startNewGame);
}

// Start the game when the page loads
window.addEventListener('load', () => {
    initGame();
    setupModalListeners();
    
    // Show help modal for first-time players
    if (!localStorage.getItem('wordleStats')) {
        setTimeout(showHelp, 500);
    }
}); 