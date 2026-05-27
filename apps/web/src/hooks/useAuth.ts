import { useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

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

      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string): Promise<string | null> {
    setSigningUp(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      return null;
    } catch (error) {
      return (error as Error).message;
    } finally {
      setSigningUp(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return { signIn, signUp, signOut, loading, signingUp };
}