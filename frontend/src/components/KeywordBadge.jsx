// Small colored badge for matching (green) or missing (red) keywords.
export default function KeywordBadge({ keyword, matched = true }) {
  return (
    <span className={matched ? 'badge-match' : 'badge-missing'}>
      {keyword}
    </span>
  );
}
