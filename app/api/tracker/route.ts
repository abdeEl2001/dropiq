import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const p = await req.json();
  const { data, error } = await supabase.from("tracked_products").insert({
    user_id: user.id,
    name: p.name, category: p.category, hook: p.hook,
    score: p.score, viral_score: p.viralScore, margin_score: p.marginScore,
    trending: p.trending, platforms: p.platforms, price_range: p.priceRange,
    ad_budget: p.adBudget, audience: p.audience, sourcing: p.sourcing,
    roi: p.roi, ad_angles: p.adAngles, video_ideas: p.videoIdeas,
    ad_copy: p.adCopy, risks: p.risks,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("tracked_products").select("*")
    .eq("user_id", user.id).order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function DELETE(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  const { error } = await supabase.from("tracked_products")
    .delete().eq("id", id!).eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
