import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function safeJSON(raw: string) {
  let t = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(t); } catch (_) {}
  const s = t.indexOf("{"), e = t.lastIndexOf("}");
  if (s !== -1 && e > s) {
    let c = t.slice(s, e + 1);
    try { return JSON.parse(c); } catch (_) {}
    c = c.replace(/,\s*([\]}])/g, "$1").replace(/[\x00-\x1F\x7F]/g, " ");
    try { return JSON.parse(c); } catch (_) {}
  }
  return null;
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product, platform, angle, audience } = await req.json();
  if (!product) return NextResponse.json({ error: "Product name is required" }, { status: 400 });

  const prompt = `Viral ad copywriter for dropshipping. Write for:
Product: "${product}", Platform: ${platform}, Angle: ${angle}, Audience: ${audience || "general consumers"}
Return ONLY minified JSON, strings max 120 chars:
{"hook":"str","headline":"str","body":"str","cta":"str","caption":"str with emojis","hashtags":["t1","t2","t3","t4","t5"],"script":"15-sec video script","variation2":{"hook":"alt hook","body":"alt body"},"tips":"2 sentences on how to use this copy"}
JSON only.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content.map((b: any) => b.type === "text" ? b.text : "").join("");
    const data = safeJSON(raw);

    if (!data) return NextResponse.json({ error: "Could not parse response. Try again." }, { status: 500 });

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
