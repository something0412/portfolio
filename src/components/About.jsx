import { profile } from "../data/content";
import Section from "./Section";

export default function About() {
  const stats = [
    { label: "Grad.", value: profile.expectedGraduation },
    { label: "GPA", value: profile.gpa },
  ];

  return (
    <Section id="about" title="About me">
      <div className="flex items-start gap-6">
        <p className="basis-[60%] text-balance text-sm leading-relaxed text-text-dim sm:text-base">
          A Computer Science student at the University of Houston, learning to apply first-principles thinking to master the fundamentals, solve real-world problems, and build useful software.
        </p>
        <div className="flex basis-[40%] flex-col items-center gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                {stat.value.split(" ").map((part) => (
                  <span
                    key={part}
                    className="rounded-lg border border-panel-border bg-panel px-3 py-0.5 font-display text-lg font-semibold text-accent-2"
                  >
                    {part}
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-faint">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
