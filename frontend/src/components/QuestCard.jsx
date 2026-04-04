import { useState } from 'react'
import { questAPI } from '../services/api'
import styles from './QuestCard.module.css'

const PRIORITY_LABEL = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }
const STATUS_LABEL   = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }

export default function QuestCard({ quest, onUpdate }) {
  const [completing, setCompleting] = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [result,     setResult]     = useState(null)

  const isDone = quest.status === 'DONE'

  const handleComplete = async () => {
    if (isDone) return
    setCompleting(true)
    try {
      const res = await questAPI.complete(quest.id)
      setResult(res.data)
      setTimeout(() => { setResult(null); onUpdate() }, 2500)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete quest')
      setCompleting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Abandon this quest?')) return
    setDeleting(true)
    try {
      await questAPI.delete(quest.id)
      onUpdate()
    } catch {
      setDeleting(false)
    }
  }

  const isOverdue = quest.dueDate && !isDone && new Date(quest.dueDate) < new Date()

  return (
    <div className={`${styles.card} ${isDone ? styles.done : ''}`}>
      {result && (
        <div className={styles.xpPopup}>
          <span className={styles.xpEarned}>+{result.xpEarned} XP</span>
          {result.rankUpOccurred && <span className={styles.rankUpText}>⚡ {result.rankUpMessage}</span>}
        </div>
      )}

      <div className={styles.top}>
        <div className={styles.titleRow}>
          <span className={`badge priority-${quest.priority}`} style={{ border: '1px solid', fontSize: 11 }}>
            {PRIORITY_LABEL[quest.priority]}
          </span>
          <h3 className={`${styles.title} ${isDone ? styles.titleDone : ''}`}>{quest.title}</h3>
        </div>

        <div className={styles.xpBadge}>
          <span>⚡ {quest.xpReward} XP</span>
        </div>
      </div>

      {quest.description && (
        <p className={styles.description}>{quest.description}</p>
      )}

      <div className={styles.meta}>
        <span className={`${styles.status} status-${quest.status}`}>
          {STATUS_LABEL[quest.status]}
        </span>

        {quest.dueDate && (
          <span className={`${styles.due} ${isOverdue ? styles.overdue : ''}`}>
            {isOverdue ? '⚠ Overdue · ' : '📅 '}{quest.dueDate}
          </span>
        )}

        {quest.completedAt && (
          <span className={styles.completedAt}>
            ✓ {new Date(quest.completedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {!isDone && (
        <div className={styles.actions}>
          <button
            className="btn btn-gold"
            style={{ fontSize: 13, padding: '7px 16px' }}
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? <span className="spinner" /> : '⚡ Complete'}
          </button>
          <button
            className="btn btn-danger"
            style={{ fontSize: 13, padding: '7px 16px' }}
            onClick={handleDelete}
            disabled={deleting}
          >
            Abandon
          </button>
        </div>
      )}
    </div>
  )
}
