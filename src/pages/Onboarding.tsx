import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import parchment from "@/assets/parchment-bg.jpg";
import fairies from "@/assets/fairies-group.png";

const stages = [
  { value: "menstrual", label: "Menstrüel dönem", desc: "Düzenli aylık döngüm var" },
  { value: "perimenopause", label: "Perimenopoz", desc: "Döngülerim değişiyor" },
  { value: "menopause", label: "Menopoz", desc: "Yeni bir mevsimdeyim" },
  { value: "pcos", label: "PCOS", desc: "Polikistik over sendromu" },
  { value: "pregnancy", label: "Hamilelik", desc: "Bir yuva büyütüyorum" },
  { value: "postpartum", label: "Doğum sonrası", desc: "Yeni anneyim" },
] as const;

export default function Onboarding() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<(typeof stages)[number]["value"]>("menstrual");
  const [year, setYear] = useState<string>("");
  const [cycle, setCycle] = useState("28");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) nav("/auth");
  }, [user, loading, nav]);

  const finish = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        life_stage: stage,
        birth_year: year ? Number(year) : null,
        avg_cycle_length: Number(cycle) || 28,
        onboarding_completed: true,
      })
      .eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    nav("/app");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${parchment})`, backgroundSize: "cover" }}
    >
      <div className="w-full max-w-md bg-card/95 backdrop-blur rounded-3xl p-8 border border-border/60 shadow-[var(--shadow-card)]">
        <div className="flex justify-center mb-3">
          <img src={fairies} alt="" className="h-20 animate-float" />
        </div>

        {step === 0 && (
          <>
            <h2 className="font-display text-3xl text-secondary text-center">Welcome to HEARTH</h2>
            <p className="font-fairy text-2xl text-primary text-center mt-1">peri köyüne</p>
            <p className="text-center text-muted-foreground mt-4 font-body text-sm leading-relaxed">
              Health · Empowerment · Awareness · Ritual · Tracking · Harmony
            </p>
            <p className="text-center text-secondary/80 mt-6 font-display italic">
              "Bedeniniz bir köy, her mevsim bir hediye. Periler size eşlik etmeye geldi."
            </p>
            <Button
              onClick={() => setStep(1)}
              className="w-full mt-8 bg-secondary hover:bg-secondary/90 rounded-full h-11 font-display"
            >
              Yolculuğa başla ✨
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="font-display text-2xl text-secondary text-center">Hangi mevsimdesin?</h3>
            <p className="text-center text-muted-foreground font-body text-sm mt-1 mb-5">
              Sana en uygun rehberi seçelim
            </p>
            <div className="space-y-2">
              {stages.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStage(s.value)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    stage === s.value
                      ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                      : "border-border/60 bg-background/40 hover:border-primary/50"
                  }`}
                >
                  <div className="font-display text-secondary">{s.label}</div>
                  <div className="text-xs text-muted-foreground font-body">{s.desc}</div>
                </button>
              ))}
            </div>
            <Button
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-secondary hover:bg-secondary/90 rounded-full h-11 font-display"
            >
              Devam
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="font-display text-2xl text-secondary text-center">Birkaç küçük detay</h3>
            <div className="space-y-4 mt-5">
              <div>
                <Label className="font-display text-secondary">Doğum yılın</Label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="1995"
                  className="bg-background/70 border-parchment-edge"
                />
              </div>
              <div>
                <Label className="font-display text-secondary">
                  Ortalama döngü uzunluğun (gün)
                </Label>
                <Input
                  type="number"
                  value={cycle}
                  onChange={(e) => setCycle(e.target.value)}
                  className="bg-background/70 border-parchment-edge"
                />
              </div>
            </div>
            <Button
              onClick={finish}
              disabled={busy}
              className="w-full mt-6 bg-primary hover:bg-primary/90 rounded-full h-11 font-display"
            >
              {busy ? "..." : "Köye gir 🌿"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
