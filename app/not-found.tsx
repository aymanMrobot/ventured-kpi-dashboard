export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center p-10">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <a href="/overview" className="text-brand hover:underline focus:underline">
        Return to overview
      </a>
    </div>
  );
}