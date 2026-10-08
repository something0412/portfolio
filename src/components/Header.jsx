import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/logo_white.png";
import { profile, resumeUrl } from "../data/content";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 -mx-6 flex items-center justify-between bg-bg/75 px-6 py-4 backdrop-blur-sm sm:-mx-8 sm:px-8">
      <Link to="/" aria-label={profile.name}>
        <img src={logo} alt={profile.name} className="h-8 w-auto" />
      </Link>
      <nav className="flex items-center gap-4 text-xs text-text-dim sm:gap-6 sm:text-sm">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `transition-colors hover:text-text ${isActive ? "text-text" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <a
          href={resumeUrl}
          download
          className="rounded-full bg-accent px-3 py-1.5 font-semibold text-bg transition-opacity hover:opacity-85"
        >
          Resume
        </a>
      </nav>
    </header>
  );
}
