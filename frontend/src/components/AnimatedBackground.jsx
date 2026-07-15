// Ambient gradient-blob background used behind the landing hero and auth pages.
export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-base-900">
      <div className="absolute inset-0 bg-grad-mesh" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-blue/20 blur-3xl animate-blob" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-accent-purple/20 blur-3xl animate-blob [animation-delay:4s]" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-accent-cyan/20 blur-3xl animate-blob [animation-delay:8s]" />
    </div>
  );
}
