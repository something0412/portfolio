import { Link } from "react-router-dom";
import { flashPress } from "../lib/pressFlash";

export default function NotFound() {
  return (
    <main className="flex flex-col items-start gap-4 pb-16 pt-24">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-2">404</p>
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="text-sm text-text-dim">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        onPointerDown={flashPress}
        className="mt-2 rounded-full bg-transparent px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-200 shadow-[inset_0_0_0_2px_#616467] transition duration-200 hover:bg-[#616467] hover:text-white data-[pressed]:bg-[#616467] data-[pressed]:text-white"
      >
        Back home
      </Link>
    </main>
  );
}
