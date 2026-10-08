import ProjectGrid from "../components/ProjectGrid";
import Section from "../components/Section";
import { projects } from "../data/content";

export default function ProjectsPage() {
  return (
    <main className="flex flex-col gap-16 pb-16 pt-10">
      <Section id="projects" title="Projects">
        <ProjectGrid projects={projects} className="grid grid-cols-1 gap-4 sm:grid-cols-2" />
      </Section>
    </main>
  );
}
