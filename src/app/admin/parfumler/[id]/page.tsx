"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PerfumeForm } from "@/components/admin/PerfumeForm";
import type { Perfume } from "@prisma/client";
import type { PerfumeInput } from "@/types";

export default function EditPerfumePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/perfumes/${params.id}`);
      if (!res.ok) {
        toast.error("Kayıt bulunamadı.");
        router.push("/admin/parfumler");
        return;
      }
      const data = await res.json();
      setPerfume(data.item);
      setIsLoading(false);
    }
    load();
  }, [params.id, router]);

  async function handleSubmit(data: PerfumeInput) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/perfumes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Güncellenemedi.");
        return;
      }

      toast.success("Değişiklikler kaydedildi!");
      router.push("/admin/parfumler");
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
        href="/admin/parfumler"
        className="mb-6 inline-flex items-center gap-1.5 font-body text-sm text-gray-500 hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Parfümlere dön
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-semibold text-gray-800">
        Parfümü Düzenle
      </h1>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
        {perfume && (
          <PerfumeForm
            initialData={perfume}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
