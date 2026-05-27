export interface Meal {
  id: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  health_insight: string
  status: string
  user_id: string
  created_at?: string
  admin_comment?: string
}