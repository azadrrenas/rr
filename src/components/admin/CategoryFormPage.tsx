"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { GenericForm, FieldConfig } from "@/components/admin/GenericForm";

interface CategoryFormPageProps {
  apiPath: string; // ör. "bags"
  adminBasePath: string; // ör. "/admin/cantalar"
  id?: string; // varsa düzenleme modu
  fields: FieldConfig[];
  uploadFolder: string;
  hasFavorite?: boolean;
  createTitle: string;
  editTitle: string;
  backLabel: string;
}

export function CategoryFormPage({
  apiPath,
  adminBasePath,
  id,
  fields,
  uploadFolder,
  hasFavorite = true,
  createTitle,
  editTitle,
  backLabel,
}: CategoryFormPageProps) {
  const router = useRouter();
  const isEditMode = !!id;
  const [initialData, setInitialData] = useState<Record<string, any> | null>(
    isEditMode ? null : {}
  );
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;
    async function load() {
      const res = await fetch(`/api/${apiPath}/${id}`);
      if (!res.ok) {
        toast.error("Kayıt bulunamadı.");
        router.push(adminBasePath);
        return;
      }
      const data = await res.json();
      setInitialData(data.item);
      setIsLoading(false);
    }
    load();
  }, [apiPath, id, isEditMode, router, adminBasePath]);

  async function handleSubmit(data: Record<string, any>) {
    setIsSubmitting(true);
    try {
      const res = await fetch(isEditMode ? `/api/${apiPath}/${id}` : `/api/${apiPath}`, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Kaydedilemedi.");
        return;
      }

      toast.success(isEditMode ? "Değişiklikler kaydedildi!" : "Kayıt eklendi!");
      router.push(adminBasePath);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href={adminBasePath}
        className="mb-6 inline-flex items-center gap-1.5 font-body text-sm text-gray-500 hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-semibold text-gray-800">
        {isEditMode ? editTitle : createTitle}
      </h1>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
        {initialData && (
          <GenericForm
            fields={fields}
            initialData={initialData}
            uploadFolder={uploadFolder}
            hasFavorite={hasFavorite}
            submitLabel={isEditMode ? "Değişiklikleri Kaydet" : "Kaydet"}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
