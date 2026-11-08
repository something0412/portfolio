import ProjectGrid from "../components/ProjectGrid";
import Section from "../components/Section";
import SectionSidebar from "../components/SectionSidebar";
import { hackathons, projects, upcomingProjects } from "../data/content";

const sections = [
  { id: "upcoming", title: "Upcoming", items: upcomingProjects, empty: "New projects are on the way." },
  { id: "projects", title: "Projects", items: projects, empty: "No projects yet." },
  { id: "hackathons", title: "Hackathons", items: hackathons, empty: "Hackathon projects coming soon." },
];

const navItems = sections.map(({ id, title }) => ({ id, label: title }));

export default function ProjectsPage() {
  return (
    <main className="flex flex-col gap-16 pb-16 pt-10">
      <SectionSidebar sections={navItems} />
      {sections.map(({ id, title, items, empty }) => (
        <Section key={id} id={id} title={title}>
          {items.length > 0 ? (
            <ProjectGrid projects={items} className="grid grid-cols-1 gap-4 sm:grid-cols-2" />
          ) : (
            <p className="text-sm text-text-faint">{empty}</p>
          )}
        </Section>
      ))}
    </main>
  );
}
