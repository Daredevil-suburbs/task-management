import { useEffect, useState } from 'react'
import { userAPI } from '../services/api'
import styles from './StatusPanel.module.css'

const RANK_ORDER = ['E', 'D', 'C', 'B', 'A', 'S']

function getRankLetter(displayName) {
  return displayName?.split(' ')[0] || 'E'
}

export default function StatusPanel({ refreshTrigger }) {
  const [status,  setStatus]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [rankUp,  setRankUp]  = useState(false)

  useEffect(() => {
    userAPI.getStatus()
      .then(res => {
        if (status) {
          const prev = getRankLetter(status.hunterRank)
          const next = getRankLetter(res.data.hunterRank)
          if (RANK_ORDER.indexOf(next) > RANK_ORDER.indexOf(prev)) setRankUp(true)
        }
        setStatus(res.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [refreshTrigger])

  useEffect(() => {
    if (rankUp) { const t = setTimeout(() => setRankUp(false), 3000); return () => clearTimeout(t) }
  }, [rankUp])

  if (loading) return <div className={styles.panel}><div className="spinner" /></div>
  if (!status) return null

  const rankLetter  = getRankLetter(status.hunterRank)
  const xpProgress  = status.xpToNextLevel > 0
    ? Math.round(((100 - status.xpToNextLevel) / 100) * 100)
    : 100

  return (
    <div className={styles.panel}>
      {rankUp && (
        <div className={styles.rankUpBanner}>
          ⚡ RANK UP! You are now {status.hunterRank}!
        </div>
      )}

      <div className={styles.top}>
        <div className={styles.rankBadge}>
          <span className={`${styles.rankLetter} rank-${rankLetter}`}>{rankLetter}</span>
          <span className={styles.rankLabel}>RANK</span>
        </div>

        <div className={styles.info}>
          <h2 className={styles.name}>{status.name}</h2>
          <p className={styles.rankName}>{status.hunterRank}</p>
        </div>

        <div className={styles.levelBadge}>
          <span className={styles.levelNum}>LV.{status.level}</span>
        </div>
      </div>

      <div className={styles.xpSection}>
        <div className={styles.xpHeader}>
          <span>EXP</span>
          <span className={styles.xpNumbers}>
            {status.totalXp.toLocaleString()} XP
            {!status.maxRank && <span className={styles.xpNext}> · {status.xpToNextRank} to next rank</span>}
          </span>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{status.tasksCompleted}</span>
          <span className={styles.statLabel}>Quests Done</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{status.level}</span>
          <span className={styles.statLabel}>Level</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={`${styles.statValue} rank-${rankLetter}`}>{rankLetter}</span>
          <span className={styles.statLabel}>Rank</span>
        </div>
      </div>
    </div>
  )
}
