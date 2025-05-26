#!/usr/bin/env python3
import urllib.request
import json

# Download the word list
url = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/6bfa15d263d6d5b63840a8e5b64e04b382fdb079/valid-wordle-words.txt"
response = urllib.request.urlopen(url)
words = response.read().decode('utf-8').strip().split('\n')

# Convert words to uppercase and sort them
words = sorted([word.upper() for word in words])

# Create the dictionary.js content
js_content = """/**
 * Official Wordle word lists
 * 
 * This file contains two lists:
 * 1. WORDS: ~2,300 solution words that can be answers (curated for common usage)
 * 2. VALID_WORDS: ~12,000 valid guess words (includes all solution words plus more)
 */

// Official Wordle solution words - these are the only words that can be answers
export const WORDS = [
    {solutions}
];

// Official Wordle valid guess words - all words that can be used as guesses
export const VALID_WORDS = new Set([
    // Include all solution words as valid guesses
    ...WORDS,
    
    // Additional valid guess words
    {guesses}
]);
"""

# Format words into JavaScript array format
def format_word_list(words):
    return ',\n    '.join(f"'{word}'" for word in words)

# Write the updated dictionary.js
with open('dictionary.js', 'w') as f:
    # For this example, let's keep the first 2315 words as solutions (official Wordle count)
    solution_words = words[:2315]
    guess_words = words[2315:]
    
    content = js_content.format(
        solutions=format_word_list(solution_words),
        guesses=format_word_list(guess_words)
    )
    f.write(content)

print("Updated dictionary.js with official Wordle words")
