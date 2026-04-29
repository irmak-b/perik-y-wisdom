import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { differenceInDays, format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, BookOpen, Sparkles } from "lucide-react";
import fairies from "@/assets/fairies-group.png";

export default function Home() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [stage, setStage] = useState<string>("menstrual");
  const [cycleLen, setCycleLen] = useState(28);
  const [lastStart, setLastStart] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from("profiles").select("display_name, life_stage, avg_cycle_length").eq("id", user.id).maybeSingle(),
        supabase.from("cycle_entries").select("start_date").eq("user_id", user.id).order("start_date", { ascending: false }).limit(1),
      ]);
      if (p) {
        setName(p.display_name ?? "");
        setStage(p.life_stage);
        setCycleLen(p.avg_cycle_length ?? 28);
      }
      if (c && c[0]) setLastStart(c[0].start_date);
    })();
  }, [user]);

  const today = new Date();
  let phaseLine = "Bugün kendine nazik ol 🌿";
  let dayInCycle: number | null = null;
  if (lastStart) {
    dayInCycle = differenceInDays(today, parseISO(lastStart)) + 1;
    if (dayInCycle <= 5) phaseLine = "Menstrüel faz — dinlenme zamanı 🌙";
    else if (dayInCycle <= 13) phaseLine = "Foliküler faz — yeniden doğuş 🌱";
    else if (dayInCycle <= 16) phaseLine = "Ovulasyon — parlama zamanı ✨";
    else phaseLine = "Luteal faz — kendine dön 🍂";
  }

  return (
    <div className="px-5 pt-10 pb-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-fairy text-3xl text-primary leading-none">merhaba</p>
          <h1 className="font-display text-4xl text-secondary -mt-1">{name || "peri"}</h1>
          <p className="text-xs text-muted-foreground mt-1 font-body capitalize">
            {format(today, "d MMMM EEEE", { locale: tr })}
          </p>
        </div>
        <img src={fairies} alt="" className="h-20 -mr-2 animate-float-slow" />
      </div>

      {/* Cycle ring card */}
      <div className="fairy-card mt-6 p-6 bg-gradient-meadow text-center">
        <p className="font-fairy text-xl text-secondary/80">bugün</p>
        <p className="font-display text-2xl text-secondary mt-1">{phaseLine}</p>
        {dayInCycle !== null ? (
          <p className="mt-3 font-body text-sm text-muted-foreground">
            Döngünün <span className="font-semibold text-secondary">{dayInCycle}.</span> günü
            {dayInCycle > cycleLen ? " (yeni döngü yaklaşıyor)" : ""}
          </p>
        ) : (
          <Link
            to="/app/cycle"
            className="inline-block mt-3 text-sm text-primary underline-offset-4 hover:underline font-display"
          >
            İlk regl gününü kaydet →
          </Link>
        )}
      </div>

      {/* Module shortcuts */}
      <h2 className="font-display text-2xl text-secondary mt-8 mb-3">Köyün patikaları</h2>
      <div className="grid grid-cols-2 gap-3">
        <ModuleCard to="/app/cycle" icon={Calendar} title="Mevsimler Patikası" desc="Döngü takvimi" tone="lime" />
        <ModuleCard to="/app/wisdom" icon={BookOpen} title="Bilgelik Kütüphanesi" desc="Peri kartları" tone="navy" />
        <ModuleCard to="/app/cycle" icon={Sparkles} title="Şifa Korusu" desc="Yakında" tone="pink" disabled />
        <ModuleCard to="/app/wisdom" icon={Sparkles} title="Yıldız Parşömeni" desc="Yakında" tone="lavender" disabled />
      </div>

      <p className="font-fairy text-center text-xl text-secondary/60 mt-10">
        Health · Empowerment · Awareness<br />Ritual · Tracking · Harmony
      </p>
    </div>
  );
}

function ModuleCard({
  to, icon: Icon, title, desc, tone, disabled,
}: { to: string; icon: any; title: string; desc: string; tone: "lime" | "navy" | "pink" | "lavender"; disabled?: boolean }) {
  const toneMap = {
    lime: "bg-primary/15 border-primary/40 text-secondary",
    navy: "bg-secondary/10 border-secondary/40 text-secondary",
    pink: "bg-fairy-pink/20 border-fairy-pink/50 text-secondary",
    lavender: "bg-fairy-lavender/20 border-fairy-lavender/50 text-secondary",
  };
  const inner = (
    <div className={`fairy-card p-4 h-32 flex flex-col justify-between border ${toneMap[tone]} ${disabled ? "opacity-60" : ""}`}>
      <Icon className="w-6 h-6" strokeWidth={1.5} />
      <div>
        <div className="font-display text-base leading-tight">{title}</div>
        <div className="font-body text-[11px] text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
  return disabled ? inner : <Link to={to}>{inner}</Link>;
}
