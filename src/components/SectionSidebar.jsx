import { useEffect, useRef, useState } from "react";

const HEADER_OFFSET = 80;
const PROXIMITY = 110;

export default function SectionSidebar({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const itemRefs = useRef([]);
  const lockRef = useRef(false);

  // Highlights the section currently in view while the page scrolls
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (lockRef.current) return;
      const line = window.innerHeight * 0.35;
      let current = sections[0]?.id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActiveId(atBottom ? sections.at(-1).id : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  // Jumps to the section and keeps it highlighted until the scroll finishes
  const goTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    lockRef.current = true;
    const unlock = () => {
      lockRef.current = false;
      window.removeEventListener("scrollend", unlock);
    };
    window.addEventListener("scrollend", unlock);
    setTimeout(unlock, 1200);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET });
  };

  // Items near the pointer lean out a little, fading off with distance
  const handlePointerMove = (event) => {
    itemRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = Math.max(0, 1 - Math.abs(event.clientY - (rect.top + rect.height / 2)) / PROXIMITY);
      el.style.setProperty("--near", (p * p * (3 - 2 * p)).toFixed(3));
    });
  };
  const handlePointerLeave = () => {
    itemRefs.current.forEach((el) => el?.style.setProperty("--near", "0"));
  };

  if (sections.length === 0) return null;

  // Fills the empty space left of the content panel with a fixed-width list, hidden below 1200px wide
  return (
    <nav
      aria-label="On this page"
      className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden w-[calc(50%-25.2rem)] items-center justify-center px-6 text-[clamp(1.05rem,1.55vw,1.75rem)] min-[1200px]:flex"
    >
      <ul
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="pointer-events-auto flex w-[min(100%,13em)] flex-col gap-[0.4em]"
      >
        {sections.map(({ id, label }, index) => {
          const active = id === activeId;
          return (
            <li key={id}>
              <button
                type="button"
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => goTo(id)}
                aria-current={active ? "true" : undefined}
                style={{ "--active": active ? 1 : 0 }}
                className="group flex w-full cursor-pointer items-center gap-[0.6em] py-[0.35em] text-left [--effect:max(var(--near,0),var(--active))] focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-[1.6em] shrink-0 origin-left bg-[color-mix(in_srgb,var(--color-accent)_calc(var(--effect)*100%),var(--color-text-faint))] transition-[transform,background-color] duration-200 ease-out [transform:scaleX(calc(0.6+var(--effect)*0.8))]"
                />
                <span className="flex items-baseline gap-[0.5em] text-balance leading-tight text-[color-mix(in_srgb,var(--color-accent)_calc(var(--effect)*100%),var(--color-text-faint))] transition-[transform,color] duration-200 ease-out [transform:translateX(calc(var(--effect)*0.7em))] group-focus-visible:underline">
                  <span className="font-mono text-[0.8em] opacity-70">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-display">{label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
