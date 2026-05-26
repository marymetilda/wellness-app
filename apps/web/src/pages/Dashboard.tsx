import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'
import type { Meal } from '../types/meal'

export default function Dashboard() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMeals() {
      setLoading(true)
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('created_at', {
          ascending: false,
        })

      if (error) {
        console.log(error)
        setLoading(false)
        return
      }

      setMeals(data || [])
      setLoading(false)
    }

    fetchMeals()
  }, [])

  return (
    <div
      style={{
        padding: 24,
        background: '#fff',
        minHeight: '100vh',
      }}
    >
      <h1>Meal Dashboard</h1>

      {loading && <p>Loading meals...</p>}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginTop: 20,
        }}
      >
        {meals.map((meal) => (
          <div
            key={meal.id}
            style={{
              border: '1px solid #eee',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <h3>{meal.description}</h3>

            <p>
              Calories: {meal.calories}
            </p>

            <p>
              Protein: {meal.protein}g
            </p>

            <p>
              Carbs: {meal.carbs}g
            </p>

            <p>
              Fat: {meal.fat}g
            </p>

            <p>
              Insight:{' '}
              {meal.health_insight}
            </p>

            <p>
              Status: {meal.status}
            </p>

            <p>
              User ID: {meal.user_id}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
