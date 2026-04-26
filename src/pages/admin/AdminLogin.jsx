import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import './AdminLogin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/dashboard', { replace: true })
    })
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back! 🎉')
      navigate('/admin/dashboard', { replace: true })
    }
  }

  return (
    <div className="admin-login">
      {/* Background blobs */}
      <div className="login-blob login-blob--1" />
      <div className="login-blob login-blob--2" />

      <motion.div
        className="login-card glass-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="login-logo"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="login-logo__ring" />
          <span className="login-logo__text">&lt;FT/&gt;</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <h1 className="login-title">Admin Panel</h1>
          <p className="login-subtitle">Sign in to manage your portfolio</p>
        </motion.div>

        <motion.form
          className="login-form"
          onSubmit={handleLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Email */}
          <div className="login-field">
            <label className="login-label">Email</label>
            <div className="login-input-wrap">
              <HiMail className="login-input-icon" />
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <HiLockClosed className="login-input-icon" />
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-pw-toggle"
                onClick={() => setShowPw(!showPw)}
                aria-label="Toggle password"
              >
                {showPw ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn-primary login-submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              'Sign In'
            )}
          </motion.button>
        </motion.form>

        <a href="/" className="login-back">← Back to Portfolio</a>
      </motion.div>
    </div>
  )
}
