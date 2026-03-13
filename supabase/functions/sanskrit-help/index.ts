import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert Sanskrit grammar tutor (व्याकरणाचार्यः). Your role is to help students learn and correct their Sanskrit grammar.

When a user writes Sanskrit text:
1. Identify any grammatical errors (vibhakti, vacana, liṅga, dhātu forms, sandhi mistakes, etc.)
2. Provide the corrected version in Devanagari
3. Explain WHY it's wrong using proper grammatical terminology (Pāṇini's Aṣṭādhyāyī references when applicable)
4. Give the relevant rule or sūtra

When a user asks a grammar question:
1. Answer clearly with examples in both Devanagari and IAST transliteration
2. Show paradigm tables when relevant (e.g., declension tables, conjugation tables)
3. Use markdown tables for structured data
4. Reference Pāṇini's sūtras when applicable

Formatting rules:
- Use **bold** for key terms and corrections
- Use *italics* for transliteration
- Use Devanagari script for Sanskrit text
- Keep explanations beginner-friendly but technically accurate
- Use markdown tables for paradigms
- Keep responses under 400 words unless showing tables

You are patient, encouraging, and thorough. If someone writes broken Sanskrit, gently correct them. If they ask basic questions, never condescend.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("sanskrit-help error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
