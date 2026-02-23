import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function safeJSON(raw: string) {
  let t = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(t); } catch (_) {}
  const s = t.indexOf("["), e = t.lastIndexOf("]");
  if (s !== -1 && e > s) {
    let c = t.slice(s, e + 1);
    try { return JSON.parse(c); } catch (_) {}
    c = c.replace(/,\s*([\]}])/g, "$1").replace(/[\x00-\x1F\x7F]/g, " ");
    try { return JSON.parse(c); } catch (_) {}
  }
  throw new Error("JSON parse failed");
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("searches_used,searches_limit")
    .eq("id", user.id).single();

  if (profile && profile.searches_used >= profile.searches_limit) {
    return NextResponse.json({ error: "Monthly search limit reached. Upgrade to Pro." }, { status: 429 });
  }

  const { query, niche, platforms, budget, trend } = await req.json();
  const q = query || niche || "winning dropshipping products";

  const prompt = `Expert dropshipping researcher. Find 4 WINNING products.
Criteria: keyword="${q}", platforms="${platforms?.join(", ")}", budget="${budget}", trend="${trend}"
Return ONLY minified JSON array, strings max 90 chars:
[{"name":"str","category":"str","hook":"str","score":85,"viralScore":82,"marginScore":75,"competitionScore":30,"trending":true,"platforms":["facebook","tiktok"],"priceRange":"$25-45","adBudget":"$20/day","audience":"str","sourcing":"AliExpress","roi":"3-5x ROAS","adAngles":["a1","a2","a3"],"videoIdeas":["v1","v2","v3"],"adCopy":"str","risks":"str"}]
Return exactly 4 products. JSON only.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = message.content.map((b: any) => b.type === "text" ? b.text : "").join("");
    const products = safeJSON(raw);

    await Promise.all([
      supabase.from("search_history").insert({ user_id: user.id, type: "scout", query: q, platforms, results: products }),
      supabase.rpc("increment_search_count", { p_user_id: user.id }),
    ]);

    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
