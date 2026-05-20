import { Link } from "react-router-dom";
import { Sparkles, Heart, Flower2 } from "lucide-react";

export default function StarScroll() {
  return (
    <div className="px-5 pt-10 pb-24">
      <header className="text-center mb-8">
        <p className="font-fairy text-2xl text-primary">yıldız parşömeni</p>
        <h1 className="font-display text-4xl text-secondary tracking-wide">Bedenini Tanı</h1>
        <p className="font-display italic text-secondary/70 text-sm mt-3 max-w-xs mx-auto">
          Erken fark etmek, kendine en büyük armağanın. Hangi parşömeni açmak istersin?
        </p>
        <div className="my-5 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-parchment-edge" />
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="h-px w-12 bg-parchment-edge" />
        </div>
      </header>

      <div className="space-y-5">
        <Link to="/app/star/breast" className="block">
          <div
            className="fairy-card relative overflow-hidden p-6 min-h-44 border-2"
            style={{
              background: "linear-gradient(135deg, hsl(340 70% 92%), hsl(340 60% 82%))",
              borderColor: "hsl(340 60% 70%)",
            }}
          >
            <Heart className="absolute -right-4 -bottom-4 w-32 h-32 text-fairy-pink/30" strokeWidth={1} />
            <div className="relative">
              <p className="font-fairy text-2xl text-secondary/70">pembe kurdele</p>
              <h2 className="font-display text-3xl text-secondary leading-tight mt-1">
                Meme Kanseri
              </h2>
              <p className="font-body text-sm text-secondary/75 mt-3 max-w-[16rem]">
                Bilgilendirme · Kendi kendine muayene · Belirtiler · Teşhis & tedavi
              </p>
              <span className="inline-block mt-4 font-fairy text-lg text-secondary underline underline-offset-4">
                parşömeni aç →
              </span>
            </div>
          </div>
        </Link>

        <Link to="/app/star/cervical" className="block">
          <div
            className="fairy-card relative overflow-hidden p-6 min-h-44 border-2 opacity-90"
            style={{
              background: "linear-gradient(135deg, hsl(22 75% 90%), hsl(20 65% 78%))",
              borderColor: "hsl(20 65% 65%)",
            }}
          >
            <Flower2 className="absolute -right-4 -bottom-4 w-32 h-32 text-secondary/20" strokeWidth={1} />
            <div className="relative">
              <p className="font-fairy text-2xl text-secondary/70">şeftali tomurcuğu</p>
              <h2 className="font-display text-3xl text-secondary leading-tight mt-1">
                Rahim Kanseri
              </h2>
              <p className="font-body text-sm text-secondary/75 mt-3 max-w-[16rem]">
                HPV · Smear · Belirtiler · Korunma yolları
              </p>
              <span className="inline-block mt-4 font-fairy text-lg text-secondary/80 italic">
                yakında açılıyor ✦
              </span>
            </div>
          </div>
        </Link>
      </div>

      <p className="font-fairy text-center text-xl text-secondary/50 mt-10">
        ~ bilgi, en sessiz şifadır ~
      </p>
    </div>
  );
}
