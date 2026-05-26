import { useEffect, useState } from 'react'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

import { supabase } from './lib/supabase'

export default function App() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Login />
  }

  return <Dashboard />
}