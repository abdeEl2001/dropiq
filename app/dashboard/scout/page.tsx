&quot;use client&quot;;
import { useState } from &quot;react&quot;;

const PLATFORMS = [
  { id: &quot;facebook&quot;,  label: &quot;Facebook&quot;,  icon: &quot;📘&quot;, color: &quot;#1877F2&quot; },
  { id: &quot;tiktok&quot;,    label: &quot;TikTok&quot;,    icon: &quot;🎵&quot;, color: &quot;#FF0050&quot; },
  { id: &quot;instagram&quot;, label: &quot;Instagram&quot;, icon: &quot;📸&quot;, color: &quot;#E1306C&quot; },
  { id: &quot;google&quot;,    label: &quot;Google&quot;,    icon: &quot;🔍&quot;, color: &quot;#4285F4&quot; },
];
const NICHES   = [&quot;Beauty&quot;,&quot;Fitness&quot;,&quot;Pet&quot;,&quot;Kitchen&quot;,&quot;Tech&quot;,&quot;Fashion&quot;,&quot;Baby&quot;,&quot;Home Decor&quot;,&quot;Outdoor&quot;,&quot;Auto&quot;];
const BUDGETS  = [&quot;$5–$20&quot;,&quot;$20–$50&quot;,&quot;$50–$100&quot;,&quot;$100+&quot;];
const TRENDS   = [&quot;🔥 HOT&quot;,&quot;📈 RISING&quot;,&quot;💎 EVERGREEN&quot;,&quot;🚀 EMERGING&quot;];
const COLORS   = [&quot;#00FFB2&quot;,&quot;#FF6B35&quot;,&quot;#A855F7&quot;,&quot;#3E9EFF&quot;];

function Bar({ val, color }: { val: number; color: string }) {
  return (
    <div style={{ background: &quot;rgba(255,255,255,0.07)&quot;, borderRadius: 3, height: 5, overflow: &quot;hidden&quot; }}>
      <div style={{ width: `${val}%`, height: &quot;100%&quot;, background: color, borderRadius: 3, transition: &quot;width 1s ease&quot; }} />
    </div>
  );
}

function ProductCard({ p, index, onSave, saved }: any) {
  const [open, setOpen] = useState(false);
  const c = COLORS[index % COLORS.length];
  return (
    <div style={{ background: &quot;rgba(255,255,255,0.03)&quot;, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 14, padding: 20, borderLeft: `3px solid ${c}` }}>
      <div style={{ display: &quot;flex&quot;, justifyContent: &quot;space-between&quot;, alignItems: &quot;flex-start&quot; }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: &quot;flex&quot;, gap: 6, marginBottom: 8, flexWrap: &quot;wrap&quot; }}>
            <span style={{ background: `${c}20`, color: c, borderRadius: 5, padding: &quot;2px 9px&quot;, fontSize: 11 }}>#{index + 1} {p.category}</span>
            {p.trending && <span style={{ background: &quot;rgba(255,62,108,.15)&quot;, color: &quot;#FF3E6C&quot;, borderRadius: 5, padding: &quot;2px 9px&quot;, fontSize: 11 }}>🔥 TRENDING</span>}
          </div>
          <div style={{ fontFamily: &quot;'Bebas Neue', sans-serif&quot;, fontSize: 22, color: &quot;#E8EDF5&quot;, letterSpacing: .5, marginBottom: 4 }}>{p.name}</div>
          <div style={{ fontSize: 12, color: &quot;rgba(232,237,245,0.5)&quot;, lineHeight: 1.5 }}>{p.hook}</div>
        </div>
        <div style={{ textAlign: &quot;right&quot;, marginLeft: 16, flexShrink: 0 }}>
          <div style={{ fontFamily: &quot;'Bebas Neue', sans-serif&quot;, fontSize: 36, color: c, lineHeight: 1 }}>{p.score}</div>
          <div style={{ fontSize: 9, color: &quot;rgba(232,237,245,0.3)&quot;, letterSpacing: 1 }}>WIN SCORE</div>
        </div>
      </div>

      <div style={{ display: &quot;grid&quot;, gridTemplateColumns: &quot;repeat(3,1fr)&quot;, gap: 10, margin: &quot;14px 0&quot; }}>
        {[{ l: &quot;Viral&quot;, v: p.viralScore, c: &quot;#00FFB2&quot; }, { l: &quot;Margin&quot;, v: p.marginScore, c: &quot;#FFB800&quot; }, { l: &quot;Low Competition&quot;, v: 100 - p.competitionScore, c: &quot;#A855F7&quot; }].map(m => (
          <div key={m.l} style={{ background: &quot;rgba(0,0,0,.25)&quot;, borderRadius: 9, padding: 10 }}>
            <div style={{ fontSize: 9, color: &quot;rgba(232,237,245,0.3)&quot;, letterSpacing: 1, marginBottom: 5 }}>{m.l.toUpperCase()}</div>
            <Bar val={m.v} color={m.c} />
            <div style={{ textAlign: &quot;right&quot;, fontSize: 11, color: m.c, fontFamily: &quot;monospace&quot;, marginTop: 3 }}>{m.v}%</div>
          </div>
        ))}
      </div>

      <div style={{ display: &quot;flex&quot;, justifyContent: &quot;space-between&quot;, alignItems: &quot;center&quot;, flexWrap: &quot;wrap&quot;, gap: 8 }}>
        <div style={{ display: &quot;flex&quot;, gap: 6, flexWrap: &quot;wrap&quot; }}>
          {(p.platforms || []).map((pl: string) => {
            const d = PLATFORMS.find(x => x.id === pl);
            return d ? <span key={pl} style={{ background: `${d.color}15`, color: d.color, borderRadius: 5, padding: &quot;2px 9px&quot;, fontSize: 11 }}>{d.icon} {d.label}</span> : null;
          })}
          <span style={{ background: &quot;rgba(255,255,255,0.06)&quot;, color: &quot;rgba(232,237,245,0.5)&quot;, borderRadius: 5, padding: &quot;2px 9px&quot;, fontSize: 11 }}>{p.priceRange} · {p.adBudget}</span>
        </div>
        <div style={{ display: &quot;flex&quot;, gap: 8 }}>
          <button onClick={() => setOpen(!open)} style={{ background: &quot;rgba(255,255,255,.05)&quot;, border: &quot;1px solid rgba(255,255,255,.1)&quot;, color: &quot;rgba(232,237,245,0.5)&quot;, borderRadius: 8, padding: &quot;6px 12px&quot;, cursor: &quot;pointer&quot;, fontSize: 11 }}>
            {open ? &quot;▲ Less&quot; : &quot;▼ Details&quot;}
          </button>
          <button onClick={() => onSave(p)} disabled={saved} style={{ background: saved ? `${c}20` : `${c}20`, border: `1px solid ${c}`, color: c, borderRadius: 8, padding: &quot;6px 14px&quot;, cursor: saved ? &quot;default&quot; : &quot;pointer&quot;, fontSize: 11, fontFamily: &quot;monospace&quot; }}>
            {saved ? &quot;✓ SAVED&quot; : &quot;+ SAVE&quot;}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 16, borderTop: &quot;1px solid rgba(255,255,255,0.06)&quot;, paddingTop: 16, display: &quot;grid&quot;, gridTemplateColumns: &quot;1fr 1fr&quot;, gap: 14 }}>
          <div>
            <div style={{ fontSize: 9, color: c, letterSpacing: 2, marginBottom: 8 }}>🎯 AD ANGLES</div>
            {(p.adAngles || []).map((a: string, j: number) => (
              <div key={j} style={{ fontSize: 12, color: &quot;rgba(232,237,245,0.5)&quot;, padding: &quot;5px 0&quot;, borderBottom: &quot;1px solid rgba(255,255,255,.04)&quot;, display: &quot;flex&quot;, gap: 6 }}>
                <span style={{ color: c }}>▸</span>{a}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 9, color: &quot;#FFB800&quot;, letterSpacing: 2, marginBottom: 8 }}>🎬 VIDEO IDEAS</div>
            {(p.videoIdeas || []).map((v: string, j: number) => (
              <div key={j} style={{ fontSize: 12, color: &quot;rgba(232,237,245,0.5)&quot;, padding: &quot;5px 0&quot;, borderBottom: &quot;1px solid rgba(255,255,255,.04)&quot;, display: &quot;flex&quot;, gap: 6 }}>
                <span style={{ color: &quot;#FFB800&quot; }}>▸</span>{v}
              </div>
            ))}
          </div>
          <div style={{ gridColumn: &quot;1/-1&quot;, background: &quot;rgba(0,0,0,.3)&quot;, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: &quot;#3E9EFF&quot;, letterSpacing: 2, marginBottom: 6 }}>📝 AD COPY</div>
            <div style={{ fontSize: 12, color: &quot;rgba(232,237,245,0.5)&quot;, fontStyle: &quot;italic&quot;, lineHeight: 1.7, fontFamily: &quot;monospace&quot; }}>&quot;{p.adCopy}&quot;</div>
          </div>
          <div style={{ background: &quot;rgba(0,0,0,.3)&quot;, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: &quot;rgba(232,237,245,0.3)&quot;, letterSpacing: 2, marginBottom: 4 }}>TARGET · SOURCE · ROI</div>
            <div style={{ fontSize: 12, color: &quot;rgba(232,237,245,0.5)&quot; }}>{p.audience} · {p.sourcing}</div>
            <div style={{ fontSize: 16, fontFamily: &quot;'Bebas Neue',sans-serif&quot;, color: &quot;#A855F7&quot;, marginTop: 4 }}>{p.roi}</div>
          </div>
          <div style={{ background: &quot;rgba(255,60,0,.06)&quot;, border: &quot;1px solid rgba(255,60,0,.15)&quot;, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: &quot;#FF5000&quot;, letterSpacing: 2, marginBottom: 4 }}>⚠️ RISKS</div>
            <div style={{ fontSize: 12, color: &quot;rgba(232,237,245,0.5)&quot;, lineHeight: 1.5 }}>{p.risks}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScoutPage() {
  const [query, setQuery]       = useState(&quot;&quot;);
  const [niche, setNiche]       = useState(&quot;&quot;);
  const [platforms, setPlatforms] = useState([&quot;facebook&quot;, &quot;tiktok&quot;]);
  const [budget, setBudget]     = useState(&quot;$20–$50&quot;);
  const [trend, setTrend]       = useState(&quot;🔥 HOT&quot;);
  const [loading, setLoading]   = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [saved, setSaved]       = useState<Record<number, boolean>>({});
  const [err, setErr]           = useState(&quot;&quot;);

  const toggle = (id: string) =>
    setPlatforms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const search = async () => {
    if (!query && !niche) { setErr(&quot;Enter a keyword or select a niche.&quot;); return; }
    setErr(&quot;&quot;); setLoading(true); setProducts([]);
    try {
      const res = await fetch(&quot;/api/scout&quot;, {
        method: &quot;POST&quot;,
        headers: { &quot;Content-Type&quot;: &quot;application/json&quot; },
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
    await fetch(&quot;/api/tracker&quot;, {
      method: &quot;POST&quot;,
      headers: { &quot;Content-Type&quot;: &quot;application/json&quot; },
      body: JSON.stringify(p),
    });
  };

  const inp: React.CSSProperties = { width: &quot;100%&quot;, background: &quot;rgba(255,255,255,0.05)&quot;, border: &quot;1.5px solid rgba(255,255,255,0.1)&quot;, color: &quot;#E8EDF5&quot;, borderRadius: 10, padding: &quot;11px 14px&quot;, fontSize: 13, outline: &quot;none&quot; };

  return (
    <div style={{ fontFamily: &quot;sans-serif&quot; }}>
      <h2 style={{ fontFamily: &quot;'Bebas Neue',sans-serif&quot;, fontSize: 32, margin: &quot;0 0 4px&quot;, letterSpacing: 1, color: &quot;#E8EDF5&quot; }}>
        ⚡ WIN<span style={{ color: &quot;#00FFB2&quot; }}>SCOUT</span>
      </h2>
      <p style={{ margin: &quot;0 0 24px&quot;, color: &quot;rgba(232,237,245,0.4)&quot;, fontSize: 13 }}>AI-powered winning product discovery</p>

      <div style={{ background: &quot;rgba(255,255,255,0.02)&quot;, border: &quot;1px solid rgba(255,255,255,0.07)&quot;, borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: &quot;grid&quot;, gridTemplateColumns: &quot;1fr 1fr&quot;, gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: &quot;rgba(232,237,245,0.4)&quot;, letterSpacing: 2, marginBottom: 6 }}>KEYWORD</div>
            <input style={inp} value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === &quot;Enter&quot; && search()} placeholder=&quot;e.g. posture corrector, led lamp...&quot; />
          </div>
          <div>
            <div style={{ fontSize: 10, color: &quot;rgba(232,237,245,0.4)&quot;, letterSpacing: 2, marginBottom: 6 }}>NICHE</div>
            <select style={{ ...inp, cursor: &quot;pointer&quot; }} value={niche} onChange={e => setNiche(e.target.value)}>
              <option value=&quot;&quot;>All niches</option>
              {NICHES.map(n => <option key={n} value={n} style={{ background: &quot;#1a1f2e&quot; }}>{n}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: &quot;rgba(232,237,245,0.4)&quot;, letterSpacing: 2, marginBottom: 8 }}>PLATFORMS</div>
          <div style={{ display: &quot;flex&quot;, gap: 8, flexWrap: &quot;wrap&quot; }}>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => toggle(p.id)} style={{ background: platforms.includes(p.id) ? `${p.color}20` : &quot;rgba(255,255,255,0.04)&quot;, border: `1.5px solid ${platforms.includes(p.id) ? p.color : &quot;rgba(255,255,255,0.1)&quot;}`, color: platforms.includes(p.id) ? p.color : &quot;rgba(232,237,245,0.4)&quot;, borderRadius: 9, padding: &quot;8px 14px&quot;, cursor: &quot;pointer&quot;, fontSize: 12, display: &quot;flex&quot;, alignItems: &quot;center&quot;, gap: 5 }}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: &quot;grid&quot;, gridTemplateColumns: &quot;1fr 1fr&quot;, gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: &quot;rgba(232,237,245,0.4)&quot;, letterSpacing: 2, marginBottom: 8 }}>DAILY BUDGET</div>
            <div style={{ display: &quot;flex&quot;, gap: 6 }}>
              {BUDGETS.map(b => (
                <button key={b} onClick={() => setBudget(b)} style={{ flex: 1, background: budget === b ? &quot;rgba(0,255,178,.15)&quot; : &quot;rgba(255,255,255,0.04)&quot;, border: `1.5px solid ${budget === b ? &quot;#00FFB2&quot; : &quot;rgba(255,255,255,0.1)&quot;}`, color: budget === b ? &quot;#00FFB2&quot; : &quot;rgba(232,237,245,0.4)&quot;, borderRadius: 8, padding: &quot;8px 4px&quot;, cursor: &quot;pointer&quot;, fontSize: 11, fontFamily: &quot;monospace&quot; }}>{b}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: &quot;rgba(232,237,245,0.4)&quot;, letterSpacing: 2, marginBottom: 8 }}>TREND</div>
            <div style={{ display: &quot;flex&quot;, gap: 6 }}>
              {TRENDS.map(t => (
                <button key={t} onClick={() => setTrend(t)} style={{ flex: 1, background: trend === t ? &quot;rgba(255,184,0,.15)&quot; : &quot;rgba(255,255,255,0.04)&quot;, border: `1.5px solid ${trend === t ? &quot;#FFB800&quot; : &quot;rgba(255,255,255,0.1)&quot;}`, color: trend === t ? &quot;#FFB800&quot; : &quot;rgba(232,237,245,0.4)&quot;, borderRadius: 8, padding: &quot;8px 4px&quot;, cursor: &quot;pointer&quot;, fontSize: 10 }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={search} disabled={loading} style={{ width: &quot;100%&quot;, padding: &quot;14px&quot;, background: loading ? &quot;rgba(0,255,178,.08)&quot; : &quot;linear-gradient(135deg,#00FFB2,#00C8FF)&quot;, color: loading ? &quot;#00FFB2&quot; : &quot;#000&quot;, border: loading ? &quot;1.5px solid #00FFB2&quot; : &quot;none&quot;, borderRadius: 12, cursor: loading ? &quot;not-allowed&quot; : &quot;pointer&quot;, fontFamily: &quot;'Bebas Neue',sans-serif&quot;, fontSize: 17, letterSpacing: 2 }}>
          {loading ? &quot;⏳ SCANNING MARKETS...&quot; : &quot;⚡ FIND WINNING PRODUCTS&quot;}
        </button>
        {err && <div style={{ marginTop: 10, background: &quot;rgba(255,60,0,.1)&quot;, border: &quot;1px solid rgba(255,60,0,.25)&quot;, borderRadius: 8, padding: &quot;8px 12px&quot;, fontSize: 12, color: &quot;#FF6030&quot; }}>{err}</div>}
      </div>

      <div style={{ display: &quot;flex&quot;, flexDirection: &quot;column&quot;, gap: 12 }}>
        {products.map((p, i) => (
          <ProductCard key={i} p={p} index={i} onSave={(prod: any) => saveProduct(prod, i)} saved={!!saved[i]} />
        ))}
      </div>

      {!loading && products.length === 0 && (
        <div style={{ textAlign: &quot;center&quot;, padding: &quot;50px 40px&quot;, background: &quot;rgba(255,255,255,0.02)&quot;, border: &quot;1px dashed rgba(255,255,255,0.07)&quot;, borderRadius: 16 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⚡</div>
          <div style={{ fontFamily: &quot;'Bebas Neue',sans-serif&quot;, fontSize: 22, letterSpacing: 1, marginBottom: 8 }}>Ready to Scout</div>
          <div style={{ color: &quot;rgba(232,237,245,0.3)&quot;, fontSize: 13 }}>Configure your filters and hit Find Winning Products</div>
        </div>
      )}
    </div>
  );
}

