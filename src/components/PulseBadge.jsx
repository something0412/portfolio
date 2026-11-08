import { useEffect, useRef, useState } from "react";

const OUT = 0.4;

// Easing: contract to a dot, then swell back past full size and settle
const back = (k, c) => {
  const u = k - 1;
  return 1 + (c + 1) * u ** 3 + c * u ** 2;
};
const swellOf = (t, c) => (t <= 0 ? 0 : t < OUT ? 1 - (1 - t / OUT) ** 3 : 1 - back((t - OUT) / (1 - OUT), c));
const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function PulseBadge({
  icon,
  value,
  label,
  size = 22,
  duration = 560,
  dotSize = 0.3,
  overshoot = 1.7,
  beat = 3,
}) {
  const [active, setActive] = useState(false);
  const iconRef = useRef(null);
  const pillRef = useRef(null);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Runs one pulse and flips the color at the smallest point
  const pulse = (next) => {
    let swapped = false;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const s = swellOf(t, overshoot);
      iconRef.current.style.transform = `scale(${1 - (1 - dotSize) * s})`;
      pillRef.current.style.transform = `scale(${1 - (beat / 100) * s})`;
      if (!swapped && t >= OUT) {
        swapped = true;
        setActive(next);
      }
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      raf.current = 0;
      iconRef.current.style.transform = "";
      pillRef.current.style.transform = "";
    };
    raf.current = requestAnimationFrame(tick);
  };

  const handleClick = () => {
    if (raf.current) return;
    if (reducedMotion()) setActive(!active);
    else pulse(!active);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-pressed={active}
        aria-label={`${label}: ${value}`}
        data-active={active}
        onClick={handleClick}
        style={{ "--pb-size": `${size}px` }}
        className="group cursor-pointer rounded-full transition-transform duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2/60"
      >
        <span
          ref={pillRef}
          className="inline-flex items-center gap-[calc(var(--pb-size)*0.3)] rounded-full border border-panel-border bg-panel py-[calc(var(--pb-size)*0.3)] pl-[calc(var(--pb-size)*0.35)] pr-[calc(var(--pb-size)*0.5)]"
        >
          <span
            ref={iconRef}
            aria-hidden="true"
            className="block size-[var(--pb-size)] text-text-faint transition-colors duration-150 group-hover:group-data-[active=false]:text-accent-2/70 group-data-[active=true]:text-accent-2 [&_svg]:size-full [&_svg]:overflow-visible group-data-[active=true]:[&_.pb-fill]:fill-current"
          >
            {icon}
          </span>
          <span className="font-display text-[length:calc(var(--pb-size)*0.75)] font-semibold leading-none tabular-nums text-text">
            {value}
          </span>
        </span>
      </button>
      <span className="text-xs text-text-faint">{label}</span>
    </div>
  );
}
