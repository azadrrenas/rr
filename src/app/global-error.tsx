"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-hero-gradient px-6 text-center">
          <AlertCircle className="h-12 w-12 text-accent" />
          <h1 className="font-heading text-3xl font-semibold text-gray-800">
            Bir Şeyler Ters Gitti
          </h1>
          <p className="max-w-sm font-body text-gray-600">
            Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
          </p>
          <Button onClick={reset}>Tekrar Dene</Button>
        </div>
      </body>
    </html>
  );
}
