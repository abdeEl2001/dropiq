"use client";
import { useState } from "react";

const COUNTRIES = [
  { code:"MA",flag:"🇲🇦" },{ code:"US",flag:"🇺🇸" },{ code:"FR",flag:"🇫🇷" },
  { code:"GB",flag:"🇬🇧" },{ code:"AE",flag:"🇦🇪" },{ code:"DZ",flag:"🇩🇿" },
];

function safeJSON(raw: string) {
  let t = raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  try { return JSON.parse(t); } catch (_) {}
  const s=t.indexOf("{"), e=t.lastIndexOf("}");
  if(s!==-1&&e>s){
    let c=t.slice(s,e+1);
    try{return JSON.parse(c);}catch(_){}
    c=c.replace(/,\s*([\]}])/g,"$1").replace(/[\x00-\x1F\x7F]/g," ");
    try{return JSON.parse(c);}catch(_){}
  }
  return null;
}

export default function SpyPage() {
  const [query, setQuery]     = useState("");
  const [country, setCountry] = useState("MA");
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData]   = useState<any>(null);
  const [tab, setTab]         = useState("tiktok");
  const [err, setErr]         = useState("");
  const [openHook, setOpenHook] = useState<number|null>(null);

  const run = async () => {
    if (!query) { setErr("Enter a keyword."); return; }
    setErr(""); setLoading(true); setAiData(null);

    const prompt = `Expert e-commerce ad spy for "${query}" in ${country}.
Return ONLY minified JSON, strings max 70 chars:
{"tiktokTrends":[{"keyword":"str","volume":"High","trend":"Rising","topAngle":"str","hooks":["str","str","str"],"bestFormat":"UGC","estimatedCPM":"$3-8","audienceAge":"25-34","viralScore":80},{"keyword":"str","volume":"Medium","trend":"Peak","topAngle":"str","hooks":["str","str","str"],"bestFormat":"Demo","estimatedCPM":"$4-10","audienceAge":"18-24","viralScore":70}],"crossPlatformInsights":{"winningAngle":"str","fbVsTiktok":"str","recommendedBudgetSplit":"55% TikTok / 45% FB","bestProduct":"str","estimatedROAS":"3-5x","urgencyScore":78,"urgencyReason":"str"},"competitorAdAnalysis":[{"pageName":"str","strategy":"str","weakness":"str","estimatedSpend":"$30-80/day"}],"topKeywordsToTarget":["kw1","kw2","kw3","kw4","kw5"]}
JSON only.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
      });
      const d = await res.json();
      const raw = d.content?.map((b: any) => b.text || "").join("") || "";
      const parsed = safeJSON(raw);
      if (parsed) setAiData(parsed);
      else setErr("Could not parse response. Try again.");
    } catch (e: any) { setErr(e.message); }
    setLoading(false);
    setTab("tiktok");
  };

  const TABS = [
    { id:"tiktok",   label:"🎵 TikTok Trends",    color:"#FF0050" },
    { id:"insights", label:"⚡ AI Intelligence",   color:"#00FFB2" },
  ];

  return (
    <div style={{ fontFamily:"sans-serif" }}>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, margin:"0 0 4px", letterSpacing:1, color:"#E8EDF5" }}>
        🕵️ AD<span style={{ color:"#1877F2" }}>SPY</span>
      </h2>
      <p style={{ margin:"0 0 24px", color:"rgba(232,237,245,0.4)", fontSize:13 }}>TikTok trends + cross-platform intelligence</p>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:18, marginBottom:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:10, alignItems:"center" }}>
          <input value={query} onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&run()}
            placeholder="Product keyword (e.g. hair straightener, led lamp...)"
            style={{ background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", color:"#E8EDF5", borderRadius:10, padding:"12px 14px", fontSize:13, outline:"none" }} />
          <div style={{ display:"flex", gap:5 }}>
            {COUNTRIES.map(c=>(
              <button key={c.code} title={c.code} onClick={()=>setCountry(c.code)} style={{ background:country===c.code?"rgba(255,255,255,.12)":"rgba(255,255,255,.04)", border:`1.5px solid ${country===c.code?"rgba(255,255,255,.3)":"rgba(255,255,255,.1)"}`, borderRadius:7, padding:"7px 9px", cursor:"pointer", fontSize:15 }}>
                {c.flag}
              </button>
            ))}
          </div>
          <button onClick={run} disabled={loading} style={{ background:loading?"rgba(255,0,80,.1)":"linear-gradient(135deg,#1877F2,#FF0050)", color:loading?"#FF0050":"#fff", border:loading?"1px solid #FF0050":"none", borderRadius:10, padding:"12px 22px", fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:1, cursor:loading?"not-allowed":"pointer" }}>
            {loading ? "⏳ SCANNING" : "🔍 SPY NOW"}
          </button>
        </div>
        {err&&<div style={{ marginTop:10, background:"rgba(255,60,0,.1)", border:"1px solid rgba(255,60,0,.25)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#FF6030" }}>{err}</div>}
      </div>

      {aiData && (
        <>
          <div style={{ display:"flex", gap:6, marginBottom:16 }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?`${t.color}15`:"rgba(255,255,255,.03)", border:`1.5px solid ${tab===t.id?t.color:"rgba(255,255,255,.07)"}`, color:tab===t.id?t.color:"rgba(232,237,245,0.4)", borderRadius:10, padding:"9px 18px", cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", fontSize:14, letterSpacing:.5 }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab==="tiktok"&&(
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(aiData.tiktokTrends||[]).map((t: any, i: number)=>{
                const tc = t.trend==="Rising"?"#00FFB2":t.trend==="Peak"?"#FFB800":"#FF6B35";
                return(
                  <div key={i} onClick={()=>setOpenHook(openHook===i?null:i)} style={{ background:"rgba(255,0,80,.05)", border:"1px solid rgba(255,0,80,.2)", borderRadius:13, padding:16, cursor:"pointer", borderLeft:`3px solid ${tc}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                          <span style={{ background:"rgba(255,0,80,.12)", color:"#FF0050", borderRadius:5, padding:"2px 9px", fontSize:11 }}>🎵 TikTok</span>
                          <span style={{ background:`${tc}20`, color:tc, borderRadius:5, padding:"2px 9px", fontSize:11 }}>VOL: {t.volume}</span>
                          <span style={{ background:`${tc}15`, color:tc, borderRadius:5, padding:"2px 9px", fontSize:11 }}>{t.trend==="Rising"?"↗":t.trend==="Peak"?"⬆":"↘"} {t.trend}</span>
                          <span style={{ background:"rgba(255,184,0,.12)", color:"#FFB800", borderRadius:5, padding:"2px 9px", fontSize:11 }}>{t.bestFormat}</span>
                        </div>
                        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:"#E8EDF5", marginBottom:3 }}>#{t.keyword}</div>
                        <div style={{ fontSize:12, color:"rgba(232,237,245,0.5)" }}>{t.topAngle}</div>
                      </div>
                      <div style={{ textAlign:"right", marginLeft:12 }}>
                        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:30, color:tc, lineHeight:1 }}>{t.viralScore}</div>
                        <div style={{ fontSize:9, color:"rgba(232,237,245,0.3)", letterSpacing:1 }}>VIRAL</div>
                      </div>
                    </div>
                    {openHook===i&&(
                      <div style={{ marginTop:14, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:14 }}>
                        <div style={{ fontSize:9, color:"#FF0050", letterSpacing:2, marginBottom:8 }}>🎣 HOOKS</div>
                        {(t.hooks||[]).map((h: string, j: number)=>(
                          <div key={j} style={{ background:"rgba(255,0,80,.08)", borderRadius:8, padding:"8px 12px", marginBottom:6, fontSize:12, color:"rgba(232,237,245,0.7)", fontStyle:"italic" }}>"{h}"</div>
                        ))}
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10 }}>
                          <div style={{ background:"rgba(0,0,0,.3)", borderRadius:9, padding:10 }}>
                            <div style={{ fontSize:9, color:"rgba(232,237,245,0.3)", letterSpacing:2 }}>EST. CPM</div>
                            <div style={{ color:"#3E9EFF", fontFamily:"monospace", fontWeight:600, fontSize:15, marginTop:3 }}>{t.estimatedCPM}</div>
                          </div>
                          <div style={{ background:"rgba(0,0,0,.3)", borderRadius:9, padding:10 }}>
                            <div style={{ fontSize:9, color:"rgba(232,237,245,0.3)", letterSpacing:2 }}>AUDIENCE</div>
                            <div style={{ color:"#A855F7", fontFamily:"monospace", fontWeight:600, fontSize:15, marginTop:3 }}>{t.audienceAge}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab==="insights"&&aiData.crossPlatformInsights&&(
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"linear-gradient(135deg,rgba(0,255,178,.05),rgba(0,200,255,.05))", border:"1px solid rgba(0,255,178,.2)", borderRadius:16, padding:20 }}>
                <div style={{ fontSize:10, color:"#00FFB2", letterSpacing:2, marginBottom:14 }}>⚡ CROSS-PLATFORM INTELLIGENCE</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  {[
                    { l:"WINNING ANGLE",    v:aiData.crossPlatformInsights.winningAngle,          c:"#00FFB2" },
                    { l:"BUDGET SPLIT",     v:aiData.crossPlatformInsights.recommendedBudgetSplit, c:"#3E9EFF" },
                    { l:"BEST PRODUCT",     v:aiData.crossPlatformInsights.bestProduct,            c:"#FFB800" },
                    { l:"EST. ROAS",        v:aiData.crossPlatformInsights.estimatedROAS,          c:"#A855F7" },
                  ].map(item=>(
                    <div key={item.l} style={{ background:"rgba(0,0,0,.3)", borderRadius:10, padding:12 }}>
                      <div style={{ fontSize:9, color:"rgba(232,237,245,0.3)", letterSpacing:2, marginBottom:4 }}>{item.l}</div>
                      <div style={{ color:item.c, fontSize:13, fontWeight:600, lineHeight:1.4 }}>{item.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(0,0,0,.3)", borderRadius:10, padding:12 }}>
                  <div style={{ fontSize:9, color:"rgba(232,237,245,0.3)", letterSpacing:2, marginBottom:5 }}>FB vs TIKTOK</div>
                  <div style={{ fontSize:12, color:"rgba(232,237,245,0.6)", lineHeight:1.6 }}>{aiData.crossPlatformInsights.fbVsTiktok}</div>
                </div>
              </div>
              {aiData.topKeywordsToTarget?.length>0&&(
                <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:18 }}>
                  <div style={{ fontSize:10, color:"#A855F7", letterSpacing:2, marginBottom:12 }}>🎯 TOP KEYWORDS</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {aiData.topKeywordsToTarget.map((kw: string, i: number)=>(
                      <span key={i} style={{ background:"rgba(168,85,247,.15)", border:"1px solid rgba(168,85,247,.3)", color:"#A855F7", borderRadius:20, padding:"6px 16px", fontSize:13, fontFamily:"monospace" }}>#{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!loading&&!aiData&&(
        <div style={{ textAlign:"center", padding:"50px 40px", background:"rgba(255,255,255,0.02)", border:"1px dashed rgba(255,255,255,0.07)", borderRadius:16 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>🕵️</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:1, marginBottom:8 }}>Spy on Competitors</div>
          <div style={{ color:"rgba(232,237,245,0.3)", fontSize:13 }}>Search a keyword to see TikTok trends and cross-platform intelligence</div>
        </div>
      )}
    </div>
  );
}
