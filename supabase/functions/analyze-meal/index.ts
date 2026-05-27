import "@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const { meal } = await req.json();

    if (!meal) {
      return new Response(JSON.stringify({ error: "Meal is required" }), {
        status: 400,
      });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("GROQ_API_KEY")}`,
      },
      body: JSON.stringify({
       model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a nutrition expert. Return ONLY valid JSON.",
          },
          {
            role: "user",
            content: `
Analyze this meal: "${meal}"

Return JSON:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "healthInsight": string
}
      `,
          },
        ],
        temperature: 0.2,
      }),
    });

    const data = await res.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({
          error: "No response from Groq",
          raw: data,
        }),
        { status: 500 },
      );
    }

    const result = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
