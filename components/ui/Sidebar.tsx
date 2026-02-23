"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard",         icon: "⊞",  label: "Dashboard" },
  { href: "/dashboard/scout",   icon: "⚡",  label: "WinScout" },
  { href: "/dashboard/spy",     icon: "🕵️", label: "AdSpy" },
  { href: "/dashboard/copy",    icon: "✍️", label: "CopyGen" },
  { href: "/dashboard/tracker", icon: "📦", label: "Tracker" },
];

export default function Sidebar({ profile }: { profile: any }) {
  const path = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const planColor: Record<string, string> = { free: "#888", pro: "#00FFB2", agency: "#FFB800" };
  const color = planColor[profile?.plan ?? "free"] ?? "#888";

  return (
    <div style={{ width: 200, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>

      <div style={{ padding: "0 20px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 2, lineHeight: 1, color: "#E8EDF5" }}>
          DROP<span style={{ color: "#00FFB2" }}>IQ</span>
        </div>
        <div style={{ fontSize: 9, color: "rgba(232,237,245,0.3)", letterSpacing: 2, marginTop: 2 }}>INTELLIGENCE SUITE</div>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
        {NAV.map(n => {
          const active = path === n.href || (n.href !== "/dashboard" && path.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href} style={{
              background: active ? "rgba(0,255,178,0.1)" : "transparent",
              border: `1px solid ${active ? "rgba(0,255,178,0.3)" : "transparent"}`,
              color: active ? "#00FFB2" : "rgba(232,237,245,0.4)",
              borderRadius: 10, padding: "10px 12px", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 1,
              transition: "all .15s",
            }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>{n.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "16px 16px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 11, color: "rgba(232,237,245,0.5)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {profile?.email}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ background: `${color}20`, color, borderRadius: 5, padding: "2px 8px", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase" }}>
            {profile?.plan ?? "free"}
          </span>
          <span style={{ fontSize: 10, color: "rgba(232,237,245,0.3)", fontFamily: "monospace" }}>
            {profile?.searches_used ?? 0}/{profile?.searches_limit ?? 10}
          </span>
        </div>
        <button onClick={logout} style={{ width: "100%", background: "rgba(255,60,0,0.08)", border: "1px solid rgba(255,60,0,0.2)", color: "rgba(255,96,48,0.8)", borderRadius: 8, padding: "7px 0", cursor: "pointer", fontSize: 12 }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
