import { profile } from "../data/content";
import PulseBadge from "./PulseBadge";
import Section from "./Section";

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Graduation cap and target icons; parts with pb-fill fill in when active
const GradCapIcon = (
  <svg {...svgProps}>
    <path className="pb-fill" d="M22 9 12 4 2 9l10 5 10-5Z" />
    <path d="M6 11.5V16c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" />
    <path d="M22 9v5" />
  </svg>
);

const TargetIcon = (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="5.5" />
    <circle className="pb-fill" cx="12" cy="12" r="1.75" />
  </svg>
);

export default function About() {
  const stats = [
    { label: "Grad.", value: profile.expectedGraduation, icon: GradCapIcon },
    { label: "GPA", value: profile.gpa, icon: TargetIcon },
  ];

  return (
    <Section id="about" title="About me">
      <div className="flex items-start gap-6">
        <p className="basis-[60%] text-balance text-sm leading-relaxed text-text-dim sm:text-base">
          A Computer Science student at the University of Houston, learning to apply first-principles thinking to master the fundamentals, solve real-world problems, and build useful software.
        </p>
        <div className="flex basis-[40%] justify-center">
          <div className="flex flex-col items-start gap-3">
            {stats.map((stat) => (
              <PulseBadge key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
