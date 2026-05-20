import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Info, Hand, AlertCircle, Stethoscope, Sparkles } from "lucide-react";

type Section = "info" | "exam" | "symptoms" | "diagnosis";

const sections: { id: Section; label: string; icon: any; sub: string }[] = [
  { id: "info", label: "Bilgilendirme", icon: Info, sub: "neden önemli" },
  { id: "exam", label: "Kendi Kendine Muayene", icon: Hand, sub: "KKMM adımları" },
  { id: "symptoms", label: "Belirtiler", icon: AlertCircle, sub: "nelere dikkat" },
  { id: "diagnosis", label: "Teşhis & Tedavi", icon: Stethoscope, sub: "yol haritası" },
];

export default function BreastCancer() {
  const [active, setActive] = useState<Section>("info");

  return (
    <div
      className="min-h-[100dvh] pb-24"
      style={{
        background:
          "linear-gradient(180deg, hsl(340 70% 94%) 0%, hsl(340 55% 88%) 100%)",
      }}
    >
      <div className="px-5 pt-8">
        <Link
          to="/app/star"
          className="inline-flex items-center gap-1 text-sm text-secondary/70 font-body"
        >
          <ArrowLeft className="w-4 h-4" /> yıldız parşömeni
        </Link>

        <header className="text-center mt-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/60 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-fairy-pink" />
            <span className="font-fairy text-base text-secondary/80">pembe kurdele</span>
          </div>
          <h1 className="font-display text-4xl text-secondary tracking-wide mt-2">
            Meme Kanseri
          </h1>
          <p className="font-display italic text-secondary/70 text-sm mt-2 max-w-xs mx-auto">
            Erken teşhis, hayat kurtarır. Ayda bir kendine 5 dakika ayır.
          </p>
        </header>

        {/* Tab pills */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`fairy-card p-3 text-left border transition-all ${
                  isActive
                    ? "bg-card border-fairy-pink shadow-md"
                    : "bg-card/50 border-card/30"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-1 ${
                    isActive ? "text-fairy-pink" : "text-secondary/60"
                  }`}
                  strokeWidth={1.5}
                />
                <div className="font-display text-sm leading-tight text-secondary">
                  {s.label}
                </div>
                <div className="font-fairy text-sm text-secondary/60 leading-none">
                  {s.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="fairy-card bg-card/85 backdrop-blur p-5 border border-fairy-pink/40">
          {active === "info" && <InfoPanel />}
          {active === "exam" && <ExamPanel />}
          {active === "symptoms" && <SymptomsPanel />}
          {active === "diagnosis" && <DiagnosisPanel />}
        </div>

        <p className="font-fairy text-center text-xl text-secondary/50 mt-8 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> kendine şefkatle dokun <Sparkles className="w-4 h-4" />
        </p>
      </div>
    </div>
  );
}

function InfoPanel() {
  const facts = [
    { stat: "1/8", text: "Her 8 kadından 1'i hayatı boyunca meme kanseri ile karşılaşır." },
    { stat: "%40", text: "1989'dan bu yana erken teşhis sayesinde ölüm oranları %40 azaldı." },
    { stat: "%100", text: "Erken evrede yakalanırsa 5 yıllık sağ kalım oranı neredeyse %100." },
    { stat: "40+", text: "40 yaşından itibaren yılda bir mamografi önerilir." },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl text-secondary">Neden Bilmeliyim?</h2>
      <p className="font-body text-sm text-foreground/80 mt-2 leading-relaxed">
        Meme kanseri, meme hücrelerinin kontrolsüz büyümesiyle başlar. Düzenli farkındalık,
        aylık kendi kendine muayene ve yıllık kontroller; erken teşhisin üç anahtarıdır.
      </p>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {facts.map((f) => (
          <div
            key={f.stat}
            className="rounded-2xl p-3 bg-fairy-pink/15 border border-fairy-pink/30"
          >
            <div className="font-display text-3xl text-secondary leading-none">{f.stat}</div>
            <div className="font-body text-[11px] text-foreground/75 mt-1 leading-snug">
              {f.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamPanel() {
  const steps = [
    {
      title: "Aynanın karşısında",
      body:
        "Ellerin yanda, sonra kalçalarda, sonra başının üstünde olacak şekilde göğüslerine bak. Asimetri, çöküntü, çatlama, renk değişimi var mı kontrol et.",
    },
    {
      title: "Parmak uçlarınla",
      body:
        "Üç parmağının uçlarıyla daireler çizerek tüm meme dokusunu tara. Koltuk altını da unutma.",
    },
    {
      title: "Hafif baskı uygulayarak",
      body:
        "Hafif, orta ve derin baskılarla aynı bölgeyi üç farklı katmanda hisset.",
    },
    {
      title: "Kitle oluşumunu ara",
      body:
        "Bezelye ya da fındık büyüklüğünde, sert, hareketsiz bir kitle hissedersen not al.",
    },
    {
      title: "Akıntıyı gözlemle",
      body:
        "Meme ucuna hafif bastırarak berrak, kanlı ya da renkli bir akıntı olup olmadığına bak.",
    },
    {
      title: "Yatarken & duşta",
      body:
        "Yatar pozisyonda omzun altına yastık koyup tekrarla. Duşta sabunlu el daha kolay kayar — ideal zaman.",
    },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl text-secondary">KKMM — Adım Adım</h2>
      <p className="font-body text-sm text-foreground/80 mt-2 leading-relaxed">
        Adetinin bitiminden <span className="font-semibold">5–7 gün sonra</span> uygula.
        Menopozdaysan her ayın aynı gününü seç.
      </p>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="flex gap-3 p-3 rounded-2xl bg-fairy-pink/10 border border-fairy-pink/25"
          >
            <div className="shrink-0 w-9 h-9 rounded-full bg-fairy-pink/40 flex items-center justify-center font-display text-lg text-secondary">
              {i + 1}
            </div>
            <div>
              <div className="font-display text-base text-secondary leading-tight">
                {s.title}
              </div>
              <div className="font-body text-[13px] text-foreground/75 leading-snug mt-0.5">
                {s.body}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SymptomsPanel() {
  const items = [
    "Meme ucunda içe dönme",
    "Meme ucundan akıntı (özellikle kanlı)",
    "Koltuk altında kitle ya da şişlik",
    "Memenin bir bölümünde şişme",
    "Tüm memede şişme veya boyut değişikliği",
    "Cilt çukurlaşması (portakal kabuğu görünümü)",
    "Memede ya da meme ucunda ağrı",
    "Cilt tahrişi, kızarıklık ya da pul pul dökülme",
  ];
  return (
    <div>
      <h2 className="font-display text-2xl text-secondary">Belirtiler</h2>
      <p className="font-body text-sm text-foreground/80 mt-2 leading-relaxed">
        Her belirti kanser anlamına gelmez — ama herhangi birini fark edersen
        <span className="font-semibold"> mutlaka bir hekime danış.</span>
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-2">
        {items.map((t) => (
          <li
            key={t}
            className="flex items-start gap-2 p-3 rounded-xl bg-fairy-pink/10 border border-fairy-pink/25"
          >
            <span className="mt-1 w-2 h-2 rounded-full bg-fairy-pink shrink-0" />
            <span className="font-body text-sm text-foreground/85">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DiagnosisPanel() {
  const diag = [
    { name: "Mamografi", body: "Düşük dozlu röntgenle erken evre kitleleri görüntüler." },
    { name: "Ultrasonografi", body: "Genç memelerde ve kistlerin ayrımında tercih edilir." },
    { name: "Biyopsi", body: "Şüpheli dokudan örnek alınıp incelenir — kesin tanı yöntemi." },
  ];
  const treat = [
    { name: "Cerrahi", body: "Lumpektomi ya da mastektomi ile tümör çıkarılır." },
    { name: "Radyoterapi", body: "Yüksek enerjili ışınlarla kalan hücreler hedeflenir." },
    { name: "Kemoterapi", body: "İlaçlarla vücudun her yerindeki hücreler tedavi edilir." },
    { name: "Hormonal tedavi", body: "Hormon duyarlı tümörlerde hormon etkisi engellenir." },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl text-secondary">Teşhis Yöntemleri</h2>
      <div className="mt-3 space-y-2">
        {diag.map((d) => (
          <div
            key={d.name}
            className="p-3 rounded-2xl bg-fairy-pink/10 border border-fairy-pink/25"
          >
            <div className="font-display text-base text-secondary">{d.name}</div>
            <div className="font-body text-[13px] text-foreground/75 leading-snug">
              {d.body}
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl text-secondary mt-5">Tedavi Yolları</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {treat.map((t) => (
          <div
            key={t.name}
            className="p-3 rounded-2xl bg-card border border-fairy-pink/30"
          >
            <div className="font-display text-base text-secondary leading-tight">
              {t.name}
            </div>
            <div className="font-body text-[12px] text-foreground/70 mt-1 leading-snug">
              {t.body}
            </div>
          </div>
        ))}
      </div>

      <p className="font-fairy text-lg text-secondary/70 text-center mt-5">
        tedavi planı her zaman kişiseldir — hekiminle birlikte karar verilir
      </p>
    </div>
  );
}
