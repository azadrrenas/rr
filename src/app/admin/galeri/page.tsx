"use client";

import { CategoryAdminPage } from "@/components/admin/CategoryAdminPage";
import type { GalleryPhoto } from "@/types";

export default function AdminGalleryPage() {
  return (
    <CategoryAdminPage<GalleryPhoto>
      apiPath="gallery"
      adminBasePath="/admin/galeri"
      title="Galeri"
      columns={[{ key: "category", label: "Kategori" }]}
    />
  );
}
