"use client";

import { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Perfume } from "@prisma/client";
import type { PerfumeInput } from "@/types";

interface PerfumeFormProps {
  initialData?: Perfume;
  onSubmit: (data: PerfumeInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function PerfumeForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: PerfumeFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [externalLink, setExternalLink] = useState(initialData?.externalLink ?? "");
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite ?? false);
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder ?? 0);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "perfumes");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız.");
      setCoverImage(data.url);
      toast.success("Görsel yüklendi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Görsel yüklenemedi");
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Başlık zorunludur.");
      return;
    }
    await onSubmit({
      title: title.trim(),
      brand: brand || undefined,
      notes: notes || undefined,
      description: description || undefined,
      externalLink: externalLink || undefined,
      coverImage: coverImage || undefined,
      isFavorite,
      displayOrder: Number(displayOrder) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Görsel yükleme alanı */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-gray-700">
          Kapak Görseli
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
            isDragging ? "border-accent bg-hover" : "border-border bg-white"
          }`}
        >
          {coverImage ? (
            <>
              <Image
                src={coverImage}
                alt="Önizleme"
                fill
                className="rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCoverImage("");
                }}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-gray-600 shadow-soft hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          ) : (
            <>
              <UploadCloud className="h-6 w-6 text-gray-400" />
              <p className="font-body text-sm text-gray-400">
                Sürükle bırak veya tıklayarak seç
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
            }}
          />
        </div>
      </div>

      <Input
        label="Başlık *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ör. Miss Dior"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Marka"
          value={brand ?? ""}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="ör. Dior"
        />
        <Input
          label="Notalar"
          value={notes ?? ""}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ör. Vanilya, Amber"
        />
      </div>

      <Textarea
        label="Açıklama"
        value={description ?? ""}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Kısa bir açıklama yaz..."
      />

      <Input
        label="Satın Al Linki"
        type="url"
        value={externalLink ?? ""}
        onChange={(e) => setExternalLink(e.target.value)}
        placeholder="https://www.sephora.com.tr/..."
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Sıralama"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
        />
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 font-body text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Favorilere ekle
          </label>
        </div>
      </div>

      <Button type="submit" isLoading={isSubmitting} disabled={isUploading}>
        {initialData ? "Değişiklikleri Kaydet" : "Parfüm Ekle"}
      </Button>
    </form>
  );
}
