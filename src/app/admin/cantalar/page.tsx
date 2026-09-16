"use client";

import { CategoryAdminPage } from "@/components/admin/CategoryAdminPage";
import type { Bag } from "@/types";

export default function AdminBagsPage() {
  return (
    <CategoryAdminPage<Bag>
      apiPath="bags"
      adminBasePath="/admin/cantalar"
      title="Çantalar"
      columns={[
        { key: "brand", label: "Marka" },
        { key: "model", label: "Model" },
        { key: "color", label: "Renk" },
      ]}
    />
  );
}
