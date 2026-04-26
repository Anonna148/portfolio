import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiUser, HiAcademicCap, HiCode, HiLightningBolt,
  HiMail, HiDocumentText, HiLogout, HiMenuAlt3, HiX,
  HiPencil, HiTrash, HiPlus, HiCheck, HiUpload,
  HiBriefcase, HiChartBar
} from 'react-icons/hi'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import './AdminDashboard.css'

// ─── Tab config ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',   label: 'Profile',   icon: <HiUser /> },
  { id: 'experience',label: 'Experience',icon: <HiBriefcase /> },
  { id: 'education', label: 'Education', icon: <HiAcademicCap /> },
  { id: 'projects',  label: 'Projects',  icon: <HiCode /> },
  { id: 'skills',    label: 'Skills',    icon: <HiLightningBolt /> },
  { id: 'stats',     label: 'Stats',     icon: <HiChartBar /> },
  { id: 'contact',   label: 'Contact',   icon: <HiMail /> },
  { id: 'resume',    label: 'Resume',    icon: <HiDocumentText /> },
]

// ─── Helper: Generic Table ────────────────────────────────────────────────
function DataTable({ columns, rows, onEdit, onDelete, onAdd, addLabel }) {
  return (
    <div className="data-table-wrap glass-card">
      <div className="data-table-header">
        <h3 className="data-table-title">{addLabel}</h3>
        <button className="btn-primary btn-sm" onClick={onAdd}><HiPlus /> Add New</button>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}<th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="table-empty">No records yet</td></tr>
            )}
            {rows.map(row => (
              <tr key={row.id}>
                {columns.map(c => <td key={c.key} title={String(row[c.key] ?? '')}>{String(row[c.key] ?? '')}</td>)}
                <td className="table-actions">
                  <button className="icon-btn icon-btn--edit" onClick={() => onEdit(row)}><HiPencil /></button>
                  <button className="icon-btn icon-btn--del" onClick={() => onDelete(row.id)}><HiTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Helper: Modal ────────────────────────────────────────────────────────
function Modal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="modal glass-card" onClick={e => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }} transition={{ ease: [0.34,1.56,0.64,1], duration: 0.35 }}>
            <div className="modal__header">
              <h3 className="modal__title">{title}</h3>
              <button className="icon-btn" onClick={onClose}><HiX /></button>
            </div>
            <div className="modal__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Field component ──────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {type === 'textarea'
        ? <textarea className="form-input form-textarea" value={value ?? ''} onChange={onChange} placeholder={placeholder} rows={3} />
        : <input className="form-input" type={type} value={value ?? ''} onChange={onChange} placeholder={placeholder} />
      }
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
//  Main Dashboard
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__top">
          <div className="sidebar-logo">&lt;FT/&gt;</div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><HiX /></button>
        </div>

        {user && (
          <div className="sidebar-user glass-card">
            <div className="sidebar-avatar">{user.email?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="sidebar-user__email">{user.email}</p>
              <p className="sidebar-user__role">Administrator</p>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-link${activeTab === tab.id ? ' sidebar-link--active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && <motion.span className="sidebar-indicator" layoutId="sidebarIndicator" />}
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <HiLogout /> Sign Out
        </button>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar glass-card">
          <button className="admin-burger" onClick={() => setSidebarOpen(true)}><HiMenuAlt3 /></button>
          <h2 className="admin-topbar__title">
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">View Site</a>
        </header>

        {/* Content */}
        <main className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {activeTab === 'profile'   && <ProfileTab />}
              {activeTab === 'experience'&& <ExperienceTab />}
              {activeTab === 'education' && <EducationTab />}
              {activeTab === 'projects'  && <ProjectsTab />}
              {activeTab === 'skills'    && <SkillsTab />}
              {activeTab === 'stats'     && <StatsTab />}
              {activeTab === 'contact'   && <ContactTab />}
              {activeTab === 'resume'    && <ResumeTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: Profile
// ═══════════════════════════════════════════════════════════════════════════
function ProfileTab() {
  const [data, setData] = useState({ name:'', title:'', bio:'', email:'', address:'', github_url:'', linkedin_url:'', photo_url:'', hero_image_url:'' })
  const [rolesInput, setRolesInput] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()
  const heroFileRef = useRef()

  useEffect(() => {
    supabase.from('profile').select('*').single()
      .then(({ data: d }) => { 
        if (d) {
          setData(d)
          if (d.roles) setRolesInput(d.roles.join(', '))
        }
      })
      .catch(() => {})
  }, [])

  const save = async () => {
    setLoading(true)
    const { id, ...rest } = data
    const payload = { 
      ...rest, 
      roles: rolesInput.split(',').map(r => r.trim()).filter(Boolean)
    }
    let res
    if (id) {
      res = await supabase.from('profile').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id)
    } else {
      res = await supabase.from('profile').insert([payload])
    }
    setLoading(false)
    res.error ? toast.error(res.error.message) : toast.success('Profile saved!')
  }

  const uploadPhoto = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    const path = `profile/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('portfolio-assets').upload(path, file, { upsert: true })
    if (error) { toast.error(error.message); return }
    const { data: url } = supabase.storage.from('portfolio-assets').getPublicUrl(path)
    setData(d => ({ ...d, [field]: url.publicUrl }))
    toast.success('Image uploaded!')
  }

  const f = (key) => ({ value: data[key] ?? '', onChange: e => setData(d => ({ ...d, [key]: e.target.value })) })

  return (
    <div className="tab-section">
      <div className="profile-photo-row glass-card">
        <div className="profile-photo-preview">
          {data.photo_url
            ? <img src={data.photo_url} alt="Profile" />
            : <div className="photo-placeholder">{data.name?.charAt(0) || 'F'}</div>
          }
        </div>
        <div>
          <p className="form-label">Profile Photo (Navbar/Small)</p>
          <input type="file" accept="image/*" ref={fileRef} style={{ display:'none' }} onChange={(e) => uploadPhoto(e, 'photo_url')} />
          <button className="btn-outline btn-sm" onClick={() => fileRef.current.click()}><HiUpload /> Upload Photo</button>
          {data.photo_url && <p className="photo-url-hint">{data.photo_url}</p>}
        </div>
      </div>

      <div className="profile-photo-row glass-card">
        <div className="profile-photo-preview" style={{ borderRadius: '12px' }}>
          {data.hero_image_url
            ? <img src={data.hero_image_url} alt="Hero" />
            : <div className="photo-placeholder">H</div>
          }
        </div>
        <div>
          <p className="form-label">Hero Frame Image</p>
          <input type="file" accept="image/*" ref={heroFileRef} style={{ display:'none' }} onChange={(e) => uploadPhoto(e, 'hero_image_url')} />
          <button className="btn-outline btn-sm" onClick={() => heroFileRef.current.click()}><HiUpload /> Upload Hero Image</button>
          {data.hero_image_url && <p className="photo-url-hint">{data.hero_image_url}</p>}
        </div>
      </div>

      <div className="form-grid glass-card">
        <Field label="Full Name" {...f('name')} placeholder="Farduna Tajkia" />
        <Field label="Title / Role" {...f('title')} placeholder="CSE Student & Developer" />
        <Field label="Email" type="email" {...f('email')} placeholder="you@email.com" />
        <Field label="Address" {...f('address')} placeholder="City, Country" />
        <Field label="GitHub URL" {...f('github_url')} placeholder="https://github.com/..." />
        <Field label="LinkedIn URL" {...f('linkedin_url')} placeholder="https://linkedin.com/in/..." />
        <div className="form-field--full">
          <Field label="Hero Roles (Comma separated)" value={rolesInput} onChange={e => setRolesInput(e.target.value)} placeholder="CSE Student, Developer, Designer" />
        </div>
        <div className="form-field--full">
          <Field label="Bio" type="textarea" {...f('bio')} placeholder="Tell the world about yourself..." />
        </div>
      </div>
      <button className="btn-primary" onClick={save} disabled={loading}>
        {loading ? <span className="login-spinner" /> : <><HiCheck /> Save Profile</>}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: Experience
// ═══════════════════════════════════════════════════════════════════════════
function ExperienceTab() {
  const [rows, setRows] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ role:'', company:'', date_start:'', date_end:'', description:'', sort_order:0 })

  const load = () => supabase.from('experience').select('*').order('sort_order').then(({ data }) => setRows(data || []))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ role:'', company:'', date_start:'', date_end:'', description:'', sort_order:rows.length+1 }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm(row); setModal(true) }
  const del = async (id) => {
    if (!confirm('Delete this record?')) return
    await supabase.from('experience').delete().eq('id', id)
    toast.success('Deleted'); load()
  }
  const save = async () => {
    const res = editing
      ? await supabase.from('experience').update(form).eq('id', editing.id)
      : await supabase.from('experience').insert([form])
    res.error ? toast.error(res.error.message) : (toast.success('Saved!'), setModal(false), load())
  }

  const f = (k) => ({ value: form[k] ?? '', onChange: e => setForm(d => ({ ...d, [k]: e.target.value })) })

  return (
    <>
      <DataTable
        addLabel="Experience Records"
        columns={[
          { key: 'role', label: 'Role' },
          { key: 'company', label: 'Company' },
          { key: 'date_start', label: 'From' },
          { key: 'date_end', label: 'To' },
        ]}
        rows={rows} onEdit={openEdit} onDelete={del} onAdd={openAdd}
      />
      <Modal open={modal} title={editing ? 'Edit Experience' : 'Add Experience'} onClose={() => setModal(false)}>
        <div className="form-grid">
          <Field label="Role" {...f('role')} placeholder="Software Engineer" />
          <Field label="Company" {...f('company')} placeholder="Company name" />
          <Field label="Date Start" {...f('date_start')} placeholder="Jan 2023" />
          <Field label="Date End" {...f('date_end')} placeholder="Present" />
          <Field label="Sort Order" type="number" {...f('sort_order')} />
          <div className="form-field--full">
            <Field label="Description" type="textarea" {...f('description')} placeholder="Role description..." />
          </div>
        </div>
        <button className="btn-primary" onClick={save}><HiCheck /> Save</button>
      </Modal>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: Education
// ═══════════════════════════════════════════════════════════════════════════
function EducationTab() {
  const [rows, setRows] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ degree:'', institution:'', year_start:'', year_end:'', gpa:'', sort_order:0 })

  const load = () => supabase.from('education').select('*').order('sort_order').then(({ data }) => setRows(data || []))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ degree:'', institution:'', year_start:'', year_end:'', gpa:'', sort_order:rows.length+1 }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm(row); setModal(true) }
  const del = async (id) => {
    if (!confirm('Delete this record?')) return
    await supabase.from('education').delete().eq('id', id)
    toast.success('Deleted'); load()
  }
  const save = async () => {
    const res = editing
      ? await supabase.from('education').update(form).eq('id', editing.id)
      : await supabase.from('education').insert([form])
    res.error ? toast.error(res.error.message) : (toast.success('Saved!'), setModal(false), load())
  }

  const f = (k) => ({ value: form[k] ?? '', onChange: e => setForm(d => ({ ...d, [k]: e.target.value })) })

  return (
    <>
      <DataTable
        addLabel="Education Records"
        columns={[
          { key: 'degree', label: 'Degree' },
          { key: 'institution', label: 'Institution' },
          { key: 'year_start', label: 'From' },
          { key: 'year_end', label: 'To' },
          { key: 'gpa', label: 'GPA' },
        ]}
        rows={rows} onEdit={openEdit} onDelete={del} onAdd={openAdd}
      />
      <Modal open={modal} title={editing ? 'Edit Education' : 'Add Education'} onClose={() => setModal(false)}>
        <div className="form-grid">
          <Field label="Degree" {...f('degree')} placeholder="B.Sc in CS" />
          <Field label="Institution" {...f('institution')} placeholder="University name" />
          <Field label="Year Start" {...f('year_start')} placeholder="2022" />
          <Field label="Year End" {...f('year_end')} placeholder="Expected 2025" />
          <Field label="GPA" {...f('gpa')} placeholder="3.73 / 4.00" />
          <Field label="Sort Order" type="number" {...f('sort_order')} />
        </div>
        <button className="btn-primary" onClick={save}><HiCheck /> Save</button>
      </Modal>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: Projects
// ═══════════════════════════════════════════════════════════════════════════
function ProjectsTab() {
  const [rows, setRows] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title:'', description:'', image_url:'', github_url:'', live_url:'', tags:'', sort_order:0 })
  const fileRef = useRef()

  const load = () => supabase.from('projects').select('*').order('sort_order').then(({ data }) => setRows(data || []))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ title:'', description:'', image_url:'', github_url:'', live_url:'', tags:'', sort_order:rows.length+1 }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm({ ...row, tags: (row.tags || []).join(', ') }); setModal(true) }
  const del = async (id) => {
    if (!confirm('Delete?')) return
    await supabase.from('projects').delete().eq('id', id)
    toast.success('Deleted'); load()
  }

  const uploadImg = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const path = `projects/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('portfolio-assets').upload(path, file, { upsert: true })
    if (error) { toast.error(error.message); return }
    const { data: url } = supabase.storage.from('portfolio-assets').getPublicUrl(path)
    setForm(d => ({ ...d, image_url: url.publicUrl })); toast.success('Image uploaded!')
  }

  const save = async () => {
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    const res = editing
      ? await supabase.from('projects').update(payload).eq('id', editing.id)
      : await supabase.from('projects').insert([payload])
    res.error ? toast.error(res.error.message) : (toast.success('Saved!'), setModal(false), load())
  }

  const f = (k) => ({ value: form[k] ?? '', onChange: e => setForm(d => ({ ...d, [k]: e.target.value })) })

  return (
    <>
      <DataTable
        addLabel="Projects"
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'description', label: 'Description' },
          { key: 'github_url', label: 'GitHub' },
        ]}
        rows={rows} onEdit={openEdit} onDelete={del} onAdd={openAdd}
      />
      <Modal open={modal} title={editing ? 'Edit Project' : 'Add Project'} onClose={() => setModal(false)}>
        <div className="form-grid">
          <Field label="Title" {...f('title')} placeholder="Project name" />
          <Field label="GitHub URL" {...f('github_url')} placeholder="https://github.com/..." />
          <Field label="Live URL" {...f('live_url')} placeholder="https://..." />
          <Field label="Sort Order" type="number" {...f('sort_order')} />
          <div className="form-field--full">
            <Field label="Description" type="textarea" {...f('description')} placeholder="Project description..." />
          </div>
          <div className="form-field--full">
            <Field label="Tags (comma separated)" {...f('tags')} placeholder="Java, Oracle, SQL" />
          </div>
          <div className="form-field--full">
            <label className="form-label">Project Image</label>
            <div className="upload-row">
              <input type="file" accept="image/*" ref={fileRef} style={{ display:'none' }} onChange={uploadImg} />
              <button className="btn-outline btn-sm" onClick={() => fileRef.current.click()}><HiUpload /> Upload Image</button>
              {form.image_url && <a href={form.image_url} target="_blank" rel="noreferrer" className="photo-url-hint">Preview ↗</a>}
            </div>
            {form.image_url && <Field label="Or paste image URL" {...f('image_url')} placeholder="https://..." />}
            {!form.image_url && <Field label="Or paste image URL" {...f('image_url')} placeholder="https://..." />}
          </div>
        </div>
        <button className="btn-primary" onClick={save}><HiCheck /> Save</button>
      </Modal>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: Skills
// ═══════════════════════════════════════════════════════════════════════════
function SkillsTab() {
  const [rows, setRows] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name:'', category:'Languages', sort_order:0 })

  const load = () => supabase.from('skills').select('*').order('category').then(({ data }) => setRows(data || []))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ name:'', category:'Languages', sort_order:rows.length+1 }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm(row); setModal(true) }
  const del = async (id) => {
    if (!confirm('Delete?')) return
    await supabase.from('skills').delete().eq('id', id)
    toast.success('Deleted'); load()
  }
  const save = async () => {
    const res = editing
      ? await supabase.from('skills').update(form).eq('id', editing.id)
      : await supabase.from('skills').insert([form])
    res.error ? toast.error(res.error.message) : (toast.success('Saved!'), setModal(false), load())
  }

  const f = (k) => ({ value: form[k] ?? '', onChange: e => setForm(d => ({ ...d, [k]: e.target.value })) })

  return (
    <>
      <DataTable
        addLabel="Skills"
        columns={[
          { key: 'name', label: 'Skill' },
          { key: 'category', label: 'Category' },
          { key: 'sort_order', label: 'Order' },
        ]}
        rows={rows} onEdit={openEdit} onDelete={del} onAdd={openAdd}
      />
      <Modal open={modal} title={editing ? 'Edit Skill' : 'Add Skill'} onClose={() => setModal(false)}>
        <div className="form-grid">
          <Field label="Skill Name" {...f('name')} placeholder="Python" />
          <div className="form-field">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={e => setForm(d => ({ ...d, category: e.target.value }))}>
              {['Languages','Databases','Tools','OS','General'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Field label="Sort Order" type="number" {...f('sort_order')} />
        </div>
        <button className="btn-primary" onClick={save}><HiCheck /> Save</button>
      </Modal>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: Stats
// ═══════════════════════════════════════════════════════════════════════════
function StatsTab() {
  const [rows, setRows] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ label:'', value:'', icon:'', sort_order:0 })

  const load = () => supabase.from('stats').select('*').order('sort_order').then(({ data }) => setRows(data || []))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ label:'', value:'', icon:'', sort_order:rows.length+1 }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm(row); setModal(true) }
  const del = async (id) => {
    if (!confirm('Delete?')) return
    await supabase.from('stats').delete().eq('id', id)
    toast.success('Deleted'); load()
  }
  const save = async () => {
    const res = editing
      ? await supabase.from('stats').update(form).eq('id', editing.id)
      : await supabase.from('stats').insert([form])
    res.error ? toast.error(res.error.message) : (toast.success('Saved!'), setModal(false), load())
  }

  const f = (k) => ({ value: form[k] ?? '', onChange: e => setForm(d => ({ ...d, [k]: e.target.value })) })

  return (
    <>
      <DataTable
        addLabel="Stats"
        columns={[
          { key: 'label', label: 'Label' },
          { key: 'value', label: 'Value' },
          { key: 'icon', label: 'Icon' },
        ]}
        rows={rows} onEdit={openEdit} onDelete={del} onAdd={openAdd}
      />
      <Modal open={modal} title={editing ? 'Edit Stat' : 'Add Stat'} onClose={() => setModal(false)}>
        <div className="form-grid">
          <Field label="Label" {...f('label')} placeholder="Years Experience" />
          <Field label="Value" {...f('value')} placeholder="2+" />
          <Field label="Icon" {...f('icon')} placeholder="Briefcase" />
          <Field label="Sort Order" type="number" {...f('sort_order')} />
        </div>
        <button className="btn-primary" onClick={save}><HiCheck /> Save</button>
      </Modal>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: Contact
// ═══════════════════════════════════════════════════════════════════════════
function ContactTab() {
  const [data, setData] = useState({ address:'', email:'', phone:'', whatsapp_number:'', github_url:'', linkedin_url:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('contact').select('*').single()
      .then(({ data: d }) => { if (d) setData(d) })
      .catch(() => {})
  }, [])

  const save = async () => {
    setLoading(true)
    const { id, ...rest } = data
    const res = id
      ? await supabase.from('contact').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id)
      : await supabase.from('contact').insert([rest])
    setLoading(false)
    res.error ? toast.error(res.error.message) : toast.success('Contact info saved!')
  }

  const f = (k) => ({ value: data[k] ?? '', onChange: e => setData(d => ({ ...d, [k]: e.target.value })) })

  return (
    <div className="tab-section">
      <div className="form-grid glass-card">
        <Field label="Email" type="email" {...f('email')} placeholder="you@email.com" />
        <Field label="Phone" {...f('phone')} placeholder="+880 1XXXXXXXXX" />
        <Field label="WhatsApp Number (Intl format, no +)" {...f('whatsapp_number')} placeholder="8801XXXXXXXXX" />
        <Field label="GitHub URL" {...f('github_url')} placeholder="https://github.com/..." />
        <Field label="LinkedIn URL" {...f('linkedin_url')} placeholder="https://linkedin.com/in/..." />
        <div className="form-field--full">
          <Field label="Address" type="textarea" {...f('address')} placeholder="Your address" />
        </div>
      </div>

      <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={save} disabled={loading}>
        {loading ? <span className="login-spinner" /> : <><HiCheck /> Save Contact Info</>}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: Resume
// ═══════════════════════════════════════════════════════════════════════════
function ResumeTab() {
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const load = () => supabase.from('resume').select('*').single()
    .then(({ data }) => { if (data) setCurrent(data) }).catch(() => {})

  useEffect(() => { load() }, [])

  const uploadResume = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setLoading(true)
    const path = `cv/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('resume').upload(path, file, { upsert: true })
    if (error) { toast.error(error.message); setLoading(false); return }
    const { data: url } = supabase.storage.from('resume').getPublicUrl(path)
    const pubUrl = url.publicUrl
    const { id } = current || {}
    const res = id
      ? await supabase.from('resume').update({ file_url: pubUrl, updated_at: new Date().toISOString() }).eq('id', id)
      : await supabase.from('resume').insert([{ file_url: pubUrl }])
    setLoading(false)
    res.error ? toast.error(res.error.message) : (toast.success('Resume updated!'), load())
  }

  return (
    <div className="tab-section">
      <div className="glass-card resume-card">
        <h3 className="resume-card__title">Current Resume / CV</h3>
        {current?.file_url ? (
          <div className="resume-current">
            <p className="resume-url">{current.file_url}</p>
            <a href={current.file_url} target="_blank" rel="noreferrer" className="btn-outline btn-sm">Preview PDF ↗</a>
          </div>
        ) : (
          <p className="resume-empty">No resume uploaded yet</p>
        )}

        <div className="upload-row" style={{ marginTop: '1.5rem' }}>
          <input type="file" accept=".pdf" ref={fileRef} style={{ display:'none' }} onChange={uploadResume} />
          <motion.button className="btn-primary" onClick={() => fileRef.current.click()} disabled={loading}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {loading ? <span className="login-spinner" /> : <><HiUpload /> Upload New CV (PDF)</>}
          </motion.button>
        </div>

        <p className="resume-note">
          After uploading, the Download CV button on your portfolio will automatically point to the new file.
        </p>
      </div>
    </div>
  )
}
