import keywordExtractor from 'keyword-extractor';
import nlp from 'compromise';
import { cleanText, tokenize } from './textCleaningService.js';
import { ALL_KNOWN_SKILLS, categorizeSkill } from '../utils/skillsDictionary.js';

/**
 * Extracts a ranked, deduplicated list of keywords from raw text, then
 * cross-references them against the known-skills dictionary plus noun
 * phrases pulled by `compromise` so multi-word skills (e.g. "rest api")
 * aren't lost to single-token extraction.
 *
 * @returns {{ keyword: string, category: string, frequency: number }[]}
 */
export function extractKeywords(rawText) {
  const cleaned = cleanText(rawText);
  const lower = cleaned.toLowerCase();

  // 1. Single-word keyword extraction (frequency-ranked)
  const extracted = keywordExtractor.extract(cleaned, {
    language: 'english',
    remove_digits: false,
    return_changed_case: true,
    remove_duplicates: false,
  });

  const frequency = new Map();
  for (const word of extracted) {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  }

  // 2. Noun-phrase extraction to catch multi-word terms like "machine learning"
  const doc = nlp(cleaned);
  const nounPhrases = doc.nouns().out('array').map((p) => p.toLowerCase().trim());
  for (const phrase of nounPhrases) {
    if (phrase.split(' ').length >= 2 && phrase.length < 40) {
      frequency.set(phrase, (frequency.get(phrase) || 0) + 1);
    }
  }

  // 3. Direct dictionary matches (handles skills with symbols like "c++", "ci/cd")
  for (const skill of ALL_KNOWN_SKILLS) {
    if (lower.includes(skill)) {
      frequency.set(skill, (frequency.get(skill) || 1));
    }
  }

  const results = Array.from(frequency.entries())
    .filter(([word]) => word.length > 1)
    .map(([keyword, count]) => ({
      keyword,
      category: categorizeSkill(keyword),
      frequency: count,
    }))
    .sort((a, b) => b.frequency - a.frequency);

  return results;
}

/**
 * Extracts ranked keywords specifically from a job description, deduplicated
 * and capped to the most relevant terms for matching against a resume.
 */
export function extractJobDescriptionKeywords(jobDescriptionText, limit = 40) {
  const keywords = extractKeywords(jobDescriptionText);
  const seen = new Set();
  const deduped = [];
  for (const kw of keywords) {
    if (!seen.has(kw.keyword)) {
      seen.add(kw.keyword);
      deduped.push(kw);
    }
  }
  return deduped.slice(0, limit);
}

// Exposed for tests / debugging
export function tokenizeText(text) {
  return tokenize(cleanText(text));
}
