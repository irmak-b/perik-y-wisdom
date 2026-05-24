import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Baby, HeartPulse, Brain, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FairyMark } from "@/components/FairyMark";


type CategoryKey = "bakim" | "izlenim" | "mental" | "lohusalik";

interface Article {
  title: string;
  steps: string[];
}

interface Category {
  key: CategoryKey;
  title: string;
  desc: string;
  icon: any;
  tone: string;
  articles: Article[];
}

const categories: Category[] = [
  {
    key: "bakim",
    title: "Bebek Bakımı",
    desc: "Emzirme, alt değiştirme, banyo",
    icon: Baby,
    tone: "bg-fairy-pink/20 border-fairy-pink/50",
    articles: [
      {
        title: "Emzirme pozisyonları",
        steps: [
          "Beşik tutuşu: Bebeğin başı dirseğinin iç kısmında, karın karına olacak şekilde yerleştir.",
          "Futbol tutuşu: Bebeği koltuk altında, ayakları sırtına doğru tut. Sezaryen sonrası rahattır.",
          "Yan yatış: Yan yatarak bebeği karşına al; gece beslenmeleri için idealdir.",
          "Bebeğin ağzının areolanın büyük kısmını kavradığından emin ol; sadece meme ucu yetmez.",
          "Her beslenmeden sonra bebeği omzuna alıp sırtını hafifçe sıvazlayarak gazını çıkar.",
        ],
      },
      {
        title: "Alt değiştirme adımları",
        steps: [
          "Temiz bez, ıslak mendil, pişik kremi ve değişim örtüsünü önceden hazırla.",
          "Bebeği sırt üstü yatır; kirli bezi aç ama hemen çekme.",
          "Önden arkaya doğru nazikçe temizle (özellikle kız bebeklerde idrar yolu enfeksiyonunu önler).",
          "Cildin tamamen kurumasını bekle, gerekirse ince bir pişik kremi uygula.",
          "Temiz bezi tak; bel kısmı göbek bağı düşene kadar göbeğin altında kalsın.",
        ],
      },
      {
        title: "Bebek banyosu",
        steps: [
          "Oda sıcaklığı 24-26°C, su sıcaklığı 37°C olmalı (dirseğinle test et).",
          "Göbek bağı düşene kadar sünger banyosu yap, ardından küvete geçebilirsin.",
          "Banyo 5-10 dakikayı geçmesin; bebeği asla yalnız bırakma.",
          "Başını ve boynunu kolunla destekle, diğer elinle yıka.",
          "Banyo sonrası yumuşak havluya sar, kıvrım yerlerini iyice kurula.",
        ],
      },
    ],
  },
  {
    key: "izlenim",
    title: "Bebek İzlenimi",
    desc: "Ruh hali, uyku, ağlama",
    icon: HeartPulse,
    tone: "bg-fairy-lavender/20 border-fairy-lavender/50",
    articles: [
      {
        title: "Uyku düzeni (0-12 ay)",
        steps: [
          "0-3 ay: Günde 14-17 saat, 2-3 saatlik aralıklarla. Gece-gündüz ayrımı henüz yok.",
          "3-6 ay: 12-15 saat. Akşam rutini (banyo, masaj, ninni) oluşturmaya başla.",
          "6-12 ay: 11-14 saat, genelde 2 gündüz uykusu. Yatış saati sabitlenmeli.",
          "Bebeği uykulu ama uyanıkken yatağa koy; kendi kendine uyumayı öğrensin.",
          "Yatak boş olsun: yastık, battaniye, oyuncak ani bebek ölümü riskini artırır.",
        ],
      },
      {
        title: "Ağlama dili",
        steps: [
          "Açlık: Ritmik, kısa molalı, emme hareketleri eşliğinde.",
          "Yorgunluk: Mızmız, esneme ve gözleri ovuşturma ile birlikte.",
          "Gaz/karın ağrısı: Aniden başlar, bacaklar karna çekilir, yüz kızarır.",
          "Uyaran fazlalığı: Sesli ortamlarda artar; sakin, loş bir yere al.",
          "Sevgi ihtiyacı: Kucağa alındığında hızla sakinleşir.",
        ],
      },
      {
        title: "Gelişim işaretleri",
        steps: [
          "2 ay: Gülümseme, sese tepki, başını kısa süreli dik tutma.",
          "4 ay: Eline aldığını ağzına götürme, kahkaha, yan dönme.",
          "6 ay: Destekli oturma, ek gıdaya geçiş, ismine tepki.",
          "9 ay: Emekleme, parmak kavraması, 'baba/mama' heceleri.",
          "12 ay: Destekli yürüme, ilk anlamlı kelimeler, basit komutları anlama.",
        ],
      },
    ],
  },
  {
    key: "mental",
    title: "Anne Mentalitesi",
    desc: "Duygusal sağlık ve dayanıklılık",
    icon: Brain,
    tone: "bg-primary/15 border-primary/40",
    articles: [
      {
        title: "Lohusalık hüznü vs depresyon",
        steps: [
          "Lohusalık hüznü (baby blues) ilk 2 hafta içinde görülür ve genelde kendiliğinden geçer.",
          "Belirtiler: Ağlama atakları, uyku bozukluğu, kaygı, ani duygu değişimleri.",
          "2 haftadan uzun süren çökkünlük, ilgisizlik, bebeğe bağlanamama hissi postpartum depresyon işareti olabilir.",
          "Kendine zarar verme veya bebeğe zarar verme düşüncesi varsa acilen uzman desteği al.",
          "Yalnız değilsin: Annelerin yaklaşık %15'i postpartum depresyon yaşar; tedavi edilebilir.",
        ],
      },
      {
        title: "Kendine alan açmak",
        steps: [
          "Günde 10 dakika sadece sana ait bir an yarat (çay, nefes, kısa yürüyüş).",
          "Yardım istemek zayıflık değil; eş, aile ve arkadaşlardan somut görevler iste.",
          "Mükemmel anne miti yok; 'yeterince iyi' anne olmak çocuk için en sağlıklısıdır.",
          "Sosyal medyayı kıyaslama aracı olmaktan çıkar; bilgi kaynağı olarak sınırla.",
          "Uyuyabildiğin her fırsatta uyu; ev işleri bekleyebilir.",
        ],
      },
    ],
  },
  {
    key: "lohusalik",
    title: "Lohusalık Dönemi",
    desc: "Doğum sonrası ilk 6 hafta",
    icon: Sparkles,
    tone: "bg-secondary/10 border-secondary/40",
    articles: [
      {
        title: "Bedensel iyileşme",
        steps: [
          "Lohusalık kanaması (loşia) 4-6 hafta sürer; renk koyudan açığa döner.",
          "Sezaryen yarasını kuru ve temiz tut; kızarıklık, akıntı veya ateş varsa doktora başvur.",
          "Normal doğum sonrası dikiş bölgesini ılık suyla yıka, havluyla kurula.",
          "İlk 6 hafta ağır kaldırma ve yoğun egzersizden kaçın; hafif yürüyüşle başla.",
          "Bol su iç, lifli gıdalar tüket; kabızlık çok yaygındır.",
        ],
      },
      {
        title: "Beslenme önerileri",
        steps: [
          "Emziren annelerin günlük yaklaşık 450-500 ek kaloriye ihtiyacı vardır.",
          "Protein (yumurta, tavuk, baklagil), kalsiyum (yoğurt, peynir) ve demir (kırmızı et, ıspanak) önemlidir.",
          "Günde en az 2-2.5 litre su iç; süt verimini destekler.",
          "Kafein ve çayı sınırla (günde 1-2 fincan); bebek huzursuzluğunu artırabilir.",
          "Alkol ve sigaradan kaçın; ikisi de süte geçer.",
        ],
      },
      {
        title: "Ne zaman doktora?",
        steps: [
          "38°C üzeri ateş.",
          "Aşırı kanama (saatte 1 ped'den fazla) veya pıhtı.",
          "Memede sertlik, kızarıklık, ateşle birlikte (mastit şüphesi).",
          "Bacakta tek taraflı şişlik, kızarıklık, ağrı (tromboz şüphesi).",
          "Yoğun üzüntü, umutsuzluk veya bebeğe/kendine zarar verme düşünceleri.",
        ],
      },
    ],
  },
];

