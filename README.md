# Wordle Clone

A simple clone of the popular NY Times Wordle game, built with HTML, CSS, and JavaScript.

## How to Play

1. Open `index.html` in your web browser
2. You have 6 attempts to guess a 5-letter word
3. After each guess:
   - Green tile: Letter is correct and in the right position
   - Yellow tile: Letter is in the word but in the wrong position
   - Gray tile: Letter is not in the word
4. Use the on-screen keyboard or your physical keyboard to input letters
5. Press Enter to submit your guess
6. Press Backspace to delete a letter

## Features

- Responsive design that works on both desktop and mobile
- On-screen keyboard with visual feedback
- Physical keyboard support
- Color-coded feedback for correct, present, and absent letters
- Win/lose detection

## Technical Details

The game is built using vanilla JavaScript with ES modules and doesn't require any external dependencies or server-side components. All game logic runs in the browser.

### Project Structure

- `index.html`: Main game interface
- `styles.css`: Game styling
- `script.js`: Core game logic
- `dictionary.js`: Word lists and validation
- `.gitignore`: Git ignore patterns

### Running the Game

Due to ES modules security requirements, you need to serve the game through a web server. You can do this in several ways:

1. Using Python:
   ```bash
   python -m http.server 8080
   ```

2. Using Node.js (with `http-server` package):
   ```bash
   npx http-server
   ```

Then open `http://localhost:8080` in your browser.

## Word Lists

The game uses two word lists in `dictionary.js`:

1. `WORDS`: List of words that can be solutions
2. `VALID_WORDS`: Comprehensive list of valid guesses

You can expand either list by adding more words to the appropriate array in `dictionary.js`.

## Browser Support

The game works in all modern browsers that support ES6 JavaScript features and ES modules. 