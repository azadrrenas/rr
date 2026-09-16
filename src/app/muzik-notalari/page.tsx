"use client";

import { CategoryListingPage } from "@/components/public/CategoryListingPage";
import { MusicSheetCard } from "@/components/public/MusicSheetCard";
import type { MusicSheet } from "@/types";

export default function MusicSheetsPage() {
  return (
    <CategoryListingPage<MusicSheet>
      apiPath="music-sheets"
      title="Müzik Notaları"
      subtitle="Piyano başında çalınmayı bekleyen parçalar."
      searchPlaceholder="Parça veya besteci ara..."
      renderCard={(sheet, i) => <MusicSheetCard key={sheet.id} item={sheet} delay={i * 0.05} />}
    />
  );
}
