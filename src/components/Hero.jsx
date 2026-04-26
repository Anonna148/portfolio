import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiDownload, HiArrowRight } from 'react-icons/hi'
import { supabase } from '../lib/supabase'
const profileImg = '/images/profile.png'
import './Hero.css'

const FALLBACK_ROLES = [
  'CSE Student @ AIUB',
  'Software Developer',
  'Creative Designer',
  'Problem Solver',
]

const FALLBACK = {
  name: 'Farduna Tajkia',
  title: 'CSE Student & Developer',
  bio: "Hi, I'm Farduna, a Computer Science and Engineering student at AIUB with a passion for creating innovative solutions. I'm self-motivated, detail-oriented, and thrive on challenging projects that blend coding and creativity.",
  photo_url: null,
  hero_image_url: null,
  roles: FALLBACK_ROLES
}

export default function Hero() {
  const [profile, setProfile] = useState(FALLBACK)
  const [roles, setRoles] = useState(FALLBACK_ROLES)
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    supabase.from('profile').select('*').single()
      .then(({ data }) => { 
        if (data) {
          setProfile(data)
          if (data.roles && data.roles.length > 0) {
            setRoles(data.roles)
          }
        }
      })
      .catch(() => {})
  }, [])

  // Typewriter
  useEffect(() => {
    const role = roles[roleIdx] || ''
    let timeout
    if (!isDeleting && displayText === role) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setRoleIdx((i) => (i + 1) % roles.length)
    } else {
      timeout = setTimeout(() => {
        setDisplayText(isDeleting
          ? role.slice(0, displayText.length - 1)
          : role.slice(0, displayText.length + 1)
        )
      }, isDeleting ? 50 : 90)
    }
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, roleIdx, roles])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] } },
  }

  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        {/* Text content */}
        <motion.div
          className="hero__text"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="hero__greeting" variants={itemVariants}>
            Hello, I'm
          </motion.span>

          <motion.h1 className="hero__name" variants={itemVariants}>
            {profile.name}
          </motion.h1>

          <motion.div className="hero__role" variants={itemVariants}>
            <span className="role-prefix">I am a </span>
            <span className="role-typed">
              {displayText}
              <span className="cursor">|</span>
            </span>
          </motion.div>

          <motion.p className="hero__bio" variants={itemVariants}>
            {profile.bio}
          </motion.p>

          <motion.div className="hero__cta" variants={itemVariants}>
            <a href="/Tajkia CV.pdf" download className="btn-primary">
              <HiDownload /> Download CV
            </a>
            <button
              className="btn-outline"
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Projects <HiArrowRight />
            </button>
          </motion.div>
        </motion.div>

        {/* Profile image */}
        <motion.div
          className="hero__image-wrap"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Unique Frame Design */}
          <div className="hero__frame">
            <div className="hero__frame-border">
              <img
                src={profile.hero_image_url || profile.photo_url || profileImg}
                alt={profile.name}
                className="hero__img"
              />
            </div>
            {/* Corner accents for the frame */}
            <div className="frame-accent frame-accent--tl" />
            <div className="frame-accent frame-accent--br" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ x: '-50%' }}
        animate={{ x: '-50%', y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="scroll-mouse">
          <div className="scroll-dot" />
        </div>
        <span>Scroll down</span>
      </motion.div>
    </section>
  )
}
