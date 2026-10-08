import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex flex-col items-start gap-4 pb-16 pt-24">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-2">404</p>
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="text-sm text-text-dim">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
      >
        Back home
      </Link>
    </main>
  );
}
