import About from "../components/About";
import Experience from "../components/Experience";
import FeaturedProjects from "../components/FeaturedProjects";
import Hero from "../components/Hero";
import Skills from "../components/Skills";

export default function Home() {
  return (
    <main className="flex flex-col gap-16 pb-16">
      <Hero />
      <About />
      <Experience />
      <Skills />
      <FeaturedProjects />
    </main>
  );
}
