import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiLocationMarker, HiPhone, HiPaperAirplane } from 'react-icons/hi'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import Tilt from 'react-parallax-tilt'
import { supabase } from '../lib/supabase'
import AnimatedSection from './AnimatedSection'
import './Contact.css'

const FALLBACK = {
  address: 'Road 10, Sector 04, Uttara, Dhaka 1230, Bangladesh',
  email: 'fardunatajkia@gmail.com',
  phone: '',
  whatsapp_number: '',
  github_url: '',
  linkedin_url: '',
  reference_1_name: 'Abhijit Bhowmik',
  reference_1_email: 'abhjit@aiub.edu',
  reference_2_name: 'Mohammad Samawat Ullah',
  reference_2_email: 'samawat@aiub.edu',
}

export default function Contact() {
  const [info, setInfo] = useState(FALLBACK)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    supabase.from('contact').select('*').single()
      .then(({ data }) => { if (data) setInfo(data) })
      .catch(() => {})
  }, [])

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault()
    if (!info.whatsapp_number) {
      alert("WhatsApp number is not configured yet.");
      return;
    }
    // Remove any +, spaces, or dashes from the phone number
    const cleanNumber = info.whatsapp_number.replace(/\D/g, '')
    // Properly encode the message for URL
    const text = encodeURIComponent(`Hi, I am ${formData.name}.\n\n${formData.message}\n\n(Contact Email: ${formData.email})`)
    const url = `https://wa.me/${cleanNumber}?text=${text}`
    window.open(url, '_blank')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact">
      <div className="container">
        <AnimatedSection>
          <p className="section-eyebrow">Get in Touch</p>
          <h2 className="section-title gradient-text">Contact</h2>
          <p className="section-subtitle">Let's connect and create something amazing together</p>
        </AnimatedSection>

        <div className="contact-grid">
          {/* Form & Info Card */}
          <AnimatedSection direction="left">
            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable={true} glareMaxOpacity={0.05} scale={1.01} className="contact-tilt">
              <div className="glass-card contact-card contact-card--main">
                <h3 className="contact-card__heading">Send a Message (WhatsApp)</h3>
                <form className="contact-form" onSubmit={handleWhatsAppSubmit}>
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="contact-input"
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="contact-input"
                    />
                  </div>
                  <div className="form-group">
                    <textarea 
                      placeholder="Your Message" 
                      required 
                      rows="4"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="contact-input contact-textarea"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary form-submit">
                    <HiPaperAirplane style={{ transform: 'rotate(90deg)' }}/> Send Message
                  </button>
                </form>
              </div>
            </Tilt>
          </AnimatedSection>

          {/* Details & References */}
          <AnimatedSection direction="right" delay={0.1}>
            <div className="contact-sidebar">
              <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable={true} glareMaxOpacity={0.05} scale={1.01} className="contact-tilt">
                <div className="glass-card contact-card">
                  <h3 className="contact-card__heading">Contact Info</h3>
                  {info.email && (
                    <a href={`mailto:${info.email}`} className="contact-item">
                      <div className="contact-item__icon"><HiMail /></div>
                      <div>
                        <p className="contact-item__label">Email</p>
                        <p className="contact-item__value">{info.email}</p>
                      </div>
                    </a>
                  )}
                  {info.address && (
                    <div className="contact-item">
                      <div className="contact-item__icon"><HiLocationMarker /></div>
                      <div>
                        <p className="contact-item__label">Location</p>
                        <p className="contact-item__value">{info.address}</p>
                      </div>
                    </div>
                  )}
                  {info.phone && (
                    <a href={`tel:${info.phone}`} className="contact-item">
                      <div className="contact-item__icon"><HiPhone /></div>
                      <div>
                        <p className="contact-item__label">Phone</p>
                        <p className="contact-item__value">{info.phone}</p>
                      </div>
                    </a>
                  )}
                  <div className="contact-socials">
                    {info.github_url && (
                      <a href={info.github_url} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                        <FiGithub />
                      </a>
                    )}
                    {info.linkedin_url && (
                      <a href={info.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                        <FiLinkedin />
                      </a>
                    )}
                  </div>
                  <a href="/Tajkia CV.pdf" download className="btn-primary" style={{ marginTop: '1.5rem', justifyContent: 'center', width: '100%' }}>
                    Download Full CV
                  </a>
                </div>
              </Tilt>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
