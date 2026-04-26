import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import './Header.css'

const navLinks = [
  { href: '#hero',      label: 'Home' },
  { href: '#hero',      label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#projects',  label: 'Projects' },
  { href: '#experience',label: 'Experience' },
  { href: '#skills',    label: 'Skills' },
  { href: '#contact',   label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('Home')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (label, href) => {
    setActive(label)
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        className={`header${scrolled ? ' header--scrolled' : ''}`}
        initial={{ y: -100, x: '-50%', opacity: 0 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="header__inner container">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="header__logo"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNav('Home', '#hero')}
          >
            <span className="logo-bracket">&lt;</span>
            FT
            <span className="logo-bracket">/&gt;</span>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="header__nav">
            {navLinks.map((link) => (
              <button
                key={link.label}
                className={`nav-link${active === link.label ? ' nav-link--active' : ''}`}
                onClick={() => handleNav(link.label, link.href)}
              >
                {link.label}
                {active === link.label && (
                  <motion.span className="nav-indicator" layoutId="navIndicator" />
                )}
              </button>
            ))}
          </nav>

          {/* Admin link */}
          <a href="/admin" className="header__admin btn-outline" style={{ padding: '0.45rem 1.2rem', fontSize: '0.85rem' }}>
            Admin
          </a>

          {/* Mobile toggle */}
          <button
            className="header__burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                className={`mobile-menu__link${active === link.label ? ' active' : ''}`}
                onClick={() => handleNav(link.label, link.href)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.a
              href="/admin"
              className="mobile-menu__link"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navLinks.length * 0.06 }}
            >
              Admin Panel
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
