import { Link } from "react-router-dom";
import { projects } from "../data/content";
import ProjectGrid from "./ProjectGrid";
import Section from "./Section";

const FEATURED_COUNT = 2;

export default function FeaturedProjects() {
  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <Section id="projects">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Projects</h2>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-sm text-accent-2 transition-opacity hover:opacity-80"
        >
          <span className="hover:underline">more</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ProjectGrid projects={featured} className="grid grid-cols-1 gap-4 sm:grid-cols-2" />
    </Section>
  );
}
