"use client";

import { useState, useRef, DragEvent, FormEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export type FieldType = "text" | "textarea" | "url" | "number" | "select";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[]; // "select" tipi için
  required?: boolean;
  half?: boolean; // iki sütunlu grid'de yarım genişlik
}

interface GenericFormProps {
  fields: FieldConfig[];
  initialData?: Record<string, any>;
  hasCoverImage?: boolean;
  hasFavorite?: boolean;
  uploadFolder: string;
  submitLabel: string;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isSubmitting?: boolean;
}

export function GenericForm({
  fields,
  initialData,
  hasCoverImage = true,
  hasFavorite = true,
  uploadFolder,
  submitLabel,
  onSubmit,
  isSubmitting = false,
}: GenericFormProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.name] = initialData?.[f.name] ?? (f.type === "number" ? "" : "");
    });
    return initial;
  });
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite ?? false);
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder ?? 0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setField(name: string, value: any) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function uploadFile(file: File) {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", uploadFolder);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const titleField = fields.find((f) => f.name === "title");
    if (titleField && !values.title?.trim()) {
      toast.error("Başlık zorunludur.");
      return;
    }

    const payload: Record<string, any> = {};
    fields.forEach((f) => {
      const raw = values[f.name];
      if (raw === "" || raw === undefined) {
        payload[f.name] = undefined;
      } else if (f.type === "number") {
        payload[f.name] = Number(raw);
      } else {
        payload[f.name] = raw;
      }
    });

    if (hasCoverImage) payload.coverImage = coverImage || undefined;
    if (hasFavorite) payload.isFavorite = isFavorite;
    payload.displayOrder = Number(displayOrder) || 0;

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {hasCoverImage && (
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
                <Image src={coverImage} alt="Önizleme" fill className="rounded-xl object-cover" />
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
      )}

      <div className="grid grid-cols-2 gap-4">
        {fields.map((f) => {
          const wrapperClass = f.half ? "" : "col-span-2";
          if (f.type === "textarea") {
            return (
              <div key={f.name} className={wrapperClass}>
                <Textarea
                  label={f.label + (f.required ? " *" : "")}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setField(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                />
              </div>
            );
          }
          if (f.type === "select") {
            return (
              <div key={f.name} className={`flex flex-col gap-1.5 ${wrapperClass}`}>
                <label className="font-body text-sm font-medium text-gray-700">
                  {f.label}
                  {f.required ? " *" : ""}
                </label>
                <select
                  value={values[f.name] ?? ""}
                  onChange={(e) => setField(f.name, e.target.value)}
                  required={f.required}
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-gray-800 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">Seçiniz...</option>
                  {f.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          return (
            <div key={f.name} className={wrapperClass}>
              <Input
                label={f.label + (f.required ? " *" : "")}
                type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
                required={f.required}
              />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Sıralama"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
        />
        {hasFavorite && (
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
        )}
      </div>

      <Button type="submit" isLoading={isSubmitting} disabled={isUploading}>
        {submitLabel}
      </Button>
    </form>
  );
}
