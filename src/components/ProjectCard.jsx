import { forwardRef } from "react";

const GLOW_RGB = "167, 139, 250";

const ProjectCard = forwardRef(function ProjectCard({ project }, ref) {
  const primaryLink = project.live || project.github || null;
  const ThumbWrapper = primaryLink ? "a" : "div";
  const thumbLinkProps = primaryLink ? { href: primaryLink, target: "_blank", rel: "noreferrer" } : {};

  return (
    <div
      ref={ref}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-panel-border bg-panel"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-150"
        style={{
          opacity: "var(--glow-intensity, 0)",
          background: `radial-gradient(260px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(${GLOW_RGB}, 0.16), transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-150"
        style={{
          opacity: "var(--glow-intensity, 0)",
          padding: "1px",
          background: `radial-gradient(260px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(${GLOW_RGB}, 0.9), transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <ThumbWrapper {...thumbLinkProps} className="block aspect-[16/10] w-full overflow-hidden bg-white/5">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-bg">
            <span className="flex size-12 items-center justify-center rounded-xl border border-panel-border bg-panel font-display text-xl font-semibold text-accent">
              {project.name[0]}
            </span>
          </div>
        )}
      </ThumbWrapper>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm font-semibold text-text">{project.name}</p>
        <p className="text-xs leading-relaxed text-text-dim">{project.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {project.techs.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-panel-border bg-bg px-2 py-0.5 text-[11px] text-text-faint"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-panel-border bg-bg px-2.5 py-1 text-xs text-accent-2"
            >
              GitHub
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-panel-border bg-bg px-2.5 py-1 text-xs text-accent-2"
            >
              Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProjectCard;
