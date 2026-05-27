import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1️⃣ Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error || !data?.user) {
      console.log("AUTH ERROR:", error);

      return new Response(
        JSON.stringify({ error: error?.message || "User creation failed" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const user = data.user;

    // 2️⃣ Create profile row
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        role: "user",
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.log("PROFILE ERROR:", profileError);

      // ⚠️ Optional rollback (recommended in real apps)
      await supabase.auth.admin.deleteUser(user.id);

      return new Response(
        JSON.stringify({
          error: "User created but profile insert failed",
          details: profileError.message,
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // 3️⃣ Success response
    return new Response(
      JSON.stringify({
        message: "User created successfully",
        user,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log("FATAL ERROR:", err);

    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: corsHeaders }
    );
  }
});