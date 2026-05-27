import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Meal } from "../types/meal";

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMeals() {
    setLoading(true);

    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setMeals(data || []);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await fetchMeals();
    })();

    const channel = supabase
      .channel("web-meals")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meals",
        },
        () => {
          console.log("Realtime update received");
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