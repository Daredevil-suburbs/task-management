import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>HUNTER SYSTEM</h1>
          <p className={styles.subtitle}>Begin Your Awakening</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Hunter Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Sung Jin-Woo"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="hunter@system.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'AWAKEN'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already a hunter? <Link to="/login" className={styles.link}>Enter the Gate</Link>
        </p>
      </div>
    </div>
  )
}
