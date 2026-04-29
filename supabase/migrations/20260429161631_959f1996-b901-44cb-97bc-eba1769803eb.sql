-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users view own roles" on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

-- Life stages enum
create type public.life_stage as enum ('menstrual', 'perimenopause', 'menopause', 'pcos', 'pregnancy', 'postpartum');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  birth_year int,
  life_stage life_stage not null default 'menstrual',
  avg_cycle_length int default 28,
  avg_period_length int default 5,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Cycle entries (period start/end)
create type public.flow_intensity as enum ('spotting', 'light', 'medium', 'heavy');

create table public.cycle_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date,
  flow flow_intensity default 'medium',
  notes text,
  created_at timestamptz not null default now()
);
alter table public.cycle_entries enable row level security;
create index on public.cycle_entries (user_id, start_date desc);

create policy "own cycles select" on public.cycle_entries for select to authenticated using (auth.uid() = user_id);
create policy "own cycles insert" on public.cycle_entries for insert to authenticated with check (auth.uid() = user_id);
create policy "own cycles update" on public.cycle_entries for update to authenticated using (auth.uid() = user_id);
create policy "own cycles delete" on public.cycle_entries for delete to authenticated using (auth.uid() = user_id);

-- Symptom logs (per day)
create table public.symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  mood text,
  pain_level int check (pain_level between 0 and 10),
  symptoms text[] default '{}',
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);
alter table public.symptom_logs enable row level security;
create index on public.symptom_logs (user_id, log_date desc);

create policy "own logs select" on public.symptom_logs for select to authenticated using (auth.uid() = user_id);
create policy "own logs insert" on public.symptom_logs for insert to authenticated with check (auth.uid() = user_id);
create policy "own logs update" on public.symptom_logs for update to authenticated using (auth.uid() = user_id);
create policy "own logs delete" on public.symptom_logs for delete to authenticated using (auth.uid() = user_id);

-- Wisdom cards (Bilgelik Kütüphanesi)
create table public.wisdom_cards (
  id uuid primary key default gen_random_uuid(),
  letter char(1) not null,
  title text not null,
  subtitle text,
  category text not null,
  body text not null,
  fairy_name text,
  accent_color text default 'lime',
  sort_order int default 0,
  created_at timestamptz not null default now()
);
alter table public.wisdom_cards enable row level security;

create policy "anyone authed can read cards" on public.wisdom_cards for select to authenticated using (true);
create policy "admins manage cards" on public.wisdom_cards for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Seed wisdom cards
insert into public.wisdom_cards (letter, title, subtitle, category, body, fairy_name, accent_color, sort_order) values
('A', 'Apple Blossom', 'Adet Döngüsü', 'cycle', 'Menstrüel döngü ortalama 21–35 gün arasında değişir. Vücudunuzun ritmini tanımak ilk adımdır. Foliküler, ovulasyon ve luteal fazlar boyunca hormonlar dans eder.', 'Elma Çiçeği Perisi', 'lime', 1),
('C', 'Columbine', 'Cinsel Sağlık', 'sexual', 'Cinsel sağlık utanılacak değil, kutlanacak bir konudur. Düzenli kontrol, güvenli ilişki ve kendi bedenini tanımak temeldir.', 'Hasekiküpesi Perisi', 'navy', 2),
('D', 'Double Daisy', 'Doğurganlık', 'fertility', 'Doğurganlık penceresi ovulasyondan birkaç gün önce başlar. Bazal vücut sıcaklığı ve servikal mukus değişimi en güvenilir göstergelerdir.', 'Papatya Perisi', 'lime', 3),
('K', 'Kingcup', 'Kadınsal Hijyen', 'hygiene', 'Vajinal flora kendi kendini temizler. Parfümlü ürünlerden kaçının; pamuklu iç çamaşırı ve nazik temizleyiciler tercih edin.', 'Bataklık Nergisi Perisi', 'cream', 4),
('M', 'Mallow', 'Menopoz', 'menopause', 'Menopoz bir bitiş değil, yeni bir mevsimdir. Sıcak basmaları, uyku değişiklikleri ve duygusal dalgalanmalar normaldir; kendinize şefkat gösterin.', 'Ebegümeci Perisi', 'navy', 5),
('P', 'Pansy', 'Perimenopoz', 'perimenopause', 'Perimenopoz genellikle 40''lı yaşlarda başlar ve birkaç yıl sürebilir. Düzensiz döngüler bu dönemin ilk işaretidir.', 'Hercai Menekşe Perisi', 'lime', 6),
('S', 'Strawberry', 'Semptom Takibi', 'tracking', 'Günlük semptom kayıtları, döngünüzü öngörmenize ve doktorunuzla paylaşacağınız değerli veriler oluşturmanıza yardımcı olur.', 'Çilek Perisi', 'lime', 7),
('Q', 'Queen of the Meadow', 'PCOS', 'pcos', 'Polikistik Over Sendromu kadınların yaklaşık %10''unu etkiler. Beslenme, hareket ve takip ile yönetilebilir.', 'Çayır Kraliçesi Perisi', 'navy', 8),
('L', 'Lavender', 'Sakinlik & Ritüel', 'ritual', 'Günlük küçük ritüeller — bir fincan ıhlamur, beş dakikalık nefes, bir sayfa günlük — sinir sistemini yatıştırır.', 'Lavanta Perisi', 'lavender', 9),
('B', 'Blackthorn', 'Beslenme', 'nutrition', 'Demir, magnezyum ve omega-3 bakımından zengin besinler döngü semptomlarını hafifletebilir.', 'Karaçalı Perisi', 'lime', 10),
('R', 'Rowan', 'Ruhsal Denge', 'mental', 'Hormonal dalgalanmalar duygu durumunu etkiler. Bu değişimler zayıflık değil, biyolojinizin bir parçasıdır.', 'Üvez Perisi', 'navy', 11),
('T', 'Thistle', 'Tarama & Muayene', 'screening', 'Düzenli kendi kendine meme muayenesi ve yıllık jinekolojik kontroller, erken teşhisin anahtarıdır.', 'Devedikeni Perisi', 'navy', 12);