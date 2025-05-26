#!/bin/bash

# start.sh - Start the development server for Wordle Clone
# Usage: ./start.sh [port]

# Default port
PORT=${1:-8080}

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "Error: Port $PORT is already in use"
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Error: Python is not installed"
    echo "Please install Python or use an alternative server like 'npx http-server'"
    exit 1
fi

# Start the server
echo "Starting server on http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"

# Use Python 3 if available, fallback to Python 2
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
else
    python -m http.server $PORT
fi
