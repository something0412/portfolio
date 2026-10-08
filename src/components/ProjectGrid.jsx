import { useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";

const GLOW_RADIUS = 260;

export default function ProjectGrid({ projects, className = "" }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const rectsRef = useRef([]);

  cardRefs.current = [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      rectsRef.current = cardRefs.current.map((card) => {
        if (!card) return null;
        const rect = card.getBoundingClientRect();
        return {
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        };
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    const handlePointerMove = (event) => {
      const containerRect = container.getBoundingClientRect();
      const mouseX = event.clientX - containerRect.left;
      const mouseY = event.clientY - containerRect.top;

      cardRefs.current.forEach((card, index) => {
        const rect = rectsRef.current[index];
        if (!card || !rect) return;

        const localX = mouseX - rect.left;
        const localY = mouseY - rect.top;
        const clampedX = Math.min(Math.max(localX, 0), rect.width);
        const clampedY = Math.min(Math.max(localY, 0), rect.height);
        const distance = Math.hypot(localX - clampedX, localY - clampedY);
        const intensity = Math.max(0, 1 - distance / GLOW_RADIUS);

        card.style.setProperty("--glow-x", `${localX}px`);
        card.style.setProperty("--glow-y", `${localY}px`);
        card.style.setProperty("--glow-intensity", intensity.toFixed(3));
      });
    };

    const handlePointerLeave = () => {
      cardRefs.current.forEach((card) => {
        if (card) card.style.setProperty("--glow-intensity", "0");
      });
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [projects]);

  return (
    <div ref={containerRef} className={className}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.name}
          project={project}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
}
