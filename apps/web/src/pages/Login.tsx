import { useState } from 'react'

import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signUp, loading, signingUp } = useAuth()

  async function handleLogin() {
    try {
      await signIn(email, password)
    } catch (error) {
      alert((error as Error).message)
    }
  }

  async function handleSignUp() {
    const error = await signUp(email, password)
    if (error) {
      alert(error)
    } else {
      alert("User created! You can now log in.")
      setEmail("")
      setPassword("")
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Admin Login</h1>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          className="button button-secondary"
          onClick={handleSignUp}
          disabled={signingUp}
          style={{ marginTop: 12 }}
        >
          {signingUp ? 'Creating...' : 'Sign Up'}
        </button>
      </div>
    </div>
  )
}