"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import { GenericDataTable, ColumnConfig } from "@/components/admin/GenericDataTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";

interface CategoryAdminPageProps<T extends { id: string; title?: string | null; isFavorite?: boolean }> {
  apiPath: string; // ör. "bags"
  adminBasePath: string; // ör. "/admin/cantalar"
  title: string;
  columns: ColumnConfig<T>[];
  hasFavorite?: boolean;
}

export function CategoryAdminPage<
  T extends { id: string; title?: string | null; isFavorite?: boolean }
>({ apiPath, adminBasePath, title, columns, hasFavorite = true }: CategoryAdminPageProps<T>) {
  const router = useRouter();
  const [items, setItems] = useState<T[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("sort", "order");
    params.set("pageSize", "50");

    const res = await fetch(`/api/${apiPath}?${params.toString()}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setIsLoading(false);
  }, [apiPath, query]);

  useEffect(() => {
    const timeout = setTimeout(fetchItems, 250);
    return () => clearTimeout(timeout);
  }, [fetchItems]);

  async function handleToggleFavorite(item: T) {
    setItems((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    const res = await fetch(`/api/${apiPath}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !item.isFavorite }),
    });
    if (!res.ok) {
      toast.error("Güncellenemedi.");
      fetchItems();
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    const res = await fetch(`/api/${apiPath}/${pendingDelete.id}`, { method: "DELETE" });
    setIsDeleting(false);

    if (!res.ok) {
      toast.error("Silinemedi.");
      return;
    }
    toast.success("Silindi.");
    setPendingDelete(null);
    fetchItems();
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-gray-800">{title}</h1>
          <p className="font-body text-sm text-gray-500">{items.length} kayıt</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ara..."
              className="rounded-full border border-border bg-white py-2 pl-10 pr-4 font-body text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <Link
            href={`${adminBasePath}/yeni`}
            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-body text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-glow"
          >
            <Plus className="h-4 w-4" />
            Yeni Ekle
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <GenericDataTable
          items={items as any}
          columns={columns as any}
          hasFavorite={hasFavorite}
          onEdit={(item) => router.push(`${adminBasePath}/${item.id}`)}
          onDelete={(item: any) => setPendingDelete(item)}
          onToggleFavorite={(item: any) => handleToggleFavorite(item)}
        />
      )}

      <ConfirmDialog
        isOpen={!!pendingDelete}
        message={`"${pendingDelete?.title}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
