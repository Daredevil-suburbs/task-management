import { useState } from 'react'
import { questAPI } from '../services/api'
import styles from './AddQuest.module.css'

export default function AddQuest({ onQuestAdded }) {
  const [open,     setOpen]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM', xpReward: 50, dueDate: ''
  })

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        title:       form.title,
        description: form.description || undefined,
        priority:    form.priority,
        xpReward:    Number(form.xpReward),
        dueDate:     form.dueDate || undefined,
      }
      await questAPI.create(payload)
      setForm({ title: '', description: '', priority: 'MEDIUM', xpReward: 50, dueDate: '' })
      setOpen(false)
      onQuestAdded()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create quest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      {!open ? (
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          + New Quest
        </button>
      ) : (
        <div className={`card ${styles.form}`}>
          <div className={styles.formHeader}>
            <h3>NEW QUEST</h3>
            <button className="btn btn-ghost" style={{ padding: '4px 10px' }} onClick={() => setOpen(false)}>✕</button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Quest Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Defeat the dungeon boss..."
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Quest details..."
                rows={2}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className={styles.row}>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={e => set('priority', e.target.value)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>XP Reward</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={form.xpReward}
                  onChange={e => set('xpReward', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => set('dueDate', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-gold" disabled={loading}>
                {loading ? <span className="spinner" /> : '⚡ ACCEPT QUEST'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
