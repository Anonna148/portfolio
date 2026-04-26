import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaPython, FaJava, FaWindows, FaApple, FaLinux,
  FaCode, FaDatabase, FaTools
} from 'react-icons/fa'
import { SiC, SiCplusplus, SiMysql, SiOpengl } from 'react-icons/si'
import { supabase } from '../lib/supabase'
import AnimatedSection from './AnimatedSection'
import './Skills.css'

const ICON_MAP = {
  'C': <SiC />, 'C++': <SiCplusplus />, 'Java': <FaJava />,
  'Python': <FaPython />, 'C#': <FaCode />, 'OpenGL': <SiOpengl />,
  'Oracle': <FaDatabase />, 'MySQL': <SiMysql />, 'SQL Server': <FaDatabase />,
  'Photoshop': <FaTools />, 'Premiere Pro': <FaTools />, 'Lightroom': <FaTools />,
  'Windows': <FaWindows />, 'Linux': <FaLinux />, 'MacOS': <FaApple />,
}

const CATEGORY_COLORS = {
  Languages: { from: 'var(--accent-primary)', to: '#6d28d9' },
  Databases: { from: '#06b6d4', to: '#0891b2' },
  Tools:     { from: 'var(--accent-secondary)', to: '#db2777' },
  OS:        { from: '#f97316', to: '#ea580c' },
  General:   { from: '#10b981', to: '#059669' },
}

const FALLBACK = [
  { id: 1, name: 'C', category: 'Languages', sort_order: 1 },
  { id: 2, name: 'C++', category: 'Languages', sort_order: 2 },
  { id: 3, name: 'Java', category: 'Languages', sort_order: 3 },
  { id: 4, name: 'Python', category: 'Languages', sort_order: 4 },
  { id: 5, name: 'C#', category: 'Languages', sort_order: 5 },
  { id: 6, name: 'OpenGL', category: 'Languages', sort_order: 6 },
  { id: 7, name: 'Oracle', category: 'Databases', sort_order: 1 },
  { id: 8, name: 'MySQL', category: 'Databases', sort_order: 2 },
  { id: 9, name: 'SQL Server', category: 'Databases', sort_order: 3 },
  { id: 10, name: 'Photoshop', category: 'Tools', sort_order: 1 },
  { id: 11, name: 'Premiere Pro', category: 'Tools', sort_order: 2 },
  { id: 12, name: 'Lightroom', category: 'Tools', sort_order: 3 },
  { id: 13, name: 'Windows', category: 'OS', sort_order: 1 },
  { id: 14, name: 'Linux', category: 'OS', sort_order: 2 },
  { id: 15, name: 'MacOS', category: 'OS', sort_order: 3 },
]

export default function Skills() {
  const [skills, setSkills] = useState(FALLBACK)

  useEffect(() => {
    supabase.from('skills').select('*').order('sort_order')
      .then(({ data }) => { if (data?.length) setSkills(data) })
      .catch(() => {})
  }, [])

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <section id="skills">
      <div className="container">
        <AnimatedSection>
          <p className="section-eyebrow">My Arsenal</p>
          <h2 className="section-title gradient-text">Skills</h2>
          <p className="section-subtitle">Technologies and tools I work with</p>
        </AnimatedSection>

        <div className="skills-groups">
          {Object.entries(grouped).map(([category, items], gi) => {
            const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.General
            return (
              <AnimatedSection key={category} delay={gi * 0.1}>
                <div className="skill-group glass-card">
                  <div
                    className="skill-group__header"
                    style={{ background: `linear-gradient(135deg, ${colors.from}22, ${colors.to}11)` }}
                  >
                    <span className="skill-group__dot" style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }} />
                    <h3 className="skill-group__title" style={{ color: colors.from }}>{category}</h3>
                  </div>
                  <div className="skill-pills">
                    {items.map((skill, i) => (
                      <motion.div
                        key={skill.id}
                        className="skill-pill"
                        style={{ '--accent-from': colors.from, '--accent-to': colors.to }}
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                        whileHover={{ scale: 1.1, y: -4 }}
                      >
                        <span className="skill-pill__icon" style={{ color: colors.from }}>
                          {ICON_MAP[skill.name] || <FaCode />}
                        </span>
                        <span className="skill-pill__name">{skill.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
