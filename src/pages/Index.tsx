import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import parchment from "@/assets/parchment-bg.jpg";
import fairies from "@/assets/fairies-group.png";

const Index = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && user) nav("/app");
  }, [user, loading, nav]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundImage: `url(${parchment})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <main className="max-w-md text-center">
        <img src={fairies} alt="Peri köyü illüstrasyonu" className="w-full h-auto opacity-95 animate-float" />
        <p className="font-fairy text-3xl text-primary mt-4">welcome to</p>
        <h1 className="font-display text-6xl text-secondary tracking-tight ink-shadow -mt-2">
          HEARTH
        </h1>
        <p className="font-display italic text-secondary/70 mt-3 text-lg leading-snug">
          Health · Empowerment · Awareness<br />Ritual · Tracking · Harmony
        </p>
        <p className="font-body text-sm text-muted-foreground mt-5 max-w-sm mx-auto">
          Peri köyünde kendi mevsiminle uyumlu yaşamayı öğren. Döngünü takip et, semptomlarını anla, bilgelik kütüphanesinden ilham al.
        </p>
        <div className="mt-7 space-y-3">
          <Button asChild className="w-full bg-secondary hover:bg-secondary/90 rounded-full h-12 font-display text-base">
            <Link to="/auth">Köye gir ✨</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
