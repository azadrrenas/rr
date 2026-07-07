import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin kullanıcısı ---
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
    },
  });
  console.log(`✔ Admin kullanıcısı hazır: ${adminEmail}`);

  // --- Site ayarları (tekil kayıt) ---
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        siteTitle: "Bizim Koleksiyonumuz",
        siteDescription: "Sevdiklerinin tüm sevdiği şeyler, tek bir yerde.",
        heroTitle: "Kalbinin Sevdiği Her Şey",
        heroSubtitle: "Küçük detaylardan büyük bir koleksiyon...",
        socialLinks: {
          instagram: "",
          spotify: "",
          pinterest: "",
          github: "",
        },
      },
    });
    console.log("✔ Varsayılan site ayarları oluşturuldu");
  }

  // --- Örnek parfüm verileri ---
  const perfumeCount = await prisma.perfume.count();
  if (perfumeCount === 0) {
    await prisma.perfume.createMany({
      data: [
        {
          title: "Miss Dior",
          description: "Zarif, çiçeksi ve unutulmaz bir koku.",
          brand: "Dior",
          notes: "Gül, Şakayık, Amber",
          coverImage:
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
          externalLink: "https://www.sephora.com.tr",
          isFavorite: true,
          displayOrder: 1,
        },
        {
          title: "Good Girl",
          description: "Tatlı ve baştan çıkarıcı bir gurme koku.",
          brand: "Carolina Herrera",
          notes: "Badem, Yasemin, Kakao",
          coverImage:
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
          externalLink: "https://www.trendyol.com",
          isFavorite: false,
          displayOrder: 2,
        },
        {
          title: "Coco Mademoiselle",
          description: "Modern ve enerjik bir şık kadın kokusu.",
          brand: "Chanel",
          notes: "Portakal, Yasemin, Vetiver",
          coverImage:
            "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
          externalLink: "https://www.boyner.com.tr",
          isFavorite: true,
          displayOrder: 3,
        },
      ],
    });
    console.log("✔ Örnek parfüm verileri eklendi");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
