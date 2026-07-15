import natural from 'natural';
import { CUSTOM_STOPWORDS } from '../utils/skillsDictionary.js';

const tokenizer = new natural.WordTokenizer();
const STOPWORDS = new Set([...natural.stopwords, ...CUSTOM_STOPWORDS]);

/**
 * Lowercases, strips punctuation/extra whitespace, and normalizes text
 * ahead of tokenization and keyword extraction.
 */
export function cleanText(rawText) {
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/[^\S\n]+/g, ' ') // collapse repeated spaces/tabs, keep newlines
    .replace(/[•●▪◦‣]/g, ' ') // strip bullet glyphs
    .trim();
}

/**
 * Tokenizes cleaned text into normalized, stop-word-free word tokens.
 */
export function tokenize(cleanedText) {
  const tokens = tokenizer.tokenize(cleanedText.toLowerCase());
  return tokens.filter((token) => token.length > 1 && !STOPWORDS.has(token));
}
