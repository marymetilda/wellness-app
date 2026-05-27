import { useState } from 'react'

import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [signingUp, setSigningUp] = useState(false)

  async function handleLogin() {
    setLoading(true)
    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) {
        alert(error.message)
        return
      }

      window.location.reload()
    } catch {
      alert('Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp() {
    setSigningUp(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
      } else {
        alert("User created! You can now log in.");
        setEmail("");
        setPassword("");
      }
    } catch {
      alert("Failed to create user");
    } finally {
      setSigningUp(false);
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