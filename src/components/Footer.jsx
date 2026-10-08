import { Link } from "react-router-dom";
import { links, socials } from "../data/content";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="flex flex-col gap-8 border-t border-panel-border py-10">
      <div>
        <Link
          to="/contact"
          className="font-display text-xl font-semibold transition-opacity hover:opacity-85 sm:text-2xl"
        >
          Let's build something together
        </Link>
        <a
          href={links.email}
          className="mt-3 block w-fit border-b border-accent text-sm text-accent"
        >
          {links.emailDisplay}
        </a>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2.5">
          {socials
            .filter((social) => social.name !== "Email")
            .map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.name}
                className="flex size-9 items-center justify-center rounded-full border border-panel-border bg-panel transition-all hover:-translate-y-0.5 hover:border-accent"
              >
                <img src={social.icon} alt="" className="size-4 opacity-85 invert brightness-150" />
              </a>
            ))}
        </div>
        <p className="text-xs text-text-faint">© {year} Phuoc Vinh Le</p>
      </div>
    </footer>
  );
}
