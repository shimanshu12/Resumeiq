// Curated reference lists used to classify free-text keywords into categories.
// Lowercase for case-insensitive matching. Extend freely as needed.

export const SKILL_CATEGORIES = {
  programmingLanguages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust',
    'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'dart', 'sql', 'bash', 'shell',
  ],
  frameworks: [
    'react', 'react.js', 'next.js', 'nextjs', 'vue', 'vue.js', 'angular', 'svelte',
    'express', 'express.js', 'node', 'node.js', 'django', 'flask', 'fastapi', 'spring',
    'spring boot', '.net', 'laravel', 'ruby on rails', 'nestjs', 'redux',
  ],
  libraries: [
    'tailwind', 'tailwind css', 'bootstrap', 'material ui', 'framer motion', 'jquery',
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'chart.js', 'recharts',
    'axios', 'lodash',
  ],
  databases: [
    'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'firebase',
    'supabase', 'dynamodb', 'cassandra', 'oracle', 'mariadb', 'elasticsearch',
  ],
  cloud: [
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
    'ci/cd', 'cicd', 'jenkins', 'github actions', 'terraform', 'ansible', 'nginx',
    'vercel', 'netlify', 'heroku',
  ],
  tools: [
    'git', 'github', 'gitlab', 'jira', 'figma', 'postman', 'webpack', 'vite', 'babel',
    'eslint', 'jest', 'cypress', 'selenium', 'graphql', 'rest api', 'grpc',
  ],
  softSkills: [
    'communication', 'leadership', 'teamwork', 'problem solving', 'time management',
    'adaptability', 'collaboration', 'critical thinking', 'creativity', 'mentoring',
    'stakeholder management', 'agile', 'scrum',
  ],
  education: [
    'bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'b.sc', 'm.sc', 'mba',
    'computer science', 'information technology', 'engineering', 'degree',
  ],
  certificates: [
    'aws certified', 'pmp', 'scrum master', 'azure certified', 'google certified',
    'comptia', 'ccna', 'certified kubernetes administrator', 'oracle certified',
  ],
};

// Flat lookup set for quick membership checks, built once at import time.
export const ALL_KNOWN_SKILLS = Object.values(SKILL_CATEGORIES).flat();

export function categorizeSkill(skill) {
  const normalized = skill.toLowerCase().trim();
  for (const [category, list] of Object.entries(SKILL_CATEGORIES)) {
    if (list.includes(normalized)) return category;
  }
  return 'technicalSkills';
}

// Common English stop words to strip during cleaning, beyond what `natural` provides.
export const CUSTOM_STOPWORDS = [
  'resume', 'cv', 'curriculum', 'vitae', 'experience', 'years', 'year', 'strong',
  'proven', 'track', 'record', 'responsible', 'including', 'etc', 'e.g', 'i.e',
];
