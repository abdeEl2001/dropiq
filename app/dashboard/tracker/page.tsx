"use client";
import { useState, useEffect } from "react";

const STATUS_COLORS: Record<string,string> = {
  watching: "#3E9EFF", testing: "#FFB800", winner: "#00FFB2", paused: "#888"
};

function Bar({ val, color }: { val: number; color: string }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:3, height:4, overflow:"hidden" }}>
      <div style={{ width:`${val}%`, height:"100%", background:color, borderRadius:3 }} />
    </div>
  );
}

export default function TrackerPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");

  useEffect(() => {
    fetch("/api/tracker")
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    await fetch(`/api/tracker?id=${id}`, { method: "DELETE" });
    setProducts(p => p.filter(x => x.id !== id));
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/tracker", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setProducts(p => p.map(x => x.id === id ? { ...x, status } : x));
  };

  const COLORS = ["#00FFB2","#FF6B35","#A855F7","#3E9EFF"];
  const categories = ["all","winner","testing","watching","paused"];
  const filtered = products.filter(p =>
    filter === "all" || p.status === filter
  );

  if (loading) return (
    <div style={{ textAlign:"center", padding:60, color:"rgba(232,237,245,0.4)", fontFamily:"sans-serif" }}>
      Loading products...
    </div>
  );

  return (
    <div style={{ fontFamily:"sans-serif" }}>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, margin:"0 0 4px", letterSpacing:1, color:"#E8EDF5" }}>
        📦 PRODUCT<span style={{ color:"#FF3E6C" }}> TRACKER</span>
      </h2>
      <p style={{ margin:"0 0 24px", color:"rgba(232,237,245,0.4)", fontSize:13 }}>
        {products.length} products saved · Use WinScout to add more
      </p>

      {products.length > 0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ background:filter===c?"rgba(255,62,108,.15)":"rgba(255,255,255,.04)", border:`1.5px solid ${filter===c?"#FF3E6C":"rgba(255,255,255,.1)"}`, color:filter===c?"#FF3E6C":"rgba(232,237,245,0.4)", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:11, textTransform:"capitalize" }}>
              {c === "all" ? `All (${products.length})` : `${c} (${products.filter(p=>p.status===c).length})`}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 40px", background:"rgba(255,255,255,0.02)", border:"1px dashed rgba(255,255,255,0.07)", borderRadius:16 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>📦</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:1, marginBottom:8 }}>
            {products.length === 0 ? "No Products Yet" : "No Products in This Filter"}
          </div>
          <div style={{ color:"rgba(232,237,245,0.3)", fontSize:13, maxWidth:380, margin:"0 auto" }}>
            {products.length === 0 ? "Use WinScout to find winning products and save them here." : "Try a different filter above."}
          </div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
          {filtered.map((p, i) => {
            const c = COLORS[i % COLORS.length];
            const sc = STATUS_COLORS[p.status] || "#888";
            return (
              <div key={p.id} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:18, borderLeft:`3px solid ${c}`, position:"relative" }}>
                <button onClick={() => remove(p.id)} style={{ position:"absolute", top:12, right:12, background:"rgba(255,60,0,.1)", border:"1px solid rgba(255,60,0,.2)", color:"#FF5000", borderRadius:6, padding:"2px 8px", cursor:"pointer", fontSize:11 }}>✕</button>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                  <span style={{ background:`${c}18`, color:c, borderRadius:5, padding:"2px 9px", fontSize:11 }}>{p.category}</span>
                  {p.trending && <span style={{ background:"rgba(255,62,108,.15)", color:"#FF3E6C", borderRadius:5, padding:"2px 9px", fontSize:11 }}>🔥</span>}
                </div>

                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:"#E8EDF5", letterSpacing:.5, marginBottom:4, paddingRight:40 }}>{p.name}</div>
                <div style={{ fontSize:12, color:"rgba(232,237,245,0.4)", marginBottom:12, lineHeight:1.4 }}>{p.hook}</div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
                  {[{ l:"Win",    v:p.score||0,        c },
                    { l:"Viral",  v:p.viral_score||0,  c:"#00FFB2" },
                    { l:"Margin", v:p.margin_score||0, c:"#FFB800" }].map(m => (
                    <div key={m.l} style={{ background:"rgba(0,0,0,.3)", borderRadius:8, padding:8 }}>
                      <div style={{ fontSize:9, color:"rgba(232,237,245,0.3)", letterSpacing:1, marginBottom:4 }}>{m.l.toUpperCase()}</div>
                      <Bar val={m.v} color={m.c} />
                      <div style={{ textAlign:"right", fontSize:10, color:m.c, fontFamily:"monospace", marginTop:2 }}>{m.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{ background:"rgba(255,255,255,.06)", color:"rgba(232,237,245,.5)", borderRadius:5, padding:"2px 9px", fontSize:11 }}>{p.price_range}</span>
                    <span style={{ background:`${c}12`, color:c, borderRadius:5, padding:"2px 9px", fontSize:11 }}>{p.roi}</span>
                  </div>
                  <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)}
                    style={{ background:`${sc}15`, border:`1px solid ${sc}40`, color:sc, borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", outline:"none", textTransform:"capitalize" }}>
                    <option value="watching" style={{ background:"#1a1f2e" }}>👁 Watching</option>
                    <option value="testing"  style={{ background:"#1a1f2e" }}>🧪 Testing</option>
                    <option value="winner"   style={{ background:"#1a1f2e" }}>🏆 Winner</option>
                    <option value="paused"   style={{ background:"#1a1f2e" }}>⏸ Paused</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
