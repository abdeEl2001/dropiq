"use client";
import { useState } from "react";

const PLATFORMS = [
  { id:"facebook",  label:"Facebook",  icon:"📘", color:"#1877F2" },
  { id:"tiktok",    label:"TikTok",    icon:"🎵", color:"#FF0050" },
  { id:"instagram", label:"Instagram", icon:"📸", color:"#E1306C" },
  { id:"google",    label:"Google",    icon:"🔍", color:"#4285F4" },
];
const ANGLES = [
  { id:"problem",  label:"Problem/Solution", icon:"🎯" },
  { id:"social",   label:"Social Proof",     icon:"⭐" },
  { id:"before",   label:"Before/After",     icon:"✨" },
  { id:"ugc",      label:"UGC Style",        icon:"📱" },
  { id:"urgency",  label:"Urgency/Scarcity", icon:"⏰" },
];

function safeJSON(raw: string) {
  let t = raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  try{return JSON.parse(t);}catch(_){}
  const s=t.indexOf("{"),e=t.lastIndexOf("}");
  if(s!==-1&&e>s){let c=t.slice(s,e+1);try{return JSON.parse(c);}catch(_){}c=c.replace(/,\s*([\]}])/g,"$1");try{return JSON.parse(c);}catch(_){}}
  return null;
}

