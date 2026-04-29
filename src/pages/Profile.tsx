import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stageLabels: Record<string, string> = {
  menstrual: "Menstrüel dönem",
  perimenopause: "Perimenopoz",
  menopause: "Menopoz",
  pcos: "PCOS",
  pregnancy: "Hamilelik",
  postpartum: "Doğum sonrası",
};

export default function Profile() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data));
  }, [user]);

  return (
    <div className="px-5 pt-10 pb-6">
      <h1 className="font-display text-3xl text-secondary">Profilin</h1>
      <p className="font-fairy text-xl text-primary -mt-1">peri kimliğin</p>

      <div className="fairy-card mt-6 p-5 space-y-3 bg-card/80">
        <Row label="Ad" value={profile?.display_name ?? "—"} />
        <Row label="E-posta" value={user?.email ?? "—"} />
        <Row label="Yaşam evresi" value={profile?.life_stage ? stageLabels[profile.life_stage] : "—"} />
        <Row label="Doğum yılı" value={profile?.birth_year ?? "—"} />
        <Row label="Ortalama döngü" value={`${profile?.avg_cycle_length ?? 28} gün`} />
      </div>

      <Button
        onClick={async () => { await signOut(); nav("/"); }}
        variant="outline"
        className="w-full mt-6 rounded-full h-11 font-display border-parchment-edge"
      >
        <LogOut className="w-4 h-4 mr-2" /> Köyden çık
      </Button>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between items-baseline border-b border-border/40 pb-2 last:border-0">
    <span className="font-display text-secondary/70">{label}</span>
    <span className="font-body text-secondary text-sm">{value}</span>
  </div>
);
