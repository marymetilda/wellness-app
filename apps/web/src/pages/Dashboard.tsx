import { useMeals } from "../hooks/useMeals";
import { useAuth } from "../hooks/useAuth";
import { useMealActions } from "../hooks/useMealActions";

export default function Dashboard() {
  const { meals, loading } = useMeals();
  const { signOut, user, userLoading } = useAuth();
  const { updateStatus, updateAdminComment } = useMealActions();

  if (userLoading) {
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
        <p className="card">Loading user information...</p>
      </div>
    );
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

       {!loading && meals.length === 0 && <p>No meals found</p>}

       {!loading && meals.length > 0 && (
         <div className="card">
           <div
             style={{
               display: "flex",
               flexDirection: "column",
               gap: 16,
               marginTop: 20,
             }}
           >
             {meals
                .filter(meal => {
                  if (!user) return false;
                  if (user.role === 'admin') return true;
                  return meal.user_id === user.id;
                })
                .map((meal) => (
                  <div
                    key={meal.id}
                    className="meal-card"
                  >
                    <div className="meal-header">
                      <h3 className="meal-title">{meal.description}</h3>
                    </div>

                    <div className="meal-nutrition-grid">
                      <div className="meal-nutrition-item">
                        <span className="meal-label">Calories</span>
                        <span className="meal-value">{meal.calories} kcal</span>
                      </div>
                      <div className="meal-nutrition-item">
                        <span className="meal-label">Protein</span>
                        <span className="meal-value">{meal.protein}g</span>
                      </div>
                      <div className="meal-nutrition-item">
                        <span className="meal-label">Carbs</span>
                        <span className="meal-value">{meal.carbs}g</span>
                      </div>
                      <div className="meal-nutrition-item">
                        <span className="meal-label">Fat</span>
                        <span className="meal-value">{meal.fat}g</span>
                      </div>
                    </div>

                    <div className="meal-insight">
                      <span className="meal-insight-label">🧠 Insight:</span>
                      <span className="meal-insight-text">{meal.health_insight}</span>
                    </div>

                    <div className="meal-user">
                      <span className="meal-user-label">👤 User:</span>
                      <span className="meal-user-text">{meal.user_id}</span>
                    </div>

                    {/* STATUS */}
                    <div className="meal-status">
                      <span className="meal-status-label">Status:</span>
                      <span
                        className={`meal-status-value ${
                          meal.status === "approved"
                            ? "meal-status-approved"
                            : meal.status === "rejected"
                              ? "meal-status-rejected"
                              : "meal-status-pending"
                        }`}
                      >
                        {meal.status || "pending"}
                      </span>
                    </div>

                    {user && user.role === 'admin' && (
                      <div className="meal-admin-section">
                        <textarea
                          className="input"
                          placeholder="Add admin comment..."
                          defaultValue={meal.admin_comment || ""}
                          onBlur={async (e) => {
                            await updateAdminComment(meal.id, e.target.value);
                          }}
                        />

                        <div className="meal-admin-actions">
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
                    )}
                  </div>
                ))}
           </div>
         </div>
       )}
     </div>
   );
}