export default function CopyPage() {
  const [product,  setProduct]  = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [angle,    setAngle]    = useState("problem");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<any>(null);
  const [err,      setErr]      = useState("");
  const [copied,   setCopied]   = useState<Record<string,boolean>>({});

  const generate = async () => {
    if (!product) { setErr("Enter a product name."); return; }
    setErr(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, platform, angle, audience }),
      });
      const data = await res.json();
      if (data.error) setErr(data.error);
      else setResult(data);
    } catch(e: any){ setErr(e.message); }
    setLoading(false);
  };

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(c=>({...c,[key]:true}));
    setTimeout(()=>setCopied(c=>({...c,[key]:false})),2000);
  };

  const pl = PLATFORMS.find(p=>p.id===platform)!;

  const CopyBtn = ({text, id}: {text: string; id: string}) => (
    <button onClick={()=>copyText(text,id)} style={{ background:copied[id]?"rgba(0,255,178,.15)":"rgba(255,255,255,.06)", border:`1px solid ${copied[id]?"#00FFB2":"rgba(255,255,255,.1)"}`, color:copied[id]?"#00FFB2":"rgba(232,237,245,0.5)", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:10, fontFamily:"monospace" }}>
      {copied[id]?"✓ COPIED":"COPY"}
    </button>
  );

  const Block = ({label, keyId, val, color}: {label:string;keyId:string;val:string;color:string}) => (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:16, borderLeft:`3px solid ${color}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ fontSize:10, color, letterSpacing:2 }}>{label}</div>
        <CopyBtn text={val} id={keyId} />
      </div>
      <div style={{ fontSize:13, color:"#E8EDF5", lineHeight:1.7, fontFamily:"monospace" }}>{val}</div>
    </div>
  );

  return (
    <div style={{ fontFamily:"sans-serif" }}>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, margin:"0 0 4px", letterSpacing:1, color:"#E8EDF5" }}>
        ✍️ COPY<span style={{ color:"#FFB800" }}>GEN</span>
      </h2>
      <p style={{ margin:"0 0 24px", color:"rgba(232,237,245,0.4)", fontSize:13 }}>Generate viral ad scripts for any platform</p>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20, marginBottom:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          <div>
            <div style={{ fontSize:10, color:"rgba(232,237,245,0.4)", letterSpacing:2, marginBottom:6 }}>PRODUCT NAME</div>
            <input value={product} onChange={e=>setProduct(e.target.value)} placeholder="e.g. Anti-snore nose clip, posture belt..."
              style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", color:"#E8EDF5", borderRadius:10, padding:"11px 14px", fontSize:13, outline:"none" }} />
          </div>
          <div>
            <div style={{ fontSize:10, color:"rgba(232,237,245,0.4)", letterSpacing:2, marginBottom:6 }}>TARGET AUDIENCE</div>
            <input value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. women 25-45 with back pain..."
              style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", color:"#E8EDF5", borderRadius:10, padding:"11px 14px", fontSize:13, outline:"none" }} />
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, color:"rgba(232,237,245,0.4)", letterSpacing:2, marginBottom:8 }}>PLATFORM</div>
          <div style={{ display:"flex", gap:8 }}>
            {PLATFORMS.map(p=>(
              <button key={p.id} onClick={()=>setPlatform(p.id)} style={{ flex:1, background:platform===p.id?`${p.color}18`:"rgba(255,255,255,.04)", border:`1.5px solid ${platform===p.id?p.color:"rgba(255,255,255,.1)"}`, color:platform===p.id?p.color:"rgba(232,237,245,0.4)", borderRadius:9, padding:"9px 0", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, color:"rgba(232,237,245,0.4)", letterSpacing:2, marginBottom:8 }}>AD ANGLE</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {ANGLES.map(a=>(
              <button key={a.id} onClick={()=>setAngle(a.id)} style={{ background:angle===a.id?"rgba(255,184,0,.15)":"rgba(255,255,255,.04)", border:`1.5px solid ${angle===a.id?"#FFB800":"rgba(255,255,255,.1)"}`, color:angle===a.id?"#FFB800":"rgba(232,237,245,0.4)", borderRadius:9, padding:"8px 14px", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={loading} style={{ width:"100%", padding:"14px", background:loading?"rgba(255,184,0,.08)":"linear-gradient(135deg,#FFB800,#FF6B35)", color:loading?"#FFB800":"#000", border:loading?"1.5px solid #FFB800":"none", borderRadius:12, cursor:loading?"not-allowed":"pointer", fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:2 }}>
          {loading?`⏳ GENERATING...`:`${pl.icon} GENERATE ${pl.label.toUpperCase()} AD COPY`}
        </button>
        {err&&<div style={{ marginTop:10, background:"rgba(255,60,0,.1)", border:"1px solid rgba(255,60,0,.25)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#FF6030" }}>{err}</div>}
      </div>

      {result&&(
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {result.hook     && <Block label="🎣 HOOK"              keyId="hook"     val={result.hook}     color="#FF3E6C" />}
          {result.headline && <Block label="📰 HEADLINE"          keyId="headline" val={result.headline} color="#FFB800" />}
          {result.body     && <Block label="📝 BODY COPY"         keyId="body"     val={result.body}     color="#3E9EFF" />}
          {result.script   && <Block label="🎬 15-SEC VIDEO SCRIPT" keyId="script" val={result.script}   color="#A855F7" />}
          {result.caption  && <Block label="📱 SOCIAL CAPTION"   keyId="caption"  val={result.caption}  color="#00FFB2" />}
          {result.variation2?.hook && <Block label="🔁 VARIATION B — HOOK" keyId="v2hook" val={result.variation2.hook} color="#888" />}
          {result.variation2?.body && <Block label="🔁 VARIATION B — BODY" keyId="v2body" val={result.variation2.body} color="#888" />}

          {result.hashtags?.length>0&&(
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontSize:10, color:"#00FFB2", letterSpacing:2 }}>🏷️ HASHTAGS</div>
                <button onClick={()=>copyText(result.hashtags.map((h:string)=>`#${h}`).join(" "),"hashtags")} style={{ background:copied["hashtags"]?"rgba(0,255,178,.15)":"rgba(255,255,255,.06)", border:`1px solid ${copied["hashtags"]?"#00FFB2":"rgba(255,255,255,.1)"}`, color:copied["hashtags"]?"#00FFB2":"rgba(232,237,245,0.5)", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:10, fontFamily:"monospace" }}>
                  {copied["hashtags"]?"✓ COPIED":"COPY ALL"}
                </button>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {result.hashtags.map((h:string,i:number)=>(
                  <span key={i} style={{ background:"rgba(0,255,178,.12)", border:"1px solid rgba(0,255,178,.2)", color:"#00FFB2", borderRadius:20, padding:"5px 14px", fontSize:12, fontFamily:"monospace" }}>#{h}</span>
                ))}
              </div>
            </div>
          )}
          {result.tips&&(
            <div style={{ background:"rgba(255,184,0,.05)", border:"1px solid rgba(255,184,0,.2)", borderRadius:13, padding:16 }}>
              <div style={{ fontSize:10, color:"#FFB800", letterSpacing:2, marginBottom:8 }}>💡 PRO TIPS</div>
              <div style={{ fontSize:12, color:"rgba(232,237,245,0.6)", lineHeight:1.7 }}>{result.tips}</div>
            </div>
          )}
        </div>
      )}

      {!loading&&!result&&(
        <div style={{ textAlign:"center", padding:"50px 40px", background:"rgba(255,255,255,0.02)", border:"1px dashed rgba(255,255,255,0.07)", borderRadius:16 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>✍️</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:1, marginBottom:8 }}>Ready to Write</div>
          <div style={{ color:"rgba(232,237,245,0.3)", fontSize:13 }}>Fill in your product details and generate viral copy instantly</div>
        </div>
      )}
    </div>
  );
}
