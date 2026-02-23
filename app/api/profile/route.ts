 import { createClient } from "@/lib/supabase/server";
 import { NextResponse } from "next/server";
 
 type Body = {
   full_name?: string;
   avatar_url?: string;
  plan?: "free" | "pro" | "agency";
  searches_used?: number;
  searches_limit?: number;
 };
 
 export async function PATCH(req: Request) {
   const supabase = createClient();
   const {
     data: { user },
   } = await supabase.auth.getUser();
   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
   const body: Body = await req.json();
   const update: Record<string, any> = {};
   if (typeof body.full_name === "string") update.full_name = body.full_name;
   if (typeof body.avatar_url === "string") update.avatar_url = body.avatar_url;
 
  if (process.env.NODE_ENV !== "production") {
    if (typeof body.plan === "string" && ["free", "pro", "agency"].includes(body.plan)) {
      update.plan = body.plan;
    }
    if (typeof body.searches_used === "number" && body.searches_used >= 0) {
      update.searches_used = body.searches_used;
    }
    if (typeof body.searches_limit === "number" && body.searches_limit >= 0) {
      update.searches_limit = body.searches_limit;
    }
  }

   if (Object.keys(update).length === 0) {
     return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
   }
 
   const { data, error } = await supabase
     .from("profiles")
     .update({ ...update, updated_at: new Date().toISOString() })
     .eq("id", user.id)
     .select()
     .single();
 
   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
   return NextResponse.json({ profile: data });
 }
