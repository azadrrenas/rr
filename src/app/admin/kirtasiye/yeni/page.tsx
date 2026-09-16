"use client";

import { CategoryFormPage } from "@/components/admin/CategoryFormPage";
import type { FieldConfig } from "@/components/admin/GenericForm";

const fields: FieldConfig[] = [
  { name: "title", label: "Başlık", type: "text", required: true, placeholder: "ör. Midori Ajanda" },
  {
    name: "itemType",
    label: "Ürün Türü",
    type: "select",
    options: ["Defter", "Sticker", "Post-it", "Ajanda", "Masa Aksesuarı", "Kalem Kutusu", "Washi Tape", "Diğer"],
  },
  { name: "description", label: "Açıklama", type: "textarea" },
  { name: "externalLink", label: "Satın Al Linki", type: "url", placeholder: "https://..." },
];

export default function NewStationeryPage() {
  return (
    <CategoryFormPage
      apiPath="stationery"
      adminBasePath="/admin/kirtasiye"
      fields={fields}
      uploadFolder="stationery"
      createTitle="Yeni Kırtasiye Ürünü Ekle"
      editTitle="Ürünü Düzenle"
      backLabel="Kırtasiyeye dön"
    />
  );
}
