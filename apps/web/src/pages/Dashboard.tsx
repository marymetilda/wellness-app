import { useMeals } from "../hooks/useMeals";
import { useAuth } from "../hooks/useAuth";
import { useMealActions } from "../hooks/useMealActions";

export default function Dashboard() {
  const { meals, loading } = useMeals();
  const { signOut } = useAuth();
  const { updateStatus, updateAdminComment } = useMealActions();

  if (!loading && meals.length === 0) {
    return <p>No meals found</p>;
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Meal Dashboard</h1>
        <button
           className="button button-secondary"
           onClick={signOut}
         >
           Logout
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
                  await updateAdminComment(meal.id, e.target.value);
                }}
              />

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button
                  className="button"
                  onClick={async () => {
                    await updateStatus(meal.id, "approved");
                  }}
                >
                  Approve
                </button>

                <button
                  className="button button-secondary"
                  onClick={async () => {
                    await updateStatus(meal.id, "rejected");
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
