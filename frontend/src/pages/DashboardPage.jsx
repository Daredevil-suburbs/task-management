import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import StatusPanel from '../components/StatusPanel'
import AddQuest from '../components/AddQuest'
import QuestList from '../components/QuestList'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [refresh, setRefresh] = useState(0)

  const trigger = () => setRefresh(r => r + 1)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>HUNTER SYSTEM</h1>
          <span className={styles.version}>v1.0</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.greeting}>Welcome, {user?.name}</span>
          <button className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 14px' }} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.sidebar}>
          <StatusPanel refreshTrigger={refresh} />
        </div>

        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Quest Board</h2>
          </div>
          <AddQuest onQuestAdded={trigger} />
          <QuestList refreshTrigger={refresh} onUpdate={trigger} />
        </div>
      </main>
    </div>
  )
}
