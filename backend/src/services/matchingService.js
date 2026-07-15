import stringSimilarity from 'string-similarity';
import { extractKeywords, extractJobDescriptionKeywords } from './keywordExtractionService.js';
import { SKILL_CATEGORIES } from '../utils/skillsDictionary.js';

const FUZZY_MATCH_THRESHOLD = 0.85; // catches near-misses like "postgres" vs "postgresql"

/**
 * Decides whether a JD keyword is present in the resume's keyword set,
 * allowing for close spelling variants via Dice's coefficient similarity.
 */
function findBestMatch(jdKeyword, resumeKeywordList) {
  if (resumeKeywordList.includes(jdKeyword)) return true;
  if (resumeKeywordList.length === 0) return false;

  const { bestMatch } = stringSimilarity.findBestMatch(jdKeyword, resumeKeywordList);
  return bestMatch.rating >= FUZZY_MATCH_THRESHOLD;
}

function categoryWeightedList() {
  return [...SKILL_CATEGORIES.programmingLanguages, ...SKILL_CATEGORIES.frameworks,
    ...SKILL_CATEGORIES.libraries, ...SKILL_CATEGORIES.databases, ...SKILL_CATEGORIES.cloud,
    ...SKILL_CATEGORIES.tools];
}

/**
 * Core matching algorithm: compares resume text against a job description
 * and produces every metric ResumeIQ's report needs.
 */
export function matchResumeToJobDescription(resumeText, jobDescriptionText) {
  const resumeKeywords = extractKeywords(resumeText);
  const resumeKeywordSet = resumeKeywords.map((k) => k.keyword);
  const jdKeywords = extractJobDescriptionKeywords(jobDescriptionText);

  const matching = [];
  const missing = [];

  for (const jdKw of jdKeywords) {
    if (findBestMatch(jdKw.keyword, resumeKeywordSet)) {
      matching.push(jdKw.keyword);
    } else {
      missing.push(jdKw.keyword);
    }
  }

  const keywordMatchPct = jdKeywords.length
    ? Math.round((matching.length / jdKeywords.length) * 100)
    : 0;

  // Skill match: restrict comparison to "hard skill" categories only
  const hardSkills = categoryWeightedList();
  const jdHardSkills = jdKeywords
    .map((k) => k.keyword)
    .filter((kw) => hardSkills.includes(kw));
  const matchedHardSkills = jdHardSkills.filter((kw) => findBestMatch(kw, resumeKeywordSet));
  const skillMatchPct = jdHardSkills.length
    ? Math.round((matchedHardSkills.length / jdHardSkills.length) * 100)
    : keywordMatchPct; // fall back if JD has no recognizable hard skills

  // Experience match: heuristic on years-of-experience mentions and seniority language
  const experienceMatchPct = estimateExperienceMatch(resumeText, jobDescriptionText);

  // Education match: checks whether resume mentions the JD's required degree/field
  const educationMatchPct = estimateEducationMatch(resumeText, jobDescriptionText);

  // Overall ATS score: weighted blend (keyword/skill matching matters most for ATS systems)
  const overallAtsScore = Math.round(
    keywordMatchPct * 0.35 +
    skillMatchPct * 0.35 +
    experienceMatchPct * 0.15 +
    educationMatchPct * 0.15
  );

  return {
    atsScore: clamp(overallAtsScore),
    keywordMatchPct: clamp(keywordMatchPct),
    skillMatchPct: clamp(skillMatchPct),
    experienceMatchPct: clamp(experienceMatchPct),
    educationMatchPct: clamp(educationMatchPct),
    matchingKeywords: dedupe(matching),
    missingKeywords: dedupe(missing),
    resumeKeywords,
    jdKeywords,
  };
}

function estimateExperienceMatch(resumeText, jdText) {
  const yearsRegex = /(\d{1,2})\+?\s*(?:years|yrs)/gi;
  const resumeYears = [...resumeText.matchAll(yearsRegex)].map((m) => parseInt(m[1], 10));
  const jdYears = [...jdText.matchAll(yearsRegex)].map((m) => parseInt(m[1], 10));

  if (jdYears.length === 0) return 80; // JD doesn't specify — assume neutral-good match
  if (resumeYears.length === 0) return 40; // resume doesn't state experience explicitly

  const requiredYears = Math.max(...jdYears);
  const candidateYears = Math.max(...resumeYears);

  if (candidateYears >= requiredYears) return 100;
  const ratio = candidateYears / requiredYears;
  return Math.round(ratio * 100);
}

function estimateEducationMatch(resumeText, jdText) {
  const educationTerms = SKILL_CATEGORIES.education;
  const lowerResume = resumeText.toLowerCase();
  const lowerJd = jdText.toLowerCase();

  const jdRequiresEducation = educationTerms.some((term) => lowerJd.includes(term));
  if (!jdRequiresEducation) return 100; // no explicit requirement in JD

  const resumeHasMatch = educationTerms.some(
    (term) => lowerJd.includes(term) && lowerResume.includes(term)
  );
  return resumeHasMatch ? 100 : 50;
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function dedupe(arr) {
  return Array.from(new Set(arr));
}
