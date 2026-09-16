"use client";

import { CategoryAdminPage } from "@/components/admin/CategoryAdminPage";
import type { StationeryItem } from "@/types";

export default function AdminStationeryPage() {
  return (
    <CategoryAdminPage<StationeryItem>
      apiPath="stationery"
      adminBasePath="/admin/kirtasiye"
      title="Kırtasiye Ürünleri"
      columns={[{ key: "itemType", label: "Tür" }]}
    />
  );
}
