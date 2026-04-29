import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import wisdomCardsImg from "@/assets/wisdom-cards.png";

interface Card {
  id: string;
  letter: string;
  title: string;
  subtitle: string | null;
  category: string;
  body: string;
  fairy_name: string | null;
  accent_color: string;
}

const accentMap: Record<string, string> = {
  lime: "from-primary/30 to-fairy-green/20",
  navy: "from-fairy-navy/30 to-secondary/20",
  cream: "from-fairy-yellow/30 to-parchment-deep/30",
  lavender: "from-fairy-lavender/30 to-fairy-pink/20",
};

// Approximate crops from the 4×3 fairy card grid sprite
const cardCrops: Record<string, { x: number; y: number }> = {
  A: { x: 0, y: 0 }, C: { x: 1, y: 0 }, D: { x: 2, y: 0 }, K: { x: 3, y: 0 },
  M: { x: 0, y: 1 }, P: { x: 1, y: 1 }, S: { x: 2, y: 1 }, Q: { x: 3, y: 1 },
  L: { x: 0, y: 2 }, B: { x: 1, y: 2 }, R: { x: 2, y: 2 }, T: { x: 3, y: 2 },
};

export default function WisdomLibrary() {
  const [cards, setCards] = useState<Card[]>([]);
  const [active, setActive] = useState<Card | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    supabase.from("wisdom_cards").select("*").order("sort_order").then(({ data }) => {
      if (data) setCards(data as Card[]);
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="h-[100dvh] overflow-y-auto px-5 pt-8 pb-32">
      <header className="text-center mb-2">
        <p className="font-fairy text-2xl text-primary">a — z</p>
        <h1 className="font-display text-4xl text-secondary tracking-wide">Bilgelik Kütüphanesi</h1>
        <p className="font-display italic text-secondary/70 text-sm mt-2 max-w-xs mx-auto">
          Her peri bir konunun bekçisi. Bir kart seç, hikâyesini dinle.
        </p>
        <div className="my-5 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-parchment-edge" />
          <span className="font-fairy text-xl text-secondary/60">peri kartları</span>
          <span className="h-px w-12 bg-parchment-edge" />
        </div>
      </header>

      {/* Wired-style staggered grid with parallax */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-5">
        {cards.map((c, i) => {
          const crop = cardCrops[c.letter] ?? { x: 0, y: 0 };
          const offset = i % 2 === 0 ? "translate-y-0" : "translate-y-8";
          const parallax = scrollY * (i % 3 === 0 ? 0.04 : 0.02) * (i % 2 === 0 ? -1 : 1);
          const tone = accentMap[c.accent_color] ?? accentMap.lime;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={`group relative ${offset}`}
              style={{ transform: `translateY(${parallax}px)` }}
            >
              <div className={`fairy-card overflow-hidden bg-gradient-to-br ${tone} border-parchment-edge/60`}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${wisdomCardsImg})`,
                      backgroundSize: "400% 300%",
                      backgroundPosition: `${(crop.x / 3) * 100}% ${(crop.y / 2) * 100}%`,
                    }}
                  />
                  <div className="absolute top-2 left-2 w-9 h-9 rounded-full bg-card/95 backdrop-blur flex items-center justify-center font-display text-lg text-secondary shadow-md">
                    {c.letter}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-card/95 via-card/70 to-transparent p-3">
                    <div className="font-display text-base leading-tight text-secondary">{c.title}</div>
                    <div className="font-fairy text-base text-primary leading-none mt-0.5">{c.subtitle}</div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="font-fairy text-center text-xl text-secondary/50 mt-12">
        ~ köyün bilgeliği büyümeye devam edecek ~
      </p>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="bg-card border-border/60 max-w-md p-0 overflow-hidden">
          {active && (
            <div>
              <div
                className={`relative h-56 bg-gradient-to-br ${accentMap[active.accent_color] ?? accentMap.lime}`}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${wisdomCardsImg})`,
                    backgroundSize: "400% 300%",
                    backgroundPosition: `${((cardCrops[active.letter]?.x ?? 0) / 3) * 100}% ${((cardCrops[active.letter]?.y ?? 0) / 2) * 100}%`,
                  }}
                />
                <button
                  onClick={() => setActive(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-secondary" />
                </button>
                <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-card/95 flex items-center justify-center font-display text-2xl text-secondary shadow-md">
                  {active.letter}
                </div>
              </div>
              <div className="p-6">
                <DialogTitle className="font-display text-3xl text-secondary leading-tight">
                  {active.title}
                </DialogTitle>
                <p className="font-fairy text-2xl text-primary mt-0">{active.subtitle}</p>
                {active.fairy_name && (
                  <p className="font-display italic text-sm text-muted-foreground mt-1">
                    bekçisi · {active.fairy_name}
                  </p>
                )}
                <p className="font-body text-[15px] leading-relaxed text-foreground/85 mt-4">
                  {active.body}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
