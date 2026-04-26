import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMail, HiX, HiChat } from 'react-icons/hi'
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa'
import './FloatingContact.css'

const CONTACT_LINKS = [
  {
    id: 'messenger',
    label: 'Messenger',
    icon: <FaFacebookMessenger />,
    href: 'https://m.me/fardunatajkia', // update if needed
    color: '#0084ff',
    bg: 'linear-gradient(135deg, #0084ff, #00c6ff)',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: <FaWhatsapp />,
    href: 'https://wa.me/8801XXXXXXXXX', // update with real number
    color: '#25d366',
    bg: 'linear-gradient(135deg, #25d366, #128c7e)',
  },
  {
    id: 'email',
    label: 'Email',
    icon: <HiMail />,
    href: 'mailto:fardunatajkia@gmail.com',
    color: 'var(--accent-primary)',
    bg: 'var(--accent-primary)',
  },
]

export default function FloatingContact() {
  const [open, setOpen] = useState(false)

  return (
    <div className="float-contact">
      {/* Items */}
      <AnimatePresence>
        {open && CONTACT_LINKS.map((link, i) => (
          <motion.a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="float-contact__item"
            style={{ background: link.bg }}
            aria-label={link.label}
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            transition={{ delay: (CONTACT_LINKS.length - 1 - i) * 0.07, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ scale: 1.15 }}
          >
            <span className="float-contact__icon">{link.icon}</span>
            <motion.span
              className="float-contact__tooltip"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (CONTACT_LINKS.length - 1 - i) * 0.07 + 0.1 }}
            >
              {link.label}
            </motion.span>
          </motion.a>
        ))}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        className={`float-contact__toggle${open ? ' float-contact__toggle--open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle contact options"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {open ? <HiX /> : <HiChat />}
      </motion.button>
    </div>
  )
}
