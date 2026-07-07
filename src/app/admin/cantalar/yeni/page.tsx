"use client";

import { CategoryFormPage } from "@/components/admin/CategoryFormPage";
import type { FieldConfig } from "@/components/admin/GenericForm";

const fields: FieldConfig[] = [
  { name: "title", label: "Başlık", type: "text", required: true, placeholder: "ör. Neverfull MM" },
  { name: "brand", label: "Marka", type: "text", half: true, placeholder: "ör. Louis Vuitton" },
  { name: "model", label: "Model", type: "text", half: true, placeholder: "ör. Neverfull MM" },
  { name: "color", label: "Renk", type: "text", half: true, placeholder: "ör. Bej" },
  { name: "description", label: "Açıklama", type: "textarea" },
  { name: "externalLink", label: "Satın Al Linki", type: "url", placeholder: "https://..." },
];

export default function NewBagPage() {
  return (
    <CategoryFormPage
      apiPath="bags"
      adminBasePath="/admin/cantalar"
      fields={fields}
      uploadFolder="bags"
      createTitle="Yeni Çanta Ekle"
      editTitle="Çantayı Düzenle"
      backLabel="Çantalara dön"
    />
  );
}
