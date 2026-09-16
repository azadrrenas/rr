import Link from "next/link";
import { HeartCrack } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-hero-gradient px-6 text-center">
      <HeartCrack className="h-12 w-12 text-accent" />
      <h1 className="font-heading text-3xl font-semibold text-gray-800">
        Sayfa Bulunamadı
      </h1>
      <p className="max-w-sm font-body text-gray-600">
        Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-accent px-6 py-2.5 font-body text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-glow"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
