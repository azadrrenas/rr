"use client";

import { CategoryFormPage } from "@/components/admin/CategoryFormPage";
import type { FieldConfig } from "@/components/admin/GenericForm";

const fields: FieldConfig[] = [
  { name: "title", label: "Başlık", type: "text", required: true, placeholder: "ör. Yeni bir koleksiyon eklendi!" },
  { name: "description", label: "Duyuru Metni", type: "textarea", placeholder: "Duyurunun içeriğini yaz..." },
  { name: "externalLink", label: "Bağlantı (isteğe bağlı)", type: "url", placeholder: "https://..." },
];

export default function NewAnnouncementPage() {
  return (
    <CategoryFormPage
      apiPath="announcements"
      adminBasePath="/admin/duyurular"
      fields={fields}
      uploadFolder="announcements"
      createTitle="Yeni Duyuru Ekle"
      editTitle="Duyuruyu Düzenle"
      backLabel="Duyurulara dön"
    />
  );
}