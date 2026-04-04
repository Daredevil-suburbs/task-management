import { useEffect, useState } from 'react'
import { questAPI } from '../services/api'
import QuestCard from './QuestCard'
import styles from './QuestList.module.css'

const FILTERS = [
  { label: 'All',         value: null,          field: null },
  { label: 'Active',      value: 'TODO',         field: 'status' },
  { label: 'In Progress', value: 'IN_PROGRESS',  field: 'status' },
  { label: 'Completed',   value: 'DONE',         field: 'status' },
  { label: 'High',        value: 'HIGH',         field: 'priority' },
]

export default function QuestList({ refreshTrigger, onUpdate }) {
  const [quests,  setQuests]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState(FILTERS[0])

  const load = () => {
    setLoading(true)
    const params = filter.field ? { [filter.field]: filter.value } : {}
    questAPI.getAll(params)
      .then(res => setQuests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [refreshTrigger, filter])

  const active    = quests.filter(q => q.status !== 'DONE')
  const completed = quests.filter(q => q.status === 'DONE')

  return (
    <div>
      <div className={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f.label}
            className={`${styles.filterBtn} ${filter.label === f.label ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.center}><div className="spinner" /></div>
      ) : quests.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No quests found</p>
          <p className={styles.emptySubtitle}>Accept a new quest to begin your journey</p>
        </div>
      ) : (
        <div>
          {active.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Active Quests ({active.length})</h4>
              <div className={styles.list}>
                {active.map(q => (
                  <QuestCard key={q.id} quest={q} onUpdate={() => { load(); onUpdate() }} />
                ))}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Completed ({completed.length})</h4>
              <div className={styles.list}>
                {completed.map(q => (
                  <QuestCard key={q.id} quest={q} onUpdate={() => { load(); onUpdate() }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
