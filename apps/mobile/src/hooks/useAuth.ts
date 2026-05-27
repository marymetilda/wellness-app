import { useState } from "react";
import { supabase } from "../lib/supabase";

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

  return { signIn, loading };
}