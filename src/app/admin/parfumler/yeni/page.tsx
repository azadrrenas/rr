"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { PerfumeForm } from "@/components/admin/PerfumeForm";
import type { PerfumeInput } from "@/types";

export default function NewPerfumePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: PerfumeInput) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/perfumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Kaydedilemedi.");
        return;
      }

      toast.success("Parfüm eklendi!");
      router.push("/admin/parfumler");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
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
        Yeni Parfüm Ekle
      </h1>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
        <PerfumeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
