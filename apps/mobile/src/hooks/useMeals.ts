import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface Meal {
  id: string;
  user_id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  health_insight: string;
  status?: string;
  admin_comment?: string;
  created_at: string;
}

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMeals() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      setMeals(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMeals();

    const channel = supabase
      .channel("mobile-meals")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meals",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          fetchMeals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { meals, loading, refetch: fetchMeals };
}