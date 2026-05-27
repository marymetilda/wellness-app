import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";
import type { Meal } from "../types/meal";

export default function Dashboard() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

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
    <div className="container">
      <h1>Meal Dashboard</h1>
      <div className="card">
        <h3>Create User</h3>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="input"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="button"
          onClick={async () => {
            setCreating(true);

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
                alert("User created!");
                setEmail("");
                setPassword("");
              }
            } catch {
              alert("Failed to create user");
            }

            setCreating(false);
          }}
          disabled={creating}
        >
          {creating ? "Creating..." : "Create User"}
        </button>
      </div>

      {loading && <p className="card">Loading meals...</p>}

      <div className="card">
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
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
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

              <textarea
                className="input"
                placeholder="Add admin comment..."
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

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button
                  className="button"
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
                  className="button button-secondary"
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
    </div>
  );
}
