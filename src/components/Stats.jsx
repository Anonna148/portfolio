import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiBriefcase, HiCode, HiAcademicCap, HiLightningBolt, HiChartBar } from 'react-icons/hi'
import { supabase } from '../lib/supabase'
import './Stats.css'

const ICON_MAP = {
  Briefcase: <HiBriefcase />,
  Code: <HiCode />,
  AcademicCap: <HiAcademicCap />,
  LightningBolt: <HiLightningBolt />,
  ChartBar: <HiChartBar />,
}

export default function Stats() {
  const [stats, setStats] = useState([])

  useEffect(() => {
    supabase.from('stats').select('*').order('sort_order')
      .then(({ data }) => { if (data) setStats(data) })
      .catch(() => {})
  }, [])

  if (stats.length === 0) return null

  return (
    <div className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              className="stat-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="stat-icon">
                {ICON_MAP[stat.icon] || <HiChartBar />}
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
