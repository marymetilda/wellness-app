import { useState } from "react";
import { supabase } from "../lib/supabase";

interface AnalyzedMeal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthInsight: string;
}

export function useAnalyzeMeal() {
  const [loading, setLoading] = useState(false);

  async function analyzeMeal(meal: string): Promise<AnalyzedMeal | null> {
    if (!meal.trim()) return null;

    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const response = await fetch(
        "https://ltkohpmktixttzscadzw.supabase.co/functions/v1/analyze-meal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ meal }),
        }
      );

      const ai = await response.json();

      console.log("AI RESPONSE:", ai);

      if (!response.ok || !ai) {
        throw new Error(ai?.error || "AI analysis failed");
      }

      const { error } = await supabase.from("meals").insert({
        user_id: user.id,
        description: meal,
        calories: ai.calories,
        protein: ai.protein,
        carbs: ai.carbs,
        fat: ai.fat,
        health_insight: ai.healthInsight,
      });

      if (error) {
        throw new Error(error.message);
      }

      return ai;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { analyzeMeal, loading };
}