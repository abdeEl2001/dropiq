export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: products }, { data: profile }] = await Promise.all([
    supabase.from("tracked_products").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
  ]);

  const stats = [
    { label: "Saved Products",  val: products?.length ?? 0,                                                                     icon: "📦", color: "#00FFB2" },
    { label: "Hot Products",    val: products?.filter((p: any) => p.trending).length ?? 0,                                      icon: "🔥", color: "#FF3E6C" },
    { label: "Avg Win Score",   val: products?.length ? Math.round(products.reduce((a: number, p: any) => a + (p.score || 0), 0) / products.length) : 0, icon: "⚡", color: "#FFB800" },
    { label: "Searches Used",   val: `${profile?.searches_used ?? 0}/${profile?.searches_limit ?? 10}`,                         icon: "🔍", color: "#3E9EFF" },
  ];

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 2, margin: "0 0 6px", color: "#E8EDF5" }}>
        DROP<span style={{ color: "#00FFB2" }}>IQ</span> DASHBOARD
      </h1>
      <p style={{ color: "rgba(232,237,245,0.4)", fontSize: 14, marginBottom: 28 }}>
        Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: s.color, letterSpacing: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "rgba(232,237,245,0.4)", letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 11, color: "#00FFB2", letterSpacing: 2, marginBottom: 16 }}>📦 RECENT PRODUCTS</div>
        {!products?.length ? (
          <div style={{ textAlign: "center", padding: "32px 20px", color: "rgba(232,237,245,0.3)", fontSize: 13 }}>
            No products yet — use WinScout to find and save winners
          </div>
        ) : products.slice(0, 5).map((p: any, i: number) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
              <span style={{ marginLeft: 10, fontSize: 11, color: "rgba(232,237,245,0.4)" }}>{p.category}</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {p.trending && <span style={{ background: "rgba(255,62,108,.15)", color: "#FF3E6C", borderRadius: 5, padding: "2px 9px", fontSize: 11 }}>🔥 HOT</span>}
              <span style={{ background: "rgba(0,255,178,.12)", color: "#00FFB2", borderRadius: 5, padding: "2px 9px", fontSize: 11, fontFamily: "monospace" }}>{p.score}/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

