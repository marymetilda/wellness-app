import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useAnalyzeMeal } from "../../src/hooks/useAnalyzeMeal";

export default function HomeScreen() {
  const [meal, setMeal] = useState("");
  const { analyzeMeal, loading } = useAnalyzeMeal();

  async function saveMeal() {
    if (!meal.trim()) {
      Alert.alert("Please enter a meal");
      return;
    }

    try {
      await analyzeMeal(meal);
      Alert.alert("Meal analyzed successfully 🎉");
      setMeal("");
    } catch (error: any) {
      Alert.alert(error.message || "Something went wrong");
    }
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
          fontWeight: "700",
          marginBottom: 20,
        }}
      >
        Wellness Tracker
      </Text>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 10,
        }}
      >
        Add Your Meal
      </Text>

      <TextInput
        placeholder="Example: Grilled chicken with rice and salad"
        value={meal}
        onChangeText={setMeal}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 12,
          padding: 16,
          minHeight: 140,
          textAlignVertical: "top",
          fontSize: 16,
        }}
      />

      <TouchableOpacity
        onPress={saveMeal}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#555" : "black",
          padding: 18,
          borderRadius: 12,
          alignItems: "center",
          marginTop: 20,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ActivityIndicator color="white" />
            <Text style={{ color: "white", fontWeight: "600" }}>
              Analyzing...
            </Text>
          </View>
        ) : (
          <Text style={{ color: "white", fontWeight: "600" }}>
            Analyze Meal
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
