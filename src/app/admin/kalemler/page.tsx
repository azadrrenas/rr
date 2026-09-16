"use client";

import { CategoryAdminPage } from "@/components/admin/CategoryAdminPage";
import type { Pen } from "@/types";

export default function AdminPensPage() {
  return (
    <CategoryAdminPage<Pen>
      apiPath="pens"
      adminBasePath="/admin/kalemler"
      title="Kalemler"
      columns={[
        { key: "brand", label: "Marka" },
        { key: "model", label: "Model" },
      ]}
    />
  );
}
