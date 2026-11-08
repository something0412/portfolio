import About from "../components/About";
import Experience from "../components/Experience";
import FeaturedProjects from "../components/FeaturedProjects";
import Hero from "../components/Hero";
import SectionSidebar from "../components/SectionSidebar";
import Skills from "../components/Skills";

const sections = [
  { id: "about", label: "About me" },
  { id: "experience", label: "Experience & Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
];

export default function Home() {
  return (
    <main className="flex flex-col gap-16 pb-16">
      <SectionSidebar sections={sections} />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <FeaturedProjects />
    </main>
  );
}
