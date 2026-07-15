// Shimmering placeholder block used while async data loads.
export default function LoadingSkeleton({ className = 'h-24 w-full' }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/[0.05] ${className}`} />
  );
}
