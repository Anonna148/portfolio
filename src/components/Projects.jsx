import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiExternalLink } from 'react-icons/hi'
import { FiGithub } from 'react-icons/fi'
import Tilt from 'react-parallax-tilt'
import { supabase } from '../lib/supabase'
import AnimatedSection from './AnimatedSection'
import './Projects.css'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('All')
  const [categories, setCategories] = useState(['All'])

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order')
      .then(({ data }) => {
        if (data) {
          setProjects(data)
          const allTags = data.flatMap(p => p.tags || [])
          setCategories(['All', ...new Set(allTags)])
        }
      })
      .catch(() => {})
  }, [])

  const filtered = filter === 'All' 
    ? projects 
    : projects.filter(p => (p.tags || []).includes(filter))

  return (
    <section id="projects">
      <div className="container">
        <AnimatedSection>
          <p className="section-eyebrow">My Work</p>
          <h2 className="section-title gradient-text">Featured Projects</h2>
          <p className="section-subtitle">A showcase of my recent coding and design projects</p>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection delay={0.1}>
          <div className="project-filters">
            {categories.map(c => (
              <button
                key={c}
                className={`filter-btn ${filter === c ? 'filter-btn--active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Grid */}
        <motion.div layout className="projects-grid">
          <AnimatePresence>
            {filtered.map(project => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Tilt 
                  tiltMaxAngleX={8} 
                  tiltMaxAngleY={8} 
                  glareEnable={true} 
                  glareMaxOpacity={0.1} 
                  transitionSpeed={2000} 
                  scale={1.02} 
                  className="project-tilt"
                >
                  <div className="glass-card project-card">
                    <div className="project-card__img-wrap">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="project-card__img" />
                      ) : (
                        <div className="project-card__img-placeholder">No Image</div>
                      )}
                      
                      <div className="project-card__overlay">
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="icon-link">
                            <FiGithub />
                          </a>
                        )}
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="icon-link">
                            <HiExternalLink />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="project-card__body">
                      <h3 className="project-card__title">{project.title}</h3>
                      <p className="project-card__desc">{project.description}</p>
                      <div className="project-card__tags">
                        {(project.tags || []).map(t => (
                          <span key={t} className="tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
