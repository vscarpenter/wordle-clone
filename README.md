# Wordle Clone

A faithful recreation of the popular NY Times Wordle game, built with vanilla HTML, CSS, and JavaScript. This implementation features the complete game experience including statistics tracking, animations, and responsive design.

## How to Play

1. You have 6 attempts to guess a 5-letter word
2. Type your guess using either the on-screen keyboard or your physical keyboard
3. Press Enter to submit your guess
4. After each guess, tiles will flip to reveal:
   - **Green**: Letter is correct and in the right position
   - **Yellow**: Letter is in the word but in the wrong position
   - **Gray**: Letter is not in the word
5. The keyboard will update to show which letters you've used
6. Press Backspace to delete letters

## Features

- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⌨️ **Dual Input**: Physical keyboard and interactive on-screen keyboard
- 🎨 **Smooth Animations**: Tile flipping effects and row shake animations
- 📊 **Statistics Tracking**: Persistent game statistics with guess distribution
- 🔄 **New Game**: Start fresh games anytime
- ❓ **Help Modal**: Built-in instructions
- 🎯 **Official Word Lists**: Uses authentic Wordle solution and valid word sets

## Quick Start

### Option 1: Using Provided Scripts (Recommended)

```bash
# Start development server (defaults to port 8080)
./start.sh

# Or specify a custom port
./start.sh 3000

# Stop the server when done
./stop.sh
```

### Option 2: Manual Server Setup

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

## Architecture

This is a **zero-dependency** vanilla JavaScript application with no build process or external frameworks.

### Core Files

| File | Purpose |
|------|---------|
| `index.html` | Game interface with board, keyboard, and modals |
| `script.js` | Main game logic using ES modules |
| `dictionary.js` | Word lists (~2,315 solutions, ~12,000 valid words) |
| `styles.css` | Complete styling with CSS animations |
| `start.sh` | Development server startup script |
| `stop.sh` | Server shutdown script |
| `update_dictionary.py` | Dictionary update utility |

### Key Features

**Game State Management**
- Global state variables for game progress
- LocalStorage integration for persistent statistics
- Toast notification system for user feedback

**Word Validation System**
- Two-tier validation: solution words vs. valid guesses
- Duplicate guess prevention
- Real-time feedback during typing

**Animation System**
- Staggered tile flip animations for guess reveals
- Row shake effects for invalid words
- Smooth keyboard state transitions

## Word Dictionary

The game uses an authentic two-tier word system:

- **Solution Words** (`WORDS` array): ~2,315 carefully curated words that can be daily answers
- **Valid Words** (`VALID_WORDS` Set): ~12,000 total acceptable guesses (includes solutions + additional words)

### Updating the Dictionary

```bash
python update_dictionary.py
```

This script downloads the latest official Wordle word lists and regenerates `dictionary.js`.

## Development

### Project Structure
```
wordle-clone/
├── index.html          # Game interface
├── script.js           # Game logic (ES modules)
├── styles.css          # Styling & animations
├── dictionary.js       # Word lists (~103k tokens)
├── start.sh           # Server start script
├── stop.sh            # Server stop script
├── update_dictionary.py # Dictionary updater
├── favicon.ico        # Game icon

```

### Technical Requirements

- **ES Modules**: Requires HTTP server (cannot use `file://` protocol)
- **Modern JavaScript**: Uses ES6+ features (Set, localStorage, async/await)
- **No Build Process**: Direct browser execution
- **Font Awesome**: CDN-loaded icons for UI elements

### Browser Support

- ✅ Chrome 61+
- ✅ Firefox 60+
- ✅ Safari 10.1+
- ✅ Edge 16+

## Contributing

This is a vanilla JavaScript project with no external dependencies. When contributing:

1. Maintain the existing code style and patterns
2. Test across different browsers and devices
3. Ensure all animations work smoothly
4. Preserve the mobile-responsive design

## License

This project is a educational recreation of Wordle for learning purposes. 
