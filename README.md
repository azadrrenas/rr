# Bizim Koleksiyonumuz 🌸

Sevdiğin bir insanın beğendiği her şeyi (parfümler, çantalar, kalemler, kırtasiye,
diziler/filmler, müzik notaları, galeri) tek bir zarif adreste toplayan, admin
panelli, kişisel bir koleksiyon sitesi.

Bu depo, projenin **tamamını** içerir: veritabanı şeması, kimlik doğrulama, tam
kapsamlı admin panel ve **8 kategorinin tamamı** (Parfümler, Çantalar, Kalemler,
Kırtasiye, Filmler, Diziler, Müzik Notaları, Galeri) için uçtan uca çalışır admin
CRUD + public sayfalar. İçerikler bilinçli olarak **boş** bırakıldı — hepsini
admin panelinden (`/admin/login`) kendin dolduracaksın.

---

## 🧱 Teknoloji Yığını

| Katman     | Teknoloji |
|------------|-----------|
| Frontend   | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons |
| Backend    | Next.js API Routes, Zod (validasyon) |
| Veritabanı | PostgreSQL + Prisma ORM |
| Kimlik Doğrulama | JWT (`jose` — Edge Runtime uyumlu), bcrypt (`bcryptjs`) |
| Görsel Depolama | Supabase Storage |
| Bildirimler | `react-hot-toast` |

---

## 🚀 Kurulum

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. PostgreSQL veritabanı hazırla

Bir Postgres veritabanına ihtiyacın var. En hızlı seçenekler:

