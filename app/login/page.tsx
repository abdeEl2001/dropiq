"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(""); setMsg("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
      else router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) setErr(error.message);
      else setMsg("Check your email for a confirmation link!");
    }
    setLoading(false);
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)", color: "#fff",
    borderRadius: 10, padding: "11px 14px", fontSize: 14,
    marginBottom: 12, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080C12", fontFamily: "sans-serif" }}>
      <div style={{ width: 400, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 36 }}>

        <div style={{ fontFamily: "'Bebas Neue', monospace", fontSize: 32, letterSpacing: 2, marginBottom: 6 }}>
          DROP<span style={{ color: "#00FFB2" }}>IQ</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(232,237,245,0.4)", marginBottom: 28 }}>
          {mode === "login" ? "Sign in to your account" : "Create your free account"}
        </div>

        <form onSubmit={handle}>
          <input style={inp} type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <input style={{ ...inp, marginBottom: 16 }} type="password" value={password}
            onChange={e => setPassword(e.target.value)} placeholder="Password" required />

          {err && (
            <div style={{ background: "rgba(255,60,0,.1)", border: "1px solid rgba(255,60,0,.25)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#FF6030", marginBottom: 12 }}>
              {err}
            </div>
          )}
          {msg && (
            <div style={{ background: "rgba(0,255,178,.08)", border: "1px solid rgba(0,255,178,.2)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#00FFB2", marginBottom: 12 }}>
              {msg}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg,#00FFB2,#00C8FF)", color: "#000", border: "none", borderRadius: 11, padding: "13px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "rgba(232,237,245,0.4)" }}>
          {mode === "login" ? "No account? " : "Already have one? "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{ color: "#00FFB2", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
