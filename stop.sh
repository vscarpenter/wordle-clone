#!/bin/bash

# stop.sh - Stop the development server for Wordle Clone
# Usage: ./stop.sh

# Function to stop server
stop_server() {
    local pattern=$1
    if pgrep -f "$pattern" > /dev/null; then
        echo "Stopping server: $pattern"
        pkill -f "$pattern"
        return 0
    fi
    return 1
}

# Try to stop Python server (both Python 2 and 3)
if ! stop_server "python.*http.server" && ! stop_server "python3.*http.server"; then
    echo "No running development servers found"
    exit 1
fi

echo "Development server stopped successfully"
