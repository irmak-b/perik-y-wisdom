import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { differenceInDays, parseISO } from "date-fns";
import { Sparkles, Flower2, Wind, HeartPulse, Clock, ChevronRight, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FairyMark } from "@/components/FairyMark";


type Exercise = {
  id: string;
  title: string;
  duration: string;
  difficulty: "kolay" | "orta" | "ileri";
  benefits: string[];
  steps: string[];
  caution?: string;
  emoji: string;
};

type Category = {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  tone: string;
  forPhases: ("menstrual" | "follicular" | "ovulation" | "luteal")[];
  exercises: Exercise[];
};

const categories: Category[] = [
  {
    id: "yoga-sanci",
    title: "Sancı Hafifletici Yoga",
    subtitle: "Regl kramplarına nazik dokunuş",
    icon: Flower2,
    tone: "from-fairy-pink/30 to-fairy-pink/10 border-fairy-pink/50",
    forPhases: ["menstrual"],
    exercises: [
      {
        id: "child-pose",
        title: "Çocuk Pozu (Balasana)",
        duration: "3-5 dk",
        difficulty: "kolay",
        emoji: "🧘‍♀️",
        benefits: ["Bel ağrısını azaltır", "Karın bölgesini gevşetir", "Sinir sistemini yatıştırır"],
        steps: [
          "Dizlerinin üzerine otur, ayak başparmaklarını birleştir, dizleri kalça genişliğinde aç.",
          "Nefes vererek gövdeni öne uzat, alnını yere bırak.",
          "Kollarını öne uzat veya yana bırak — istediğin gibi.",
          "Karnının nefesle yumuşadığını hisset, 8-10 derin nefes kal.",
        ],
        caution: "Diz ağrın varsa altına yastık koy.",
      },
      {
        id: "supine-twist",
        title: "Sırtüstü Burgu",
        duration: "2 dk / taraf",
        difficulty: "kolay",
        emoji: "🌀",
        benefits: ["Alt karın gerginliğini açar", "Sindirimi rahatlatır", "Bel kaslarını gevşetir"],
        steps: [
          "Sırtüstü uzan, kollarını T şeklinde aç.",
          "Sağ dizi göğsüne çek, sola doğru indir.",
          "Bakışını sağa çevir, omuzun yerde kalsın.",
          "5-8 nefes kal, diğer tarafa geç.",
        ],
      },
      {
        id: "cat-cow",
        title: "Kedi-İnek Hareketi",
        duration: "2-3 dk",
        difficulty: "kolay",
        emoji: "🐈",
        benefits: ["Omurgayı mobilize eder", "Pelvik akışı artırır", "Sancıyı dağıtır"],
        steps: [
          "Dört ayak üzerine gel, eller omuz, dizler kalça hizasında.",
          "Nefes alırken belini çukurlaştır, başını yukarı al (İnek).",
          "Nefes verirken sırtını yukarı yuvarla, çeneyi göğse çek (Kedi).",
          "10-12 tekrar, nefesinle senkronize et.",
        ],
      },
      {
        id: "legs-up-wall",
        title: "Bacaklar Duvarda",
        duration: "5-10 dk",
        difficulty: "kolay",
        emoji: "🦵",
        benefits: ["Pelvik kan akışını yatıştırır", "Yorgunluğu giderir", "Anksiyeteyi azaltır"],
        steps: [
          "Bir duvarın yanına sırtüstü uzan.",
          "Bacaklarını duvara dayayarak yukarı uzat (90°).",
          "Kalçanın altına ince bir yastık koyabilirsin.",
          "Gözlerini kapat, doğal nefes al, 5-10 dk kal.",
        ],
        caution: "Ağır kanama varsa kalçanı yükseltme, düz uzan.",
      },
    ],
  },
  {
    id: "pelvik-taban",
    title: "Pelvik Taban Egzersizleri",
    subtitle: "Kegel ve nazik güçlendirme",
    icon: HeartPulse,
    tone: "from-fairy-mint/40 to-primary/10 border-primary/40",
    forPhases: ["follicular", "ovulation", "luteal"],
    exercises: [
      {
        id: "kegel-basic",
        title: "Temel Kegel",
        duration: "5 dk",
        difficulty: "kolay",
        emoji: "✨",
        benefits: ["Pelvik tabanı güçlendirir", "İdrar kontrolünü iyileştirir", "Cinsel sağlığa katkı sağlar"],
        steps: [
          "Rahat bir pozisyonda otur ya da uzan.",
          "İdrarını tutar gibi pelvik taban kaslarını içeri ve yukarı çek.",
          "5 saniye sık, 5 saniye gevşet.",
          "10 tekrar, günde 2-3 set yap.",
        ],
        caution: "Karın, kalça veya bacak kaslarını kasma — sadece pelvik taban.",
      },
      {
        id: "bridge",
        title: "Köprü Pozu",
        duration: "3 dk",
        difficulty: "orta",
        emoji: "🌉",
        benefits: ["Pelvik tabanı ve kalçayı güçlendirir", "Bel ağrısını azaltır"],
        steps: [
          "Sırtüstü uzan, dizleri bük, ayaklar yere düz.",
          "Nefes vererek kalçanı yukarı kaldır.",
          "Yukarıda pelvik tabanı 3 saniye sık.",
          "Yavaşça in. 10-12 tekrar.",
        ],
      },
      {
        id: "happy-baby",
        title: "Mutlu Bebek",
        duration: "2 dk",
        difficulty: "kolay",
        emoji: "👶",
        benefits: ["Pelvik bölgeyi açar", "Bel gerginliğini çözer"],
        steps: [
          "Sırtüstü uzan, dizleri göğsüne çek.",
          "Ayak tabanlarının dış kenarlarını tut.",
          "Dizleri koltuk altlarına doğru indir.",
          "Hafifçe yana sallan, 1-2 dk kal.",
        ],
      },
    ],
  },
  {
    id: "nefes",
    title: "Nefes & Gevşeme",
    subtitle: "Sancı ve stres için rehberli nefes",
    icon: Wind,
    tone: "from-fairy-lavender/30 to-fairy-lavender/10 border-fairy-lavender/50",
    forPhases: ["menstrual", "luteal"],
    exercises: [
      {
        id: "478",
        title: "4-7-8 Nefesi",
        duration: "3 dk",
        difficulty: "kolay",
        emoji: "🌬️",
        benefits: ["Sinir sistemini sakinleştirir", "Ağrı algısını azaltır", "Uykuya geçişe yardımcı"],
        steps: [
          "Rahat otur, dilini üst damağa yasla.",
          "Burnundan 4 saniye nefes al.",
          "7 saniye nefesini tut.",
          "Ağzından 8 saniye boyunca üfle. 4 tekrar yap.",
        ],
      },
      {
        id: "box-breath",
        title: "Kutu Nefesi",
        duration: "4 dk",
        difficulty: "kolay",
        emoji: "📦",
        benefits: ["Odaklanmayı artırır", "Kaygıyı düşürür"],
        steps: [
          "4 saniye nefes al.",
          "4 saniye tut.",
          "4 saniye ver.",
          "4 saniye boş kal. 4-6 tur tekrarla.",
        ],
      },
    ],
  },
];

