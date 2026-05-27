import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";
import type { Meal } from "../types/meal";

export default function Dashboard() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
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

          (async () => {
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
          })();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!loading && meals.length === 0) {
    return <p>No meals found</p>;
  }

  return (
    <div
      style={{
        padding: 24,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1>Meal Dashboard</h1>

      {loading && <p>Loading meals...</p>}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 20,
        }}
      >
        {meals.map((meal) => (
          <div
            key={meal.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <h3>{meal.description}</h3>

            <p>Calories: {meal.calories}</p>
            <p>Protein: {meal.protein}g</p>
            <p>Carbs: {meal.carbs}g</p>
            <p>Fat: {meal.fat}g</p>

            <p>🧠 Insight: {meal.health_insight}</p>

            <p>👤 User: {meal.user_id}</p>

            {/* STATUS */}
            <p>
              Status:{" "}
              <b
                style={{
                  color:
                    meal.status === "approved"
                      ? "green"
                      : meal.status === "rejected"
                        ? "red"
                        : "orange",
                }}
              >
                {meal.status || "pending"}
              </b>
            </p>

            {/* ADMIN COMMENT */}
            <textarea
              placeholder="Add admin comment..."
              style={{
                width: "100%",
                marginTop: 10,
                padding: 8,
              }}
              defaultValue={meal.admin_comment || ""}
              onBlur={async (e) => {
                await supabase
                  .from("meals")
                  .update({
                    admin_comment: e.target.value,
                  })
                  .eq("id", meal.id);
              }}
            />

            {/* STATUS BUTTONS */}
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button
                onClick={async () => {
                  await supabase
                    .from("meals")
                    .update({ status: "approved" })
                    .eq("id", meal.id);
                }}
              >
                Approve
              </button>

              <button
                onClick={async () => {
                  await supabase
                    .from("meals")
                    .update({ status: "rejected" })
                    .eq("id", meal.id);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
