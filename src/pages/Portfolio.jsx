import Header from '../components/Header'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Education from '../components/Education'
import Projects from '../components/Projects'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import FloatingContact from '../components/FloatingContact'

export default function Portfolio() {
  return (
    <>
      {/* Ambient background blobs */}
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />

      <Header />
      <main>
        <Hero />
        <Stats />
        <Education />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </>
  )
}
