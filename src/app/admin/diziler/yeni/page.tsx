"use client";

import { CategoryFormPage } from "@/components/admin/CategoryFormPage";
import type { FieldConfig } from "@/components/admin/GenericForm";

const fields: FieldConfig[] = [
  { name: "title", label: "Başlık", type: "text", required: true, placeholder: "ör. Friends" },
  { name: "genre", label: "Tür", type: "text", half: true, placeholder: "ör. Romantik, Müzikal" },
  { name: "releaseYear", label: "Yayın Yılı", type: "number", half: true, placeholder: "2016" },
  { name: "imdbRating", label: "IMDB Puanı", type: "number", half: true, placeholder: "8.0" },
  { name: "description", label: "Açıklama", type: "textarea" },
  { name: "trailerLink", label: "Fragman Linki", type: "url", half: true, placeholder: "https://youtube.com/..." },
  { name: "watchLink", label: "İzleme Linki", type: "url", half: true, placeholder: "https://..." },
];

export default function NewSeriesPage() {
  return (
    <CategoryFormPage
      apiPath="series"
      adminBasePath="/admin/diziler"
      fields={fields}
      uploadFolder="series"
      createTitle="Yeni Dizi Ekle"
      editTitle="Diziyi Düzenle"
      backLabel="Dizilere dön"
    />
  );
}
