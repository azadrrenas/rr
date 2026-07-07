"use client";

import Image from "next/image";
import { Pencil, Trash2, Heart, GripVertical } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import type { Perfume } from "@prisma/client";

interface DataTableProps {
  items: Perfume[];
  onEdit: (item: Perfume) => void;
  onDelete: (item: Perfume) => void;
  onToggleFavorite: (item: Perfume) => void;
}

export function DataTable({
  items,
  onEdit,
  onDelete,
  onToggleFavorite,
}: DataTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="font-heading text-lg text-gray-400">Henüz kayıt yok</p>
        <p className="font-body text-sm text-gray-400">
          "Yeni Ekle" butonuyla ilk kaydını oluştur.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
      <table className="w-full text-left">
        <thead className="bg-hover/60">
          <tr className="font-body text-xs uppercase tracking-wide text-gray-500">
            <th className="w-10 px-4 py-3"></th>
            <th className="px-4 py-3">Görsel</th>
            <th className="px-4 py-3">Başlık</th>
            <th className="px-4 py-3">Marka</th>
            <th className="px-4 py-3">Favori</th>
            <th className="px-4 py-3">Güncellenme</th>
            <th className="px-4 py-3 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t border-border font-body text-sm text-gray-700 transition-colors hover:bg-hover/40"
            >
              <td className="px-4 py-3 text-gray-300">
                <GripVertical className="h-4 w-4" />
              </td>
              <td className="px-4 py-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-primary">
                  {item.coverImage && (
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-medium">{item.title}</td>
              <td className="px-4 py-3 text-gray-500">{item.brand ?? "—"}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onToggleFavorite(item)}
                  className={cn(
                    "rounded-full p-1.5 transition-colors",
                    item.isFavorite
                      ? "text-accent"
                      : "text-gray-300 hover:text-accent"
                  )}
                  title="Favori durumunu değiştir"
                >
                  <Heart className="h-4 w-4" fill={item.isFavorite ? "currentColor" : "none"} />
                </button>
              </td>
              <td className="px-4 py-3 text-gray-400">
                {formatDate(item.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-hover hover:text-accent"
                    title="Düzenle"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
