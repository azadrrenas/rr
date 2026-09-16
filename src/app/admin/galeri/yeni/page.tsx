"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { GenericForm, FieldConfig } from "@/components/admin/GenericForm";

const fields: FieldConfig[] = [
  { name: "title", label: "Başlık", type: "text", placeholder: "ör. Kahve molası" },
  { name: "category", label: "Kategori", type: "text", placeholder: "ör. Seyahat, Anlar, Doğa" },
  { name: "description", label: "Açıklama", type: "textarea" },
];

export default function NewGalleryPhotoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: Record<string, any>) {
    if (!data.coverImage) {
      toast.error("Lütfen bir fotoğraf yükle.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "Kaydedilemedi.");
        return;
      }
      toast.success("Fotoğraf eklendi!");
      router.push("/admin/galeri");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/admin/galeri" className="mb-6 inline-flex items-center gap-1.5 font-body text-sm text-gray-500 hover:text-accent">
        <ArrowLeft className="h-4 w-4" />
        Galeriye dön
      </Link>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-gray-800">Yeni Fotoğraf Ekle</h1>
      <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
        <GenericForm
          fields={fields}
          uploadFolder="gallery"
          submitLabel="Fotoğrafı Ekle"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
