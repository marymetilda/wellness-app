import { useEffect, useState } from "react";

import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { supabase } from "../../src/lib/supabase";

export default function HistoryScreen() {
  const [meals, setMeals] = useState<any[]>([]);
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

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        paddingTop: 60,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "800",
          marginBottom: 20,
        }}
      >
        Your Meals
      </Text>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#888" }}>
            No meals yet. Add your first meal 🍽️
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#eee",
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              backgroundColor: "#fafafa",
            }}
          >
            {/* Meal Title */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 10,
              }}
            >
              {item.description}
            </Text>

            {/* Macros */}
            <View style={{ gap: 4 }}>
              <Text>🔥 Calories: {item.calories}</Text>
              <Text>💪 Protein: {item.protein}g</Text>
              <Text>🌾 Carbs: {item.carbs}g</Text>
              <Text>🥑 Fat: {item.fat}g</Text>
            </View>

            {/* AI Insight */}
            <View
              style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#f0f0f0",
              }}
            >
              <Text style={{ color: "#444", lineHeight: 20 }}>
                🧠 {item.health_insight}
              </Text>
            </View>

            {/* STATUS (NEW) */}
            <Text
              style={{
                marginTop: 10,
                fontWeight: "600",
                color:
                  item.status === "approved"
                    ? "green"
                    : item.status === "rejected"
                    ? "red"
                    : "#f59e0b",
              }}
            >
              Status: {item.status || "pending"}
            </Text>

            {/* ADMIN COMMENT (NEW) */}
            {item.admin_comment ? (
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "#444" }}>
                  📝 Admin: {item.admin_comment}
                </Text>
              </View>
            ) : null}

            {/* Timestamp */}
            <Text
              style={{
                marginTop: 8,
                color: "#999",
                fontSize: 12,
              }}
            >
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}