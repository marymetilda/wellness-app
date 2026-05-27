import { useState } from "react";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";

export function useAuth() {
  const [loading, setLoading] = useState(false);

  async function signIn(email: string, password: string): Promise<void> {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  return { signIn, signOut, loading };
}