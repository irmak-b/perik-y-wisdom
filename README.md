# HEARTH 🌿✨

**H**ealth · **E**mpowerment · **A**wareness · **R**itual · **T**racking · **H**armony

Kadın sağlığı ve döngü takibi için tasarlanmış, peri köyü temalı bir mobile-first web uygulaması. Kullanıcılar regl döngülerini takip eder, yaşam evrelerine (menstrüel, perimenopoz, menopoz, PCOS, hamilelik, postpartum) göre kişiselleştirilmiş bir deneyim yaşar ve "Bilgelik Kütüphanesi" peri kartları üzerinden A–Z konularda bilgi keşfeder.

---

## 📱 Genel Bakış

- **Tip:** Mobile-first responsive web uygulaması (Capacitor ile native iOS/Android'e dönüştürülmek üzere tasarlandı)
- **Dil:** Türkçe
- **Hedef cihaz:** Telefon (max-width container, alt navigasyon barı)
- **Estetik:** Parşömen arka plan, el yazısı + display font kombinasyonu, peri illüstrasyonları, yumuşak yeşil/lavanta/pembe pastel paleti

---

## 🛠️ Teknoloji Stack'i

| Katman | Teknoloji |
|---|---|
| Framework | React 18 + Vite 5 + TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Routing | React Router v6 |
| State / Data | TanStack Query, React Context (Auth) |
| Forms | React Hook Form + Zod |
| Icons | lucide-react |
| Tarih | date-fns (Türkçe locale) |
| Bildirim | Sonner (toast) |
| Backend | **Lovable Cloud** (Supabase altyapısı: PostgreSQL + Auth + RLS) |
| Test | Vitest + Testing Library |

---

## 🗂️ Klasör Yapısı

```
src/
├── App.tsx                      # Root + route tanımları + provider'lar
├── main.tsx                     # Vite entry
├── index.css                    # Tasarım sistemi (HSL token'ları, gradient, shadow)
├── pages/
│   ├── Index.tsx                # Landing / yönlendirici
│   ├── Auth.tsx                 # Giriş / kayıt
│   ├── Onboarding.tsx           # 3 adımlı onboarding (yaşam evresi, doğum yılı, döngü uzunluğu)
│   ├── AppRoot.tsx              # Korumalı layout (auth + onboarding kontrolü, MobileShell)
│   ├── Home.tsx                 # Ana sayfa (yuva): bugünkü faz + modül kartları
│   ├── CycleTracker.tsx         # Mevsimler Patikası — döngü takvimi
│   ├── WisdomLibrary.tsx        # Bilgelik Kütüphanesi — A–Z peri kartları
│   ├── Profile.tsx              # Kullanıcı profili + çıkış
│   └── NotFound.tsx
├── components/
│   ├── MobileShell.tsx          # Mobil çerçeve + alt nav
│   ├── NavLink.tsx              # Bottom nav item
│   ├── FairyMark.tsx            # Peri illüstrasyonu (mint / pink variant)
│   └── ui/                      # shadcn bileşenleri
├── hooks/
│   ├── useAuth.tsx              # Supabase auth context (signIn, signUp, signOut)
│   └── use-mobile.tsx
├── integrations/supabase/
│   ├── client.ts                # ⚠ otomatik üretilir, dokunma
│   └── types.ts                 # ⚠ otomatik üretilir, dokunma
└── assets/                      # Peri illüstrasyonları, parşömen arka plan, kart görselleri
```

---

## 🧭 Sayfa Sayfa İşlevsellik

### `/` — Index (Landing)
Kullanıcı durumuna göre yönlendirme yapar:
- Giriş yapmamış → `/auth`
- Giriş yapmış + onboarding tamamlanmamış → `/onboarding`
- Giriş yapmış + onboarding tamam → `/app`

### `/auth` — Auth
E-posta + şifre ile **kayıt** ve **giriş**. Supabase Auth kullanır. Başarılı işlem sonrası uygun rotaya yönlendirir.

### `/onboarding` — Onboarding (3 adım)
1. **Hoş geldin** ekranı (HEARTH manifestosu)
2. **Yaşam evresi** seçimi: menstrual / perimenopause / menopause / pcos / pregnancy / postpartum
3. **Detaylar:** doğum yılı + ortalama döngü uzunluğu (gün)

Tamamlanınca `profiles` tablosuna yazar ve `onboarding_completed = true` set eder.

### `/app` — AppRoot (Layout)
Korumalı layout. Auth + onboarding kontrolü yapar; geçerse `MobileShell` (parşömen zemin + alt nav) içinde alt rotaları render eder.

#### `/app` (index) — Home (Yuva)
- Kişisel selamlama + bugünün tarihi
- **Bugünkü faz kartı:** Son regl başlangıcına göre döngü gününü hesaplar ve fazı söyler:
  - Gün 1–5 → Menstrüel 🌙
  - Gün 6–13 → Foliküler 🌱
  - Gün 14–16 → Ovulasyon ✨
  - Gün 17+ → Luteal 🍂
- **Modül kartları:** Mevsimler Patikası, Bilgelik Kütüphanesi (Şifa Korusu & Yıldız Parşömeni "yakında")

#### `/app/cycle` — CycleTracker (Mevsimler Patikası)
- Aylık takvim görünümü (Pzt başlangıç, Türkçe locale)
- Her güne tıklayarak ağrı seviyesi (0–10) + not + regl başlangıcı kaydı
- Faz renkleri ile günleri renklendirir; bugünü ring ile vurgular
- "Bugün regl başladı" hızlı kayıt butonu
- Veri: `cycle_entries` + `symptom_logs` tabloları

#### `/app/wisdom` — WisdomLibrary (Bilgelik Kütüphanesi)
- A–Z peri kartlarından oluşan staggered grid (parallax scroll efekti)
- `wisdom_cards` tablosundan veri çeker (letter, title, subtitle, body, fairy_name, accent_color)
- Her kart bir konunun "bekçisi" — tıklanınca dialog'da detay açılır
- Sprite (`wisdom-cards.png`) üzerinden 4×3 grid'den background-position ile illüstrasyon kırpar

#### `/app/profile` — Profile
Ad, e-posta, yaşam evresi, doğum yılı, ortalama döngü bilgisini gösterir + "Köyden çık" (signOut).

---

## 🗄️ Veritabanı Şeması (Lovable Cloud / Supabase)

Tüm tablolarda **Row-Level Security (RLS)** açık, kullanıcılar yalnızca kendi kayıtlarına erişebilir.

### `profiles`
| Kolon | Tip | Not |
|---|---|---|
| id | uuid (PK) | `auth.users.id` ile aynı |
| display_name | text | |
| life_stage | enum `life_stage` | menstrual / perimenopause / menopause / pcos / pregnancy / postpartum |
| birth_year | int | |
| avg_cycle_length | int | default 28 |
| avg_period_length | int | default 5 |
| onboarding_completed | bool | default false |
| created_at, updated_at | timestamptz | |

### `cycle_entries`
| Kolon | Tip |
|---|---|
| id | uuid (PK) |
| user_id | uuid (FK → auth.users) |
| start_date | date |
| end_date | date (nullable) |
| flow | enum `flow_intensity` (light/medium/heavy) |
| notes | text |
| created_at | timestamptz |

### `symptom_logs`
| Kolon | Tip |
|---|---|
| id | uuid (PK) |
| user_id | uuid |
| log_date | date |
| pain_level | int (0–10) |
| mood | text |
| symptoms | text[] |
| notes | text |
| created_at | timestamptz |
| **UNIQUE** | (user_id, log_date) |

### `wisdom_cards` (public, read-only içerik)
| Kolon | Tip |
|---|---|
| id | uuid (PK) |
| letter | text (A, B, C…) |
| title | text |
| subtitle | text |
| category | text |
| body | text |
| fairy_name | text |
| accent_color | text (lime/navy/cream/lavender) |
| sort_order | int |

### Enum'lar
- `life_stage`: menstrual, perimenopause, menopause, pcos, pregnancy, postpartum
- `flow_intensity`: light, medium, heavy

---

## 🎨 Tasarım Sistemi

`src/index.css` ve `tailwind.config.ts` içinde HSL semantic token'ları:

- **Renkler:** `--background` (parşömen krem), `--primary` (peri yeşili / lime), `--secondary` (lacivert), `--fairy-pink`, `--fairy-lavender`, `--fairy-yellow`, `--fairy-green`, `--fairy-navy`, `--parchment-edge`
- **Fontlar:** `font-display` (başlıklar), `font-fairy` (el yazısı vurgular), `font-body` (gövde metni)
- **Animasyonlar:** `animate-float`, `animate-float-slow`
- **Yardımcı sınıflar:** `.fairy-card` (yuvarlatılmış parşömen kart), `bg-gradient-meadow`

> ⚠ Bileşenlerde asla doğrudan `text-white`, `bg-black` gibi sınıflar kullanılmaz — her zaman semantic token.

---

## 🚀 Yerel Geliştirme

```bash
git clone <repo-url>
cd <project>
npm install
npm run dev          # http://localhost:8080
```

### Ortam Değişkenleri (`.env`)
Lovable Cloud tarafından **otomatik** sağlanır, manuel düzenleme yapma:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

### Komutlar
| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run preview` | Build'i önizle |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |

---

## 📲 Native Mobile App'e Çevirme (Capacitor)

Bu proje Capacitor ile iOS ve Android paketine dönüştürülmek üzere mobile-first olarak tasarlandı.

```bash
npm install @capacitor/core @capacitor/ios @capacitor/android
npm install -D @capacitor/cli
npx cap init "HEARTH" "app.lovable.hearth"
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap run ios       # Mac + Xcode gerekir
npx cap run android   # Android Studio gerekir
```

### Native'e Geçişte Dikkat Edilecekler
- **Auth redirect:** Supabase auth deep-link ayarlanmalı (`app.lovable.hearth://`)
- **Safe area:** `MobileShell` zaten alt navigasyon için padding bırakıyor; iOS notch için `env(safe-area-inset-*)` eklenmeli
- **localStorage:** Capacitor'da çalışır ama uzun vadeli oturum için `@capacitor/preferences`'a geçilebilir
- **Push notification:** Henüz yok — `@capacitor/push-notifications` ile döngü hatırlatmaları eklenebilir
- **Status bar:** `@capacitor/status-bar` ile parşömen rengiyle uyumlu hale getirilmeli
- **Splash screen:** Peri temasıyla özelleştirilmeli

---

## ✅ Mevcut Özellikler

- [x] E-posta/şifre ile kayıt & giriş
- [x] 3 adımlı onboarding (yaşam evresi seçimi)
- [x] Aylık döngü takvimi + faz renklendirmesi
- [x] Regl başlangıcı, ağrı seviyesi ve not kaydı
- [x] Bugünkü faz hesaplama (Home)
- [x] Bilgelik Kütüphanesi (A–Z peri kartları, dialog detay)
- [x] Profil görüntüleme + çıkış
- [x] Mobile-first, alt navigasyon barı
- [x] RLS ile güvenli kullanıcı verisi

## 🔮 Yol Haritası (Yakında)

- [ ] **Şifa Korusu** — semptom takibi, ritüeller, bitki önerileri
- [ ] **Yıldız Parşömeni** — günlük / aylık journaling
- [ ] Push notification ile döngü hatırlatmaları
- [ ] Veri dışa aktarma (PDF / CSV)
- [ ] Çoklu dil (EN)
- [ ] Google ile giriş
- [ ] Partner/aile paylaşımı

---

## 🔐 Güvenlik

- Tüm tablolarda RLS açık — kullanıcılar yalnız `auth.uid() = user_id` olan kayıtlara erişir
- Şifreler Supabase Auth tarafından bcrypt ile saklanır
- `wisdom_cards` herkese okunur (içerik), yazma yok
- Client'ta yalnızca **publishable (anon) key** bulunur — service role key asla expose edilmez

---

## 📁 Önemli Notlar

- `src/integrations/supabase/client.ts` ve `types.ts` **otomatik üretilir**, manuel düzenleme yapılmamalı
- `.env` dosyası **otomatik** doldurulur
- Lovable ↔ GitHub iki yönlü senkron — her iki tarafta yapılan değişiklik anında diğerine yansır

---

## 🧚 Felsefe

> "Bedeniniz bir köy, her mevsim bir hediye. Periler size eşlik etmeye geldi."

HEARTH, kadın bedenini patolojikleştirmek yerine kutlayan, döngünün her fazını bir mevsim olarak ele alan ve bilgiyi peri masalı estetiğiyle aktaran bir bakım uygulamasıdır.
