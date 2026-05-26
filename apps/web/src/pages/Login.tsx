import { useState } from 'react'

import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
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
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
      }}
    >
      <div
        style={{
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h1>Admin Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ddd',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ddd',
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            padding: 14,
            borderRadius: 8,
            border: 'none',
            background: 'black',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </div>
    </div>
  )
}