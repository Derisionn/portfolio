import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Projects from './components/Projects/Projects';
import InteractiveBackground from './components/InteractiveBackground/InteractiveBackground';
import AboutMe from './components/AboutMe/AboutMe';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Contact from './components/Contact/Contact';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import './App.css';

function App() {
  return (
    <>
      <InteractiveBackground />
      <ScrollToTop />
      <div className="main-content">
        <Navbar />
        <main>
          <Hero />
          <AboutMe />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
      </div>
    </>
  );
}

export default App;
