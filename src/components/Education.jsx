import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiAcademicCap } from 'react-icons/hi'
import Tilt from 'react-parallax-tilt'
import { supabase } from '../lib/supabase'
import AnimatedSection from './AnimatedSection'
import './Education.css'

const FALLBACK = [
  { id: 1, degree: 'B.Sc in Computer Science and Engineering', institution: 'American International University-Bangladesh (AIUB)', year_start: '2022', year_end: 'Expected 2025', gpa: '3.73 / 4.00', sort_order: 1 },
  { id: 2, degree: 'Higher Secondary Certificate (H.S.C)', institution: 'BAF Shaheen College Tejgaon', year_start: '2020', year_end: '2020', gpa: '5.0 / 5.0', sort_order: 2 },
  { id: 3, degree: 'Secondary School Certificate (S.S.C)', institution: 'BAF Shaheen College Termitola', year_start: '2018', year_end: '2018', gpa: '5.0 / 5.0', sort_order: 3 },
]

export default function Education() {
  const [items, setItems] = useState(FALLBACK)

  useEffect(() => {
    supabase.from('education').select('*').order('sort_order')
      .then(({ data }) => { if (data?.length) setItems(data) })
      .catch(() => {})
  }, [])

  return (
    <section id="education">
      <div className="container">
        <AnimatedSection>
          <p className="section-eyebrow">My Journey</p>
          <h2 className="section-title gradient-text">Education</h2>
          <p className="section-subtitle">Academic milestones that shaped my foundation</p>
        </AnimatedSection>

        <div className="timeline">
          {items.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.15} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div className={`timeline-item${i % 2 === 0 ? ' timeline-item--left' : ' timeline-item--right'}`}>
                {/* Connector dot */}
                <div className="timeline-dot">
                  <HiAcademicCap />
                </div>

                <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable={true} glareMaxOpacity={0.05} scale={1.02} className="edu-tilt">
                  <div className="glass-card edu-card">
                    <div className="edu-card__year">
                      {item.year_start === item.year_end ? item.year_start : `${item.year_start} – ${item.year_end}`}
                    </div>
                    <h3 className="edu-card__degree">{item.degree}</h3>
                    <p className="edu-card__institution">{item.institution}</p>
                    {item.gpa && (
                      <div className="edu-card__gpa">
                        <span className="gpa-label">GPA</span>
                        <span className="gpa-value">{item.gpa}</span>
                      </div>
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
