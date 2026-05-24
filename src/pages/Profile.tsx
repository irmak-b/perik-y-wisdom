import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

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
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data));
  }, [user]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      await supabase.auth.signOut();
      toast({ title: "Hesabın silindi", description: "Tüm bilgilerin temizlendi." });
      nav("/");
    } catch (e: any) {
      toast({ title: "Silinemedi", description: e.message ?? "Bir hata oluştu", variant: "destructive" });
      setDeleting(false);
    }
  };

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

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full mt-3 rounded-full h-11 font-display border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Hesabı sil
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hesabını silmek istiyor musun?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Profilin, döngü kayıtların ve tüm bilgilerin kalıcı olarak silinir. Tekrar katılmak istersen baştan kayıt olman gerekir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Siliniyor..." : "Evet, sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between items-baseline border-b border-border/40 pb-2 last:border-0">
    <span className="font-display text-secondary/70">{label}</span>
    <span className="font-body text-secondary text-sm">{value}</span>
  </div>
);
