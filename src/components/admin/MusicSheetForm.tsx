"use client";

import { useState, useRef, DragEvent, FormEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { UploadCloud, X, Loader2, FileText } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { MusicSheet } from "@prisma/client";
import type { MusicSheetInput } from "@/types";

interface MusicSheetFormProps {
  initialData?: MusicSheet;
  onSubmit: (data: MusicSheetInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function MusicSheetForm({ initialData, onSubmit, isSubmitting = false }: MusicSheetFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [composer, setComposer] = useState(initialData?.composer ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [listenLink, setListenLink] = useState(initialData?.listenLink ?? "");
  const [youtubeLink, setYoutubeLink] = useState(initialData?.youtubeLink ?? "");
  const [spotifyLink, setSpotifyLink] = useState(initialData?.spotifyLink ?? "");
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite ?? false);
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder ?? 0);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl ?? "");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File, kind: "cover" | "pdf") {
    const setLoading = kind === "cover" ? setIsUploadingCover : setIsUploadingPdf;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "music-sheets");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız.");
      if (kind === "cover") setCoverImage(data.url);
      else setPdfUrl(data.url);
      toast.success(kind === "cover" ? "Kapak görseli yüklendi" : "PDF yüklendi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setLoading(false);
    }
  }

  function handleCoverDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file, "cover");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Başlık zorunludur.");
      return;
    }
    await onSubmit({
      title: title.trim(),
      composer: composer || undefined,
      description: description || undefined,
      coverImage: coverImage || undefined,
      pdfUrl: pdfUrl || undefined,
      listenLink: listenLink || undefined,
      youtubeLink: youtubeLink || undefined,
      spotifyLink: spotifyLink || undefined,
      isFavorite,
      displayOrder: Number(displayOrder) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Kapak görseli */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-gray-700">Kapak Görseli</label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleCoverDrop}
          onClick={() => coverInputRef.current?.click()}
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
          ) : isUploadingCover ? (
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          ) : (
            <>
              <UploadCloud className="h-6 w-6 text-gray-400" />
              <p className="font-body text-sm text-gray-400">Sürükle bırak veya tıklayarak seç</p>
            </>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file, "cover");
            }}
          />
        </div>
      </div>

      {/* PDF nota dosyası */}
      <div>
        <label className="mb-1.5 block font-body text-sm font-medium text-gray-700">
          Piyano Notası (PDF)
        </label>
        <div
          onClick={() => pdfInputRef.current?.click()}
          className="flex h-16 cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-white px-4 transition-colors hover:bg-hover"
        >
          {isUploadingPdf ? (
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          ) : (
            <FileText className="h-5 w-5 text-gray-400" />
          )}
          <span className="flex-1 truncate font-body text-sm text-gray-500">
            {pdfUrl ? pdfUrl.split("/").pop() : "PDF dosyası seç..."}
          </span>
          {pdfUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPdfUrl("");
              }}
              className="rounded-full p-1.5 text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file, "pdf");
            }}
          />
        </div>
      </div>

      <Input label="Parça Adı *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ör. Clair de Lune" required />
      <Input label="Besteci" value={composer ?? ""} onChange={(e) => setComposer(e.target.value)} placeholder="ör. Claude Debussy" />
      <Textarea label="Açıklama" value={description ?? ""} onChange={(e) => setDescription(e.target.value)} />

      <div className="grid grid-cols-1 gap-4">
        <Input label="Dinleme Linki" type="url" value={listenLink ?? ""} onChange={(e) => setListenLink(e.target.value)} placeholder="https://..." />
        <Input label="YouTube Linki" type="url" value={youtubeLink ?? ""} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/..." />
        <Input label="Spotify Linki" type="url" value={spotifyLink ?? ""} onChange={(e) => setSpotifyLink(e.target.value)} placeholder="https://open.spotify.com/..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Sıralama" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 font-body text-sm text-gray-700">
            <input type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} className="h-4 w-4 accent-accent" />
            Favorilere ekle
          </label>
        </div>
      </div>

      <Button type="submit" isLoading={isSubmitting} disabled={isUploadingCover || isUploadingPdf}>
        {initialData ? "Değişiklikleri Kaydet" : "Nota Ekle"}
      </Button>
    </form>
  );
}
