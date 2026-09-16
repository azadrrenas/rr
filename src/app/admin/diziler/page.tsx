"use client";

import { CategoryAdminPage } from "@/components/admin/CategoryAdminPage";
import type { Series } from "@/types";

export default function AdminSeriesPage() {
  return (
    <CategoryAdminPage<Series>
      apiPath="series"
      adminBasePath="/admin/diziler"
      title="Diziler"
      columns={[
        { key: "genre", label: "Tür" },
        { key: "releaseYear", label: "Yıl" },
        { key: "imdbRating", label: "IMDB" },
      ]}
    />
  );
}
