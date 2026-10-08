import { useEffect, useRef, useState } from "react";
import { skills } from "../data/content";
import Section from "./Section";

const DRIFT_PX_PER_MS = 0.035;
const FRICTION = 0.94;
const VELOCITY_STOP_THRESHOLD = 0.01;

function SkillPill({ skill }) {
  return (
    <span className="flex shrink-0 items-center gap-2 rounded-full border border-panel-border bg-panel px-3 py-1.5 text-xs text-text-dim">
      {skill.icon ? (
        Array.isArray(skill.icon) ? (
          <span className="flex -space-x-1">
            {skill.icon.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                draggable={false}
                className="size-3.5 rounded-full object-contain ring-1 ring-panel"
              />
            ))}
          </span>
        ) : (
          <img src={skill.icon} alt="" draggable={false} className="size-3.5 object-contain" />
        )
      ) : (
        <span className="flex size-3.5 items-center justify-center rounded-full bg-bg text-[9px] font-semibold text-accent">
          {skill.name[0]}
        </span>
      )}
      {skill.name}
    </span>
  );
}

export default function Skills() {
  const allSkills = skills.flatMap((group) => group.items);
  const trackItems = [...allSkills, ...allSkills];

  const trackRef = useRef(null);
  const frameRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const loopWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const offsetAtDragStartRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const measure = () => {
      loopWidthRef.current = track.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);

    let lastTime = performance.now();

    const tick = (time) => {
      const dt = time - lastTime;
      lastTime = time;

      if (!draggingRef.current) {
        if (Math.abs(velocityRef.current) > VELOCITY_STOP_THRESHOLD) {
          offsetRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(FRICTION, dt / 16.67);
        } else {
          velocityRef.current = 0;
          offsetRef.current += DRIFT_PX_PER_MS * dt;
        }
      }

      const loopWidth = loopWidthRef.current;
      if (loopWidth > 0) {
        offsetRef.current = ((offsetRef.current % loopWidth) + loopWidth) % loopWidth;
      }

      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const handlePointerDown = (event) => {
    draggingRef.current = true;
    setIsDragging(true);
    velocityRef.current = 0;
    dragStartXRef.current = event.clientX;
    offsetAtDragStartRef.current = offsetRef.current;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    const dx = event.clientX - dragStartXRef.current;
    offsetRef.current = offsetAtDragStartRef.current - dx;

    const now = performance.now();
    const dt = now - lastPointerTimeRef.current;
    if (dt > 0) {
      velocityRef.current = -(event.clientX - lastPointerXRef.current) / dt;
    }
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = now;
  };

  const handlePointerEnd = (event) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <Section id="skills" title="Skills">
      <p className="sr-only">Skills: {allSkills.map((skill) => skill.name).join(", ")}.</p>
      <div
        aria-hidden="true"
        className={`-mx-1 overflow-hidden px-1 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          touchAction: "pan-y",
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <div ref={trackRef} className="flex w-max select-none gap-2 will-change-transform">
          {trackItems.map((skill, index) => (
            <SkillPill key={`${skill.name}-${index}`} skill={skill} />
          ))}
        </div>
      </div>
    </Section>
  );
}
