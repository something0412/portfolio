import { useRef, useState } from "react";
import { career, education } from "../data/content";
import Section from "./Section";
import Timeline from "./Timeline";

const tabs = [
  { key: "experience", label: "Experience", data: career },
  { key: "education", label: "Education", data: education },
];

const FADE_DURATION = 90;

export default function Experience() {
  const [active, setActive] = useState(tabs[0].key);
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(0);
  const [hoverSlides, setHoverSlides] = useState(false);
  const isAnimatingRef = useRef(false);

  const handleTabEnter = (index) => {
    setHoverSlides(hovered !== null);
    setHoverIndex(index);
    setHovered(index);
  };

  const activeIndex = tabs.findIndex((tab) => tab.key === active);
  const activeTab = tabs[activeIndex];

  const handleTabClick = (key) => {
    if (key === active || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setVisible(false);

    setTimeout(() => {
      setActive(key);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
          isAnimatingRef.current = false;
        });
      });
    }, FADE_DURATION);
  };

  return (
    <Section id="experience">
      <div
        onMouseLeave={() => setHovered(null)}
        className="relative grid grid-cols-2 gap-1 rounded-full border border-panel-border bg-panel p-1"
      >
        <div
          aria-hidden="true"
          className={`absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full bg-white/10 ease-out ${
            hoverSlides ? "transition-[transform,opacity] duration-300" : "transition-opacity duration-200"
          }`}
          style={{
            opacity: hovered === null ? 0 : 1,
            transform: hoverIndex === 1 ? "translateX(calc(100% + 0.25rem))" : "translateX(0)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full bg-accent/90 transition-transform duration-300 ease-out"
          style={{
            transform: activeIndex === 1 ? "translateX(calc(100% + 0.25rem))" : "translateX(0)",
          }}
        />
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabClick(tab.key)}
            onMouseEnter={() => handleTabEnter(index)}
            className={`relative z-10 rounded-full m-0.5 px-4 py-2 text-sm font-medium transition-colors duration-300 ${
              active === tab.key ? "text-bg" : "text-text-dim hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={`transition-all duration-200 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        <Timeline entries={activeTab.data} scrollable={activeTab.key === "experience"} />
      </div>
    </Section>
  );
}
