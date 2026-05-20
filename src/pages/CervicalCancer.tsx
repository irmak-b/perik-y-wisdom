import { Link } from "react-router-dom";
import { ArrowLeft, Flower2 } from "lucide-react";

export default function CervicalCancer() {
  return (
    <div
      className="min-h-[100dvh] pb-24"
      style={{
        background:
          "linear-gradient(180deg, hsl(22 75% 92%) 0%, hsl(20 65% 84%) 100%)",
      }}
    >
      <div className="px-5 pt-8">
        <Link
          to="/app/star"
          className="inline-flex items-center gap-1 text-sm text-secondary/70 font-body"
        >
          <ArrowLeft className="w-4 h-4" /> yıldız parşömeni
        </Link>

        <header className="text-center mt-8">
          <Flower2 className="w-12 h-12 text-secondary/40 mx-auto" strokeWidth={1.2} />
          <p className="font-fairy text-2xl text-secondary/70 mt-3">şeftali tomurcuğu</p>
          <h1 className="font-display text-4xl text-secondary tracking-wide mt-1">
            Rahim Kanseri
          </h1>
          <p className="font-display italic text-secondary/70 text-sm mt-3 max-w-xs mx-auto">
            Bu parşömen henüz yazılıyor. Çok yakında HPV, smear ve korunma yollarıyla burada olacak.
          </p>
        </header>
      </div>
    </div>
  );
}