- **Supabase** (zaten Storage için kullanacağın için pratik olur): [supabase.com](https://supabase.com) → yeni proje → Settings → Database → Connection String
- **Neon**: [neon.tech](https://neon.tech) (ücretsiz, sunucusuz Postgres)
- **Lokal Postgres**: `docker run --name koleksiyon-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

### 3. Ortam değişkenlerini ayarla

```bash
cp .env.example .env
```

`.env` dosyasını aç ve şunları doldur:

- `DATABASE_URL` — Postgres bağlantı adresin
- `JWT_SECRET` — güçlü, rastgele bir değer (`openssl rand -base64 48` ile üretebilirsin)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — ilk admin kullanıcın (seed script tarafından kullanılır)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — Supabase proje ayarlarından (Settings → API)
- `SUPABASE_STORAGE_BUCKET` — Supabase Dashboard → Storage'da oluşturacağın **public** bucket adı (örn. `koleksiyon-gorseller`)

> **Supabase Storage bucket'ı nasıl oluşturulur?**
> Supabase Dashboard → Storage → "New bucket" → adını `.env`'deki `SUPABASE_STORAGE_BUCKET` ile aynı yap → **Public bucket** seçeneğini işaretle (görsellerin sitede görünebilmesi için).

### 4. Veritabanı şemasını uygula

```bash
npm run db:push
```

(Üretim ortamı için migration geçmişi istiyorsan `npm run db:migrate` kullanabilirsin.)

### 5. Örnek verileri ve admin kullanıcısını oluştur

```bash
npm run db:seed
```

Bu komut `.env` dosyandaki `ADMIN_EMAIL` / `ADMIN_PASSWORD` ile bir admin kullanıcısı, varsayılan site ayarları ve 3 örnek parfüm kaydı oluşturur.

### 6. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Site: [http://localhost:3000](http://localhost:3000)
Admin paneli: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📂 Proje Yapısı

```
koleksiyon-sitesi/
├── prisma/
│   ├── schema.prisma       # Tüm tablolar (Perfume, Bag, Pen, StationeryItem,
│   │                         Movie, Series, MusicSheet, GalleryPhoto, Settings, Admin)
│   └── seed.ts             # Admin kullanıcısı + site ayarları + örnek parfüm verisi
├── src/
│   ├── middleware.ts        # /admin/* sayfalarını JWT ile korur
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── auth.ts          # JWT sign/verify (jose), bcrypt hash/verify
│   │   ├── requireAdmin.ts  # API route'larında admin kontrolü
│   │   ├── supabase.ts      # Supabase Storage upload/delete (görsel + PDF)
│   │   └── utils.ts         # cn(), slugify(), formatDate()
│   ├── types/index.ts       # Paylaşılan TS tipleri (her kategori için Input tipi)
│   ├── components/
│   │   ├── ui/               # Button, Input, Textarea, Card, Modal, ConfirmDialog, Skeleton
│   │   ├── layout/            # Navbar, Footer
│   │   ├── public/
│   │   │   ├── Hero, CategoryCard, PerfumeCard, GenericCard, ShowCard, MusicSheetCard
│   │   │   └── CategoryListingPage.tsx   # Genel amaçlı public liste sayfası (arama+favori filtresi)
│   │   └── admin/
│   │       ├── Sidebar, StatCard, DataTable, PerfumeForm, MusicSheetForm
│   │       ├── GenericForm.tsx           # Konfigüre edilebilir form (alan listesi ile)
│   │       ├── GenericDataTable.tsx      # Konfigüre edilebilir admin tablosu
│   │       ├── CategoryAdminPage.tsx     # Genel amaçlı admin liste sayfası
│   │       └── CategoryFormPage.tsx      # Genel amaçlı admin ekle/düzenle sayfası
│   └── app/
│       ├── layout.tsx, globals.css, page.tsx (Ana Sayfa), sitemap.ts, robots.ts
│       ├── parfumler/page.tsx            # Parfümler (özel PerfumeCard)
│       ├── cantalar/page.tsx             # Çantalar
│       ├── kalemler/page.tsx             # Kalemler
│       ├── kirtasiye/page.tsx            # Kırtasiye (tür filtreli)
│       ├── dizi-film/page.tsx            # Filmler + Diziler (sekmeli)
│       ├── muzik-notalari/page.tsx       # Müzik Notaları (PDF görüntüleyici)
│       ├── galeri/page.tsx               # Galeri (Masonry + Lightbox + Zoom)
│       ├── admin/
│       │   ├── login/, dashboard/         # Giriş + istatistikler
│       │   └── {parfumler,cantalar,kalemler,kirtasiye,filmler,diziler,muzik-notalari,galeri}/
│       │       ├── page.tsx              # Liste (arama, favori toggle, silme onayı)
│       │       ├── yeni/page.tsx         # Yeni kayıt formu
│       │       └── [id]/page.tsx         # Düzenleme formu
│       └── api/
│           ├── auth/{login,logout,me}/route.ts
│           ├── upload/route.ts            # Supabase Storage'a görsel/PDF yükleme
│           └── {perfumes,bags,pens,stationery,movies,series,music-sheets,gallery}/
│               ├── route.ts               # GET (liste+arama+sayfalama), POST
│               └── [id]/route.ts          # GET, PUT, DELETE
```

### Kategori bazlı özel alanlar

| Kategori | API path | Ekstra alanlar |
|---|---|---|
| Parfümler | `/api/perfumes` | `brand`, `notes` |
| Çantalar | `/api/bags` | `brand`, `model`, `color` |
| Kalemler | `/api/pens` | `brand`, `model` |
| Kırtasiye | `/api/stationery` | `itemType` (Defter, Sticker, Post-it, Ajanda, Washi Tape, ...) |
| Filmler | `/api/movies` | `genre`, `imdbRating`, `releaseYear`, `trailerLink`, `watchLink` |
| Diziler | `/api/series` | `genre`, `imdbRating`, `releaseYear`, `trailerLink`, `watchLink` |
| Müzik Notaları | `/api/music-sheets` | `composer`, `pdfUrl` (PDF görüntüleyici), `listenLink`, `youtubeLink`, `spotifyLink` |
| Galeri | `/api/gallery` | `category` (Masonry filtreleme), `coverImage` zorunlu |

Bu tablonun dışındaki ortak alanlar (`title`, `description`, `coverImage`,
`isFavorite`, `displayOrder`, `createdAt`, `updatedAt`) tüm kategorilerde
mevcuttur.

---

## 🔐 Güvenlik Notları

- Admin şifreleri **bcrypt** (12 salt round) ile hash'lenir, asla düz metin saklanmaz.
- Oturumlar **httpOnly, secure (production'da), sameSite=lax** cookie içinde JWT olarak tutulur — client-side JavaScript token'a erişemez (XSS'e karşı ek katman).
- `middleware.ts`, `/admin/*` sayfalarını korur; ayrıca her admin-only API route'u (`POST/PUT/DELETE`) kendi içinde `requireAdmin()` ile **ikinci kez** doğrulama yapar (defense-in-depth).
- Giriş denemeleri IP başına **rate-limit**'lidir (15 dakikada 5 deneme).
- Tüm form girdileri **Zod** ile sunucu tarafında doğrulanır (SQL Injection'a karşı zaten Prisma parametrize sorgular kullanır).
- Gerçek dünyada üretime almadan önce: CSRF token'ı (Next.js Server Actions kullanıyorsan otomatik korumalıdır, API route kullanıyorsan `sameSite=lax` + origin kontrolü ekle), Content-Security-Policy header'ları ve genel bir API rate limiter (ör. Upstash Ratelimit) eklemeni öneririz.

---

## 🧩 Genel (Generic) Bileşen Mimarisi

Çantalar, Kalemler, Kırtasiye, Filmler, Diziler gibi kategoriler tekrarlayan
kod yazmamak için **konfigüre edilebilir genel bileşenler** üzerine kuruldu:

- `GenericForm` — bir alan listesi (`FieldConfig[]`) verirsin, form + görsel
  yükleme otomatik oluşur.
- `GenericDataTable` / `CategoryAdminPage` — admin liste sayfasını (arama,
  favori toggle, silme onayı) birkaç satırda kurar.
- `CategoryFormPage` — ekleme/düzenleme sayfasını tek bileşende birleştirir.
- `CategoryListingPage` / `GenericCard` — public tarafta arama + favori
  filtreli listeleme sayfasını kurar.

Parfümler (özel kart tasarımı istediği için), Müzik Notaları (PDF yükleme
gerektirdiği için) ve Galeri (Masonry + Lightbox gerektirdiği için) kendi özel
bileşenlerine sahiptir; diğerleri tamamen genel bileşenler üzerinden çalışır.

**Yeni bir kategori daha eklemek istersen** (ör. ileride "Kitaplar"):

1. `prisma/schema.prisma`'ya yeni model ekle, `npm run db:push` çalıştır.
2. `src/app/api/kitaplar/route.ts` ve `[id]/route.ts` dosyalarını en yakın
   örneği (ör. `bags`) kopyalayıp alan adlarını değiştirerek oluştur.
3. `src/app/admin/kitaplar/{page,yeni/page,[id]/page}.tsx` dosyalarını
   `CategoryAdminPage` + `CategoryFormPage` ile birkaç satırda yaz (bkz.
   `cantalar` klasörü örnek alınabilir).
4. `src/app/kitaplar/page.tsx`'i `CategoryListingPage` + `GenericCard` ile yaz.
5. `Sidebar.tsx`'e yeni linki ekle.

---

## 🎨 Tasarım Dili

- **Renk paleti:** Açık Pembe `#FCE4EC`, Pastel Pembe `#F8BBD0`, Rose Gold `#E8A0BF`, Arka Plan `#FFF8FB`
- **Fontlar:** Başlıklarda `Playfair Display`, gövde metinde `Poppins`
- **Tema:** Soft Girl / Coquette / Pastel / Elegant / Luxury / Minimal — Apple sadeliği + Pinterest estetiği
- **Animasyonlar:** Framer Motion ile fade, slide, scale, hover-grow, floating, scroll-reveal
- Karanlık mod yoktur (bilinçli tasarım kararı, spesifikasyona uygun).

---

## 🗺️ Bu Sürüme Dahil Olmayanlar

- Site Ayarları (Settings modeli) için admin arayüzü (veritabanında hazır, ama
  düzenleme ekranı henüz yok — istersen `/admin/ayarlar` olarak aynı desenle eklenebilir)
- Toplu yükleme / toplu silme / toplu düzenleme
- Infinite scroll (şu an sayfalama API'de var; "Daha Fazla Yükle" butonuna bağlanabilir)
- Sürükle-bırak ile sıralama (şu an `displayOrder` alanı manuel giriliyor; tabloda
  sürükleme ikonu görsel olarak var ama henüz işlevsel değil)

---

## 🩹 Sorun Giderme

- **"JWT_SECRET tanımlı değil" uyarısı:** `.env` dosyanı oluşturduğundan ve sunucuyu yeniden başlattığından emin ol.
- **Görsel/PDF yüklenmiyor:** Supabase bucket'ının **public** olduğundan ve `SUPABASE_SERVICE_ROLE_KEY`'in doğru kopyalandığından emin ol (bu key gizlidir, asla client koduna ya da repoya eklenmemeli).
- **`prisma db push` hata veriyor:** `DATABASE_URL`'in doğru formatta olduğundan ve veritabanı sunucusuna erişilebildiğinden emin ol.
- **Galeri fotoğrafı eklenmiyor:** Galeri'de fotoğraf zorunludur — kaydetmeden önce bir görsel yüklediğinden emin ol.
