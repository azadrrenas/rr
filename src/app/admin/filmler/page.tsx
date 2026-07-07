"use client";

import { CategoryAdminPage } from "@/components/admin/CategoryAdminPage";
import type { Movie } from "@/types";

export default function AdminMoviesPage() {
  return (
    <CategoryAdminPage<Movie>
      apiPath="movies"
      adminBasePath="/admin/filmler"
      title="Filmler"
      columns={[
        { key: "genre", label: "Tür" },
        { key: "releaseYear", label: "Yıl" },
        { key: "imdbRating", label: "IMDB" },
      ]}
    />
  );
}
