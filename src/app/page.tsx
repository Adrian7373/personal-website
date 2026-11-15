import {
  About,
  Contact,
  Experience,
  Footer,
  Hero,
  Nav,
  Projects,
  Services,
  Skills,
  Testimonials,
} from "@/components/sections";

import { Build } from "@/components/Build";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Build />
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
