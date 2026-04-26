import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { HiMail } from 'react-icons/hi'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <motion.div
          className="footer__brand"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="footer__logo">
            <span style={{ background: 'var(--accent-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>&lt;FT/&gt;</span>
          </span>
          <p className="footer__tagline">Turning ideas into digital experiences</p>
        </motion.div>

        <div className="footer__links">
          <a href="#about" className="footer__link">About</a>
          <a href="#education" className="footer__link">Education</a>
          <a href="#projects" className="footer__link">Projects</a>
          <a href="#skills" className="footer__link">Skills</a>
          <a href="#contact" className="footer__link">Contact</a>
        </div>

        <div className="footer__socials">
          <a href="mailto:fardunatajkia@gmail.com" className="social-btn" aria-label="Email"><HiMail /></a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub"><FiGithub /></a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn"><FiLinkedin /></a>
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} Farduna Tajkia. Crafted with ♥
        </p>
      </div>
    </footer>
  )
}
