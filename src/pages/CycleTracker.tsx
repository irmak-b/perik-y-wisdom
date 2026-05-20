import { useEffect, useMemo, useState } from "react";
import {
  addDays, differenceInDays, eachDayOfInterval, endOfMonth, format,
  isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek,
} from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Cycle { id: string; start_date: string; end_date: string | null; }

const phaseColor = (day: number, cycleLen: number) => {
  if (day <= 5) return "bg-destructive/70 text-destructive-foreground"; // menstrual
  if (day <= 13) return "bg-fairy-green/70 text-secondary";              // follicular
  if (day <= 16) return "bg-fairy-yellow/80 text-secondary";             // ovulation
  if (day <= cycleLen) return "bg-fairy-lavender/70 text-secondary";    // luteal
  return "";
};

export default function CycleTracker() {
  const { user } = useAuth();
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cycleLen, setCycleLen] = useState(28);
  const [periodLen, setPeriodLen] = useState(5);
  const [open, setOpen] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [pain, setPain] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from("profiles").select("avg_cycle_length, avg_period_length").eq("id", user.id).maybeSingle(),
        supabase.from("cycle_entries").select("id, start_date, end_date, created_at").eq("user_id", user.id).order("created_at"),
      ]);
      if (p) { setCycleLen(p.avg_cycle_length ?? 28); setPeriodLen(p.avg_period_length ?? 5); }
      if (c) setCycles(c);
    })();
  }, [user]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end: addDays(start, 41) });
  }, [month]);

  const lastCycle = cycles[cycles.length - 1];

  const dayInfo = (d: Date) => {
    if (!lastCycle) return { day: 0, color: "" };
    const diff = differenceInDays(d, parseISO(lastCycle.start_date));
    if (diff < 0) return { day: 0, color: "" };
    const day = (diff % cycleLen) + 1;
    return { day, color: phaseColor(day, cycleLen) };
  };

  const logPeriod = async (date: Date) => {
    if (!user) return;
    const start = format(date, "yyyy-MM-dd");
    const end = format(addDays(date, periodLen - 1), "yyyy-MM-dd");
    const { error } = await supabase.from("cycle_entries").insert({
      user_id: user.id, start_date: start, end_date: end, notes: note || null,
    });
    if (error) return toast.error(error.message);
    if (pain > 0) {
      await supabase.from("symptom_logs").upsert({
        user_id: user.id, log_date: start, pain_level: pain, notes: note || null,
      }, { onConflict: "user_id,log_date" });
    }
    toast.success("Kaydedildi 🌸");
    setOpen(null); setNote(""); setPain(0);
    const { data } = await supabase.from("cycle_entries").select("id, start_date, end_date, created_at").eq("user_id", user.id).order("created_at");
    if (data) setCycles(data);
  };

  const weekdays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="font-display text-3xl text-secondary">Mevsimler Patikası</h1>
      <p className="font-fairy text-xl text-primary -mt-1">döngünün takvimi</p>

      <div className="flex items-center justify-between mt-6">
        <button onClick={() => setMonth(addDays(month, -28))} className="p-2 rounded-full hover:bg-secondary/10">
          <ChevronLeft className="w-5 h-5 text-secondary" />
        </button>
        <span className="font-display text-xl text-secondary capitalize">
          {format(month, "MMMM yyyy", { locale: tr })}
        </span>
        <button onClick={() => setMonth(addDays(endOfMonth(month), 1))} className="p-2 rounded-full hover:bg-secondary/10">
          <ChevronRight className="w-5 h-5 text-secondary" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mt-3 text-center">
        {weekdays.map((w) => (
          <div key={w} className="font-fairy text-base text-muted-foreground">{w}</div>
        ))}
        {days.map((d) => {
          const info = dayInfo(d);
          const isToday = isSameDay(d, new Date());
          const inMonth = isSameMonth(d, month);
          const isPeriod = cycles.some(c => {
            const s = parseISO(c.start_date);
            const e = c.end_date ? parseISO(c.end_date) : addDays(s, periodLen - 1);
            return d >= s && d <= e;
          });
          return (
            <button
              key={d.toISOString()}
              onClick={() => setOpen(d)}
              className={`aspect-square rounded-full text-sm font-display flex items-center justify-center transition-all
                ${!inMonth ? "opacity-30" : ""}
                ${isPeriod ? "bg-destructive text-destructive-foreground" : info.color || "hover:bg-secondary/10"}
                ${isToday ? "ring-2 ring-secondary ring-offset-1 ring-offset-parchment" : ""}
              `}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-body">
        <Legend color="bg-destructive" label="Menstrüel" />
        <Legend color="bg-fairy-green" label="Foliküler" />
        <Legend color="bg-fairy-yellow" label="Ovulasyon" />
        <Legend color="bg-fairy-lavender" label="Luteal" />
      </div>

      <Button
        onClick={() => setOpen(new Date())}
        className="w-full mt-6 bg-secondary hover:bg-secondary/90 rounded-full h-11 font-display"
      >
        <Plus className="w-4 h-4 mr-1" /> Bugün regl başladı
      </Button>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="bg-card border-border/60">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-secondary">
              {open && format(open, "d MMMM yyyy", { locale: tr })}
            </DialogTitle>
            <p className="font-fairy text-base text-primary -mt-1">
              Bu günü regl başlangıcı olarak işaretle
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-body">
              Takvim, son seçtiğin regl başlangıç gününe göre yeniden şekillenecek. Yanlış güne dokunduysan farklı bir güne dokunup yeniden kaydedebilirsin.
            </p>
            <div>
              <Label className="font-display text-secondary">Ağrı seviyesi: {pain}/10</Label>
              <input
                type="range" min={0} max={10} value={pain}
                onChange={(e) => setPain(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
              />
            </div>
            <div>
              <Label className="font-display text-secondary">Notlar</Label>
              <Textarea
                value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="O gün nasıl hissediyordun?"
                className="bg-background/60 border-parchment-edge"
              />
            </div>
            <Button
              onClick={() => open && logPeriod(open)}
              className="w-full bg-secondary hover:bg-secondary/90 rounded-full h-11 font-display"
            >
              {open && format(open, "d MMMM", { locale: tr })} gününü regl başlangıcı yap 🌸
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    <span className={`w-3 h-3 rounded-full ${color}`} /> {label}
  </div>
);
