import { Link, NavLink } from "react-router-dom";
import downloadIcon from "../assets/icons/download.png";
import logo from "../assets/images/logo_white.png";
import { profile, resumeUrl, resumeFileName } from "../data/content";
import { flashPress } from "../lib/pressFlash";
import { openResumePreview } from "../lib/resumePreview";

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
      <nav className="flex items-center gap-4 font-display text-xs text-text-dim sm:gap-6 sm:text-sm">
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
          download={resumeFileName}
          onClick={openResumePreview}
          onPointerDown={flashPress}
          className="group relative flex justify-center overflow-hidden rounded-full bg-transparent px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-200 shadow-[inset_0_0_0_2px_#616467] transition duration-200 hover:bg-[#616467] hover:text-white data-[pressed]:bg-[#616467] data-[pressed]:text-white sm:text-xs"
        >
          {/* On hover the label slides out right while the download icon slides in from the left */}
          <span className="transition-transform duration-400 group-hover:translate-x-40 group-data-[pressed]:translate-x-40">Resume</span>
          <span className="absolute inset-0 flex -translate-x-40 items-center justify-center transition-transform duration-400 group-hover:translate-x-0 group-data-[pressed]:translate-x-0">
            <img src={downloadIcon} alt="" className="size-3.5 invert" />
          </span>
        </a>
      </nav>
    </header>
  );
}