export default function HealingGrove() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<"menstrual" | "follicular" | "ovulation" | "luteal" | null>(null);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [openEx, setOpenEx] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("cycle_entries")
        .select("start_date")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false })
        .limit(1);
      if (data && data[0]) {
        const day = differenceInDays(new Date(), parseISO(data[0].start_date)) + 1;
        if (day <= 5) setPhase("menstrual");
        else if (day <= 13) setPhase("follicular");
        else if (day <= 16) setPhase("ovulation");
        else setPhase("luteal");
      }
    })();
  }, [user]);

  const phaseLabel: Record<string, string> = {
    menstrual: "menstrüel faz",
    follicular: "foliküler faz",
    ovulation: "ovulasyon",
    luteal: "luteal faz",
  };

  const recommended = phase ? categories.filter((c) => c.forPhases.includes(phase)) : [];

  return (
    <div className="px-5 pt-10 pb-24">
      <header className="text-center mb-6 relative">
        <FairyMark
          variant="lavender"
          className="absolute right-0 top-0 w-20 h-20 animate-float-slow"
        />
        <h1 className="font-display text-4xl text-secondary tracking-wide">Şifa Korusu</h1>
        <p className="font-fairy text-2xl text-primary mt-1">Bedenini Dinle</p>
        <p className="font-display italic text-secondary/70 text-sm mt-3 max-w-xs mx-auto">
          Döngünün her mevsiminde sana iyi gelecek nazik hareketler.
        </p>
        <div className="my-5 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-parchment-edge" />
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="h-px w-12 bg-parchment-edge" />
        </div>
      </header>


      {/* Phase-aware reminder */}
      {phase && (
        <div className="fairy-card p-4 mb-6 bg-gradient-meadow">
          <p className="font-fairy text-lg text-secondary/80">bugün için fısıltı</p>
          <p className="font-display text-lg text-secondary mt-1">
            {phaseLabel[phase]}dasın — aşağıdaki patikalar bugün sana iyi gelir.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {recommended.map((c) => (
              <button
                key={c.id}
                onClick={() => setOpenCat(c.id)}
                className="text-xs font-body bg-card border border-primary/40 text-secondary px-3 py-1 rounded-full hover:bg-primary/10"
              >
                {c.title} →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((c) => {
          const Icon = c.icon;
          const isOpen = openCat === c.id;
          return (
            <div
              key={c.id}
              className={`fairy-card overflow-hidden border-2 bg-gradient-to-br ${c.tone}`}
            >
              <button
                onClick={() => {
                  setOpenCat(isOpen ? null : c.id);
                  setOpenEx(null);
                }}
                className="w-full p-5 flex items-center gap-4 text-left"
              >
                <div className="bg-card/80 rounded-full p-3">
                  <Icon className="w-6 h-6 text-secondary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-2xl text-secondary leading-tight">{c.title}</h2>
                  <p className="font-body text-xs text-secondary/70 mt-0.5">{c.subtitle}</p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-secondary/60 transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-2">
                  {c.exercises.map((ex) => {
                    const exOpen = openEx === ex.id;
                    return (
                      <div key={ex.id} className="bg-card/90 rounded-xl border border-border/60">
                        <button
                          onClick={() => setOpenEx(exOpen ? null : ex.id)}
                          className="w-full p-3 flex items-center gap-3 text-left"
                        >
                          <span className="text-2xl">{ex.emoji}</span>
                          <div className="flex-1">
                            <div className="font-display text-lg text-secondary leading-tight">
                              {ex.title}
                            </div>
                            <div className="flex gap-3 mt-0.5 text-[11px] font-body text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {ex.duration}
                              </span>
                              <span className="capitalize">• {ex.difficulty}</span>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 text-secondary/50 transition-transform ${
                              exOpen ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {exOpen && (
                          <div className="px-4 pb-4 pt-1 border-t border-border/40">
                            <p className="font-fairy text-base text-primary mt-2">faydaları</p>
                            <ul className="list-disc list-inside text-sm font-body text-secondary/80 space-y-0.5">
                              {ex.benefits.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>

                            <p className="font-fairy text-base text-primary mt-3">nasıl yapılır</p>
                            <ol className="list-decimal list-inside text-sm font-body text-secondary/85 space-y-1">
                              {ex.steps.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ol>

                            {ex.caution && (
                              <div className="mt-3 flex gap-2 items-start bg-fairy-yellow/20 border border-fairy-yellow/50 rounded-lg p-2">
                                <AlertTriangle className="w-4 h-4 text-secondary/70 shrink-0 mt-0.5" />
                                <p className="text-xs font-body text-secondary/80">{ex.caution}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] font-body text-center text-muted-foreground mt-8 max-w-xs mx-auto">
        Bu içerik tıbbi tavsiye değildir. Hamilelik, kronik rahatsızlık veya yaralanma durumunda
        doktoruna danış.
      </p>

      <p className="font-fairy text-center text-xl text-secondary/50 mt-6">
        ~ bedenine nazik ol ~
      </p>

      <div className="mt-6 text-center">
        <Link to="/app" className="font-display text-secondary/70 underline-offset-4 hover:underline">
          ← Yuvaya dön
        </Link>
      </div>
    </div>
  );
}
