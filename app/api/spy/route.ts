import Anthropic from "@anthropic-ai/sdk";
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
  const { query, country } = await req.json();
  if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });
  const prompt = `Expert e-commerce ad spy for "${query}" in ${country}. Return ONLY minified JSON, strings max 70 chars: {"tiktokTrends":[{"keyword":"str","volume":"High","trend":"Rising","topAngle":"str","hooks":["str","str","str"],"bestFormat":"UGC","estimatedCPM":"$3-8","audienceAge":"25-34","viralScore":80},{"keyword":"str","volume":"Medium","trend":"Peak","topAngle":"str","hooks":["str","str","str"],"bestFormat":"Demo","estimatedCPM":"$4-10","audienceAge":"18-24","viralScore":70}],"crossPlatformInsights":{"winningAngle":"str","fbVsTiktok":"str","recommendedBudgetSplit":"55% TikTok / 45% FB","bestProduct":"str","estimatedROAS":"3-5x","urgencyScore":78,"urgencyReason":"str"},"competitorAdAnalysis":[{"pageName":"str","strategy":"str","weakness":"str","estimatedSpend":"$30-80/day"}],"topKeywordsToTarget":["kw1","kw2","kw3","kw4","kw5"]} JSON only.`;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = message.content.map((b: any) => b.type === "text" ? b.text : "").join("");
    const data = safeJSON(raw);
    if (!data) return NextResponse.json({ error: "Could not parse response." }, { status: 500 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
