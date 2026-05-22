import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import parchment from "@/assets/parchment-bg.jpg";
import fairies from "@/assets/fairies-group.png";

export default function Auth() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);

  const pwRules = [
    { label: "En az 8 karakter", ok: password.length >= 8 },
    { label: "En az 1 büyük harf (A-Z)", ok: /[A-Z]/.test(password) },
    { label: "En az 1 küçük harf (a-z)", ok: /[a-z]/.test(password) },
    { label: "En az 1 rakam (0-9)", ok: /[0-9]/.test(password) },
    { label: "En az 1 özel karakter (!?@#…)", ok: /[^A-Za-z0-9]/.test(password) },
    { label: "Yaygın/sızdırılmış bir şifre olmamalı", ok: password.length >= 8 },
  ];

  if (loading) return null;
  if (user) return <Navigate to="/app" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Köye hoş geldin! Mailini kontrol et ✨");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav("/app");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Bir şeyler ters gitti");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${parchment})`, backgroundSize: "cover" }}
    >
      <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur border-border/60 shadow-[var(--shadow-card)]">
        <div className="flex justify-center mb-2">
          <img
            src={fairies}
            alt="Peri köyü"
            className="h-24 w-auto opacity-90 animate-float"
            loading="lazy"
          />
        </div>
        <h1 className="font-display text-4xl text-center text-secondary mb-1">HEARTH</h1>
        <p className="font-fairy text-center text-2xl text-primary mb-6">peri köyüne hoş geldin</p>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label className="font-display text-secondary">Adın</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Periler seni nasıl çağırsın?"
                className="bg-background/70 border-parchment-edge"
              />
            </div>
          )}
          <div>
            <Label className="font-display text-secondary">E-posta</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/70 border-parchment-edge"
            />
          </div>
          <div>
            <Label className="font-display text-secondary">Şifre</Label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPointerDown={() => setPwTouched(true)}
              onFocus={() => {
                setPwFocused(true);
                setPwTouched(true);
              }}
              onBlur={() => setPwFocused(false)}
              className="bg-background/70 border-parchment-edge"
            />
            {mode === "signup" && (pwFocused || pwTouched || password.length > 0) && (
              <div className="mt-2 rounded-md border border-parchment-edge bg-background/60 p-3 text-xs space-y-1">
                <p className="font-display text-secondary mb-1">Şifre kuralları</p>
                {pwRules.map((r) => (
                  <div
                    key={r.label}
                    className={`flex items-center gap-2 ${r.ok ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <span aria-hidden>{r.ok ? "✓" : "•"}</span>
                    <span>{r.label}</span>
                  </div>
                ))}
                <p className="pt-1 text-[10px] text-muted-foreground italic">
                  İpucu: "123456", "password", "qwerty" gibi yaygın/sızdırılmış şifreler güvenlik sistemimiz tarafından reddedilir.
                </p>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full font-display text-base h-11"
          >
            {busy ? "..." : mode === "signup" ? "Köye gir" : "Tekrar hoş geldin"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-secondary font-body"
        >
          {mode === "signup" ? "Zaten bir perin var mı? Giriş yap" : "Henüz köye gelmedin mi? Kaydol"}
        </button>
      </Card>
    </div>
  );
}
