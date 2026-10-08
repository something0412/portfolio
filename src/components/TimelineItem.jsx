export default function TimelineItem({ entry }) {
  const { name, href, logo, logoScale = 1.5, logoBg = "white", positions } = entry;
  const LogoWrapper = href ? "a" : "div";
  const NameWrapper = href ? "a" : "div";
  const linkProps = href ? { href, target: "_blank", rel: "noreferrer" } : {};
  const logoBgClass = logoBg === "white" ? "bg-white border-panel-border" : "bg-bg border-panel-border";

  return (
    <li className="relative ml-9 py-5 pr-5 sm:ml-10 sm:pr-6">
      <LogoWrapper
        {...linkProps}
        className={`absolute -left-[54px] top-5 flex size-9 items-center justify-center overflow-hidden rounded-full border p-1.5 sm:-left-[60px] sm:size-10 ${logoBgClass}`}
      >
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="size-full object-contain"
            style={{ transform: `scale(${logoScale})` }}
          />
        ) : (
          <span className="flex size-full items-center justify-center rounded-full bg-panel font-display text-sm font-semibold text-accent">
            {name[0]}
          </span>
        )}
      </LogoWrapper>

      <NameWrapper {...linkProps} className="w-fit">
        <h3 className="text-sm font-semibold leading-none text-text">{name}</h3>
      </NameWrapper>

      <div className="mt-3 flex flex-col gap-4">
        {positions.map((position) => (
          <div key={position.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-medium text-text-dim">{position.title}</p>
              <time className="whitespace-nowrap text-xs tabular-nums text-text-faint">
                {position.start} - {position.end ?? "Present"}
              </time>
            </div>
            {position.description.length > 0 && (
              <ul className="mt-2 flex list-outside list-disc flex-col gap-1 pl-4">
                {position.description.map((point) => (
                  <li key={point} className="text-sm leading-relaxed text-text-dim">
                    {point}
                  </li>
                ))}
              </ul>
            )}
            {position.links && position.links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {position.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-panel-border bg-bg px-2.5 py-1 text-xs text-accent-2"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </li>
  );
}
