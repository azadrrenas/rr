"use client";

import { CategoryFormPage } from "@/components/admin/CategoryFormPage";
import type { FieldConfig } from "@/components/admin/GenericForm";

const fields: FieldConfig[] = [
  { name: "title", label: "Başlık", type: "text", required: true, placeholder: "ör. Kaweco Special" },
  { name: "brand", label: "Marka", type: "text", half: true, placeholder: "ör. Kaweco" },
  { name: "model", label: "Model", type: "text", half: true, placeholder: "ör. Special AL" },
  { name: "description", label: "Açıklama", type: "textarea" },
  { name: "externalLink", label: "Satın Al Linki", type: "url", placeholder: "https://..." },
];

export default function NewPenPage() {
  return (
    <CategoryFormPage
      apiPath="pens"
      adminBasePath="/admin/kalemler"
      fields={fields}
      uploadFolder="pens"
      createTitle="Yeni Kalem Ekle"
      editTitle="Kalemi Düzenle"
      backLabel="Kalemlere dön"
    />
  );
}
