const CATEGORY_PHRASING = {
  cloud: (kw) => `Add cloud/deployment experience with ${kw} if you've used it — it's a strong signal to ATS systems.`,
  databases: (kw) => `Mention hands-on experience with ${kw} if applicable, even in a project context.`,
  frameworks: (kw) => `Your resume should include experience with ${kw}.`,
  libraries: (kw) => `Mention ${kw} explicitly if you've used it — recruiters' ATS tools scan for exact terms.`,
  tools: (kw) => `Reference ${kw} in your experience or tools section.`,
  softSkills: (kw) => `Weave "${kw}" into a bullet point with a concrete example, rather than listing it alone.`,
  programmingLanguages: (kw) => `Make sure ${kw} appears in your skills section if you have experience with it.`,
  education: () => `Double-check your education section matches the degree/field this role expects.`,
  certificates: (kw) => `Consider highlighting a ${kw} certification if you hold one.`,
  technicalSkills: (kw) => `Consider adding "${kw}" to your resume where relevant.`,
};

const GENERIC_TIPS = [
  'Quantify your achievements with numbers (e.g. "reduced load time by 40%") — ATS and recruiters both weigh measurable impact highly.',
  'Use exact keyword phrasing from the job description where honest and accurate — ATS systems often do literal matching.',
  'Mention testing frameworks or QA practices if your experience includes them; many JDs screen for this.',
  'Include a REST API or GraphQL line if you\'ve built or consumed APIs — it\'s one of the most commonly scanned terms.',
];

/**
 * Produces a ranked, human-readable list of resume improvement suggestions
 * based on the missing keywords and overall match quality.
 */
export function generateSuggestions({ missingKeywords, jdKeywords, atsScore }) {
  const suggestions = [];
  const categoryByKeyword = new Map(jdKeywords.map((k) => [k.keyword, k.category]));

  // Prioritize the highest-frequency missing keywords first
  const rankedMissing = [...missingKeywords].slice(0, 8);

  for (const keyword of rankedMissing) {
    const category = categoryByKeyword.get(keyword) || 'technicalSkills';
    const phraseFn = CATEGORY_PHRASING[category] || CATEGORY_PHRASING.technicalSkills;
    suggestions.push(phraseFn(keyword));
  }

  if (atsScore < 70) {
    suggestions.push(GENERIC_TIPS[0]);
    suggestions.push(GENERIC_TIPS[1]);
  }
  if (suggestions.length < 5) {
    suggestions.push(...GENERIC_TIPS.slice(2));
  }

  return Array.from(new Set(suggestions)).slice(0, 10);
}