export default function LifeNest() {
  const { user } = useAuth();
  const [stage, setStage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<CategoryKey | null>(null);
  const [articleIdx, setArticleIdx] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("life_stage")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setStage(data?.life_stage ?? null);
        setLoading(false);
      });
  }, [user]);

  if (loading) return null;
  if (stage !== "pregnancy" && stage !== "postpartum") {
    return <Navigate to="/app" replace />;
  }

  const activeCat = categories.find((c) => c.key === active);

  return (
    <div className="px-5 pt-10 pb-6">
      {!activeCat ? (
        <>
          <p className="font-fairy text-3xl text-primary leading-none">yaşam</p>
          <h1 className="font-display text-4xl text-secondary -mt-1">Yuvası</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Annelik ve bebek bakımı için adım adım rehberler.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.key}
                  onClick={() => {
                    setActive(c.key);
                    setArticleIdx(0);
                  }}
                  className={`fairy-card p-4 h-36 flex flex-col justify-between border text-left ${c.tone}`}
                >
                  <Icon className="w-6 h-6 text-secondary" strokeWidth={1.5} />
                  <div>
                    <div className="font-display text-base leading-tight text-secondary">
                      {c.title}
                    </div>
                    <div className="font-body text-[11px] text-muted-foreground mt-1">
                      {c.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Link
            to="/app"
            className="block text-center mt-8 text-sm text-primary font-display underline-offset-4 hover:underline"
          >
            ← Yuva'ya dön
          </Link>
        </>
      ) : (
        <>
          <button
            onClick={() => setActive(null)}
            className="flex items-center gap-1 text-sm text-secondary/80 font-display"
          >
            <ChevronLeft className="w-4 h-4" /> Kategoriler
          </button>

          <h2 className="font-display text-3xl text-secondary mt-3">
            {activeCat.title}
          </h2>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {activeCat.articles.map((a, i) => (
              <button
                key={i}
                onClick={() => setArticleIdx(i)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-display border transition ${
                  i === articleIdx
                    ? "bg-secondary text-primary-foreground border-secondary"
                    : "bg-background/40 text-secondary border-border/60"
                }`}
              >
                {a.title}
              </button>
            ))}
          </div>

          <div className="fairy-card p-5 mt-4 bg-gradient-meadow">
            <h3 className="font-display text-xl text-secondary">
              {activeCat.articles[articleIdx].title}
            </h3>
            <ol className="mt-4 space-y-3">
              {activeCat.articles[articleIdx].steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/30 text-secondary font-display text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="font-body text-sm text-secondary/90 leading-relaxed">
                    {s}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex justify-between mt-5">
            <button
              disabled={articleIdx === 0}
              onClick={() => setArticleIdx((i) => Math.max(0, i - 1))}
              className="flex items-center gap-1 text-sm font-display text-secondary disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Önceki
            </button>
            <button
              disabled={articleIdx === activeCat.articles.length - 1}
              onClick={() =>
                setArticleIdx((i) =>
                  Math.min(activeCat.articles.length - 1, i + 1)
                )
              }
              className="flex items-center gap-1 text-sm font-display text-secondary disabled:opacity-30"
            >
              Sonraki <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
