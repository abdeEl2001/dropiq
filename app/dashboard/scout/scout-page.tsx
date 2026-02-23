"use client";
import { useState } from "react";

const PLATFORMS = [
  { id: "facebook",  label: "Facebook",  icon: "📘", color: "#1877F2" },
  { id: "tiktok",    label: "TikTok",    icon: "🎵", color: "#FF0050" },
  { id: "instagram", label: "Instagram", icon: "📸", color: "#E1306C" },
  { id: "google",    label: "Google",    icon: "🔍", color: "#4285F4" },
];
const NICHES   = ["Beauty","Fitness","Pet","Kitchen","Tech","Fashion","Baby","Home Decor","Outdoor","Auto"];
const BUDGETS  = ["$5–$20","$20–$50","$50–$100","$100+"];
const TRENDS   = ["🔥 HOT","📈 RISING","💎 EVERGREEN","🚀 EMERGING"];
const COLORS   = ["#00FFB2","#FF6B35","#A855F7","#3E9EFF"];

function Bar({ val, color }: { val: number; color: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 3, height: 5, overflow: "hidden" }}>
      <div style={{ width: `${val}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s ease" }} />
    </div>
  );
}

function ProductCard({ p, index, onSave, saved }: any) {
  const [open, setOpen] = useState(false);
  const c = COLORS[index % COLORS.length];
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 14, padding: 20, borderLeft: `3px solid ${c}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ background: `${c}20`, color: c, borderRadius: 5, padding: "2px 9px", fontSize: 11 }}>#{index + 1} {p.category}</span>
            {p.trending && <span style={{ background: "rgba(255,62,108,.15)", color: "#FF3E6C", borderRadius: 5, padding: "2px 9px", fontSize: 11 }}>🔥 TRENDING</span>}
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#E8EDF5", letterSpacing: .5, marginBottom: 4 }}>{p.name}</div>
          <div style={{ fontSize: 12, color: "rgba(232,237,245,0.5)", lineHeight: 1.5 }}>{p.hook}</div>
        </div>
        <div style={{ textAlign: "right", marginLeft: 16, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: c, lineHeight: 1 }}>{p.score}</div>
          <div style={{ fontSize: 9, color: "rgba(232,237,245,0.3)", letterSpacing: 1 }}>WIN SCORE</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "14px 0" }}>
        {[{ l: "Viral", v: p.viralScore, c: "#00FFB2" }, { l: "Margin", v: p.marginScore, c: "#FFB800" }, { l: "Low Competition", v: 100 - p.competitionScore, c: "#A855F7" }].map(m => (
          <div key={m.l} style={{ background: "rgba(0,0,0,.25)", borderRadius: 9, padding: 10 }}>
            <div style={{ fontSize: 9, color: "rgba(232,237,245,0.3)", letterSpacing: 1, marginBottom: 5 }}>{m.l.toUpperCase()}</div>
            <Bar val={m.v} color={m.c} />
            <div style={{ textAlign: "right", fontSize: 11, color: m.c, fontFamily: "monospace", marginTop: 3 }}>{m.v}%</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(p.platforms || []).map((pl: string) => {
            const d = PLATFORMS.find(x => x.id === pl);
            return d ? <span key={pl} style={{ background: `${d.color}15`, color: d.color, borderRadius: 5, padding: "2px 9px", fontSize: 11 }}>{d.icon} {d.label}</span> : null;
          })}
          <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(232,237,245,0.5)", borderRadius: 5, padding: "2px 9px", fontSize: 11 }}>{p.priceRange} · {p.adBudget}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setOpen(!open)} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(232,237,245,0.5)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 11 }}>
            {open ? "▲ Less" : "▼ Details"}
          </button>
          <button onClick={() => onSave(p)} disabled={saved} style={{ background: saved ? `${c}20` : `${c}20`, border: `1px solid ${c}`, color: c, borderRadius: 8, padding: "6px 14px", cursor: saved ? "default" : "pointer", fontSize: 11, fontFamily: "monospace" }}>
            {saved ? "✓ SAVED" : "+ SAVE"}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div style={{ fontSize: 9, color: c, letterSpacing: 2, marginBottom: 8 }}>🎯 AD ANGLES</div>
            {(p.adAngles || []).map((a: string, j: number) => (
              <div key={j} style={{ fontSize: 12, color: "rgba(232,237,245,0.5)", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,.04)", display: "flex", gap: 6 }}>
                <span style={{ color: c }}>▸</span>{a}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#FFB800", letterSpacing: 2, marginBottom: 8 }}>🎬 VIDEO IDEAS</div>
            {(p.videoIdeas || []).map((v: string, j: number) => (
              <div key={j} style={{ fontSize: 12, color: "rgba(232,237,245,0.5)", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,.04)", display: "flex", gap: 6 }}>
                <span style={{ color: "#FFB800" }}>▸</span>{v}
              </div>
            ))}
          </div>
          <div style={{ gridColumn: "1/-1", background: "rgba(0,0,0,.3)", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: "#3E9EFF", letterSpacing: 2, marginBottom: 6 }}>📝 AD COPY</div>
            <div style={{ fontSize: 12, color: "rgba(232,237,245,0.5)", fontStyle: "italic", lineHeight: 1.7, fontFamily: "monospace" }}>"{p.adCopy}"</div>
          </div>
          <div style={{ background: "rgba(0,0,0,.3)", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: "rgba(232,237,245,0.3)", letterSpacing: 2, marginBottom: 4 }}>TARGET · SOURCE · ROI</div>
            <div style={{ fontSize: 12, color: "rgba(232,237,245,0.5)" }}>{p.audience} · {p.sourcing}</div>
            <div style={{ fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", color: "#A855F7", marginTop: 4 }}>{p.roi}</div>
          </div>
          <div style={{ background: "rgba(255,60,0,.06)", border: "1px solid rgba(255,60,0,.15)", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: "#FF5000", letterSpacing: 2, marginBottom: 4 }}>⚠️ RISKS</div>
            <div style={{ fontSize: 12, color: "rgba(232,237,245,0.5)", lineHeight: 1.5 }}>{p.risks}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScoutPage() {
  const [query, setQuery]       = useState("");
  const [niche, setNiche]       = useState("");
  const [platforms, setPlatforms] = useState(["facebook", "tiktok"]);
  const [budget, setBudget]     = useState("$20–$50");
  const [trend, setTrend]       = useState("🔥 HOT");
  const [loading, setLoading]   = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [saved, setSaved]       = useState<Record<number, boolean>>({});
  const [err, setErr]           = useState("");

  const toggle = (id: string) =>
    setPlatforms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const search = async () => {
    if (!query && !niche) { setErr("Enter a keyword or select a niche."); return; }
    setErr(""); setLoading(true); setProducts([]);
    try {
      const res = await fetch("/api/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, niche, platforms, budget, trend }),
      });
      const data = await res.json();
      if (data.error) setErr(data.error);
      else setProducts(data.products || []);
    } catch (e: any) { setErr(e.message); }
    setLoading(false);
  };

  const saveProduct = async (p: any, i: number) => {
    setSaved(s => ({ ...s, [i]: true }));
    await fetch("/api/tracker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
  };

  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", color: "#E8EDF5", borderRadius: 10, padding: "11px 14px", fontSize: 13, outline: "none" };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, margin: "0 0 4px", letterSpacing: 1, color: "#E8EDF5" }}>
        ⚡ WIN<span style={{ color: "#00FFB2" }}>SCOUT</span>
      </h2>
      <p style={{ margin: "0 0 24px", color: "rgba(232,237,245,0.4)", fontSize: 13 }}>AI-powered winning product discovery</p>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(232,237,245,0.4)", letterSpacing: 2, marginBottom: 6 }}>KEYWORD</div>
            <input style={inp} value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()} placeholder="e.g. posture corrector, led lamp..." />
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(232,237,245,0.4)", letterSpacing: 2, marginBottom: 6 }}>NICHE</div>
            <select style={{ ...inp, cursor: "pointer" }} value={niche} onChange={e => setNiche(e.target.value)}>
              <option value="">All niches</option>
              {NICHES.map(n => <option key={n} value={n} style={{ background: "#1a1f2e" }}>{n}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "rgba(232,237,245,0.4)", letterSpacing: 2, marginBottom: 8 }}>PLATFORMS</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => toggle(p.id)} style={{ background: platforms.includes(p.id) ? `${p.color}20` : "rgba(255,255,255,0.04)", border: `1.5px solid ${platforms.includes(p.id) ? p.color : "rgba(255,255,255,0.1)"}`, color: platforms.includes(p.id) ? p.color : "rgba(232,237,245,0.4)", borderRadius: 9, padding: "8px 14px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(232,237,245,0.4)", letterSpacing: 2, marginBottom: 8 }}>DAILY BUDGET</div>
            <div style={{ display: "flex", gap: 6 }}>
              {BUDGETS.map(b => (
                <button key={b} onClick={() => setBudget(b)} style={{ flex: 1, background: budget === b ? "rgba(0,255,178,.15)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${budget === b ? "#00FFB2" : "rgba(255,255,255,0.1)"}`, color: budget === b ? "#00FFB2" : "rgba(232,237,245,0.4)", borderRadius: 8, padding: "8px 4px", cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}>{b}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(232,237,245,0.4)", letterSpacing: 2, marginBottom: 8 }}>TREND</div>
            <div style={{ display: "flex", gap: 6 }}>
              {TRENDS.map(t => (
                <button key={t} onClick={() => setTrend(t)} style={{ flex: 1, background: trend === t ? "rgba(255,184,0,.15)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${trend === t ? "#FFB800" : "rgba(255,255,255,0.1)"}`, color: trend === t ? "#FFB800" : "rgba(232,237,245,0.4)", borderRadius: 8, padding: "8px 4px", cursor: "pointer", fontSize: 10 }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={search} disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "rgba(0,255,178,.08)" : "linear-gradient(135deg,#00FFB2,#00C8FF)", color: loading ? "#00FFB2" : "#000", border: loading ? "1.5px solid #00FFB2" : "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, letterSpacing: 2 }}>
          {loading ? "⏳ SCANNING MARKETS..." : "⚡ FIND WINNING PRODUCTS"}
        </button>
        {err && <div style={{ marginTop: 10, background: "rgba(255,60,0,.1)", border: "1px solid rgba(255,60,0,.25)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#FF6030" }}>{err}</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {products.map((p, i) => (
          <ProductCard key={i} p={p} index={i} onSave={(prod: any) => saveProduct(prod, i)} saved={!!saved[i]} />
        ))}
      </div>

      {!loading && products.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px 40px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 16 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⚡</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: 1, marginBottom: 8 }}>Ready to Scout</div>
          <div style={{ color: "rgba(232,237,245,0.3)", fontSize: 13 }}>Configure your filters and hit Find Winning Products</div>
        </div>
      )}
    </div>
  );
}
