"use client";

import { CategoryAdminPage } from "@/components/admin/CategoryAdminPage";
import type { MusicSheet } from "@/types";

export default function AdminMusicSheetsPage() {
  return (
    <CategoryAdminPage<MusicSheet>
      apiPath="music-sheets"
      adminBasePath="/admin/muzik-notalari"
      title="Müzik Notaları"
      columns={[{ key: "composer", label: "Besteci" }]}
    />
  );
}
