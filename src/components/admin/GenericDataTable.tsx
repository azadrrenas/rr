"use client";

import Image from "next/image";
import { Pencil, Trash2, Heart, GripVertical } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

export interface ColumnConfig<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface GenericDataTableProps<T extends { id: string; title?: string | null; coverImage?: string | null; isFavorite?: boolean; updatedAt: Date | string }> {
  items: T[];
  columns: ColumnConfig<T>[];
  hasFavorite?: boolean;
  hasImage?: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onToggleFavorite?: (item: T) => void;
  emptyLabel?: string;
}

export function GenericDataTable<
  T extends {
    id: string;
    title?: string | null;
    coverImage?: string | null;
    isFavorite?: boolean;
    updatedAt: Date | string;
  }
>({
  items,
  columns,
  hasFavorite = true,
  hasImage = true,
  onEdit,
  onDelete,
  onToggleFavorite,
  emptyLabel = "Henüz kayıt yok",
}: GenericDataTableProps<T>) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="font-heading text-lg text-gray-400">{emptyLabel}</p>
        <p className="font-body text-sm text-gray-400">
          &quot;Yeni Ekle&quot; butonuyla ilk kaydını oluştur.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-soft">
      <table className="w-full text-left">
        <thead className="bg-hover/60">
          <tr className="font-body text-xs uppercase tracking-wide text-gray-500">
            <th className="w-10 px-4 py-3"></th>
            {hasImage && <th className="px-4 py-3">Görsel</th>}
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3">
                {col.label}
              </th>
            ))}
            {hasFavorite && <th className="px-4 py-3">Favori</th>}
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
              {hasImage && (
                <td className="px-4 py-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-primary">
                    {item.coverImage && (
                      <Image src={item.coverImage} alt={item.title ?? ""} fill className="object-cover" />
                    )}
                  </div>
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render ? col.render(item) : (item as any)[col.key] ?? "—"}
                </td>
              ))}
              {hasFavorite && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggleFavorite?.(item)}
                    className={cn(
                      "rounded-full p-1.5 transition-colors",
                      item.isFavorite ? "text-accent" : "text-gray-300 hover:text-accent"
                    )}
                    title="Favori durumunu değiştir"
                  >
                    <Heart className="h-4 w-4" fill={item.isFavorite ? "currentColor" : "none"} />
                  </button>
                </td>
              )}
              <td className="px-4 py-3 text-gray-400">{formatDate(item.updatedAt)}</td>
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
