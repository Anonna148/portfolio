import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiBriefcase } from 'react-icons/hi'
import Tilt from 'react-parallax-tilt'
import { supabase } from '../lib/supabase'
import AnimatedSection from './AnimatedSection'
import './Experience.css'

export default function Experience() {
  const [items, setItems] = useState([])

  useEffect(() => {
    supabase.from('experience').select('*').order('sort_order')
      .then(({ data }) => { if (data) setItems(data) })
      .catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <section id="experience">
      <div className="container">
        <AnimatedSection>
          <p className="section-eyebrow">Professional Background</p>
          <h2 className="section-title gradient-text">Work Experience</h2>
          <p className="section-subtitle">My professional journey and industry contributions</p>
        </AnimatedSection>

        <div className="timeline">
          {items.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.15} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div className={`timeline-item${i % 2 === 0 ? ' timeline-item--left' : ' timeline-item--right'}`}>
                <div className="timeline-dot">
                  <HiBriefcase />
                </div>

                <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable={true} glareMaxOpacity={0.05} scale={1.02} className="exp-tilt">
                  <div className="glass-card exp-card">
                    <div className="exp-card__year">
                      {item.date_start} – {item.date_end}
                    </div>
                    <h3 className="exp-card__role">{item.role}</h3>
                    <p className="exp-card__company">{item.company}</p>
                    {item.description && (
                      <p className="exp-card__desc">{item.description}</p>
                    )}
                  </div>
                </Tilt>
              </div>
            </AnimatedSection>
          ))}
          <div className="timeline-line" />
        </div>
      </div>
    </section>
  )
}
