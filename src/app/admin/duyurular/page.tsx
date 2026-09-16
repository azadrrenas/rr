"use client";

import { CategoryAdminPage } from "@/components/admin/CategoryAdminPage";
import type { ColumnConfig } from "@/components/admin/GenericDataTable";
import { formatDate } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  isFavorite: boolean;
  coverImage: string | null;
  updatedAt: string;
  createdAt: string;
}

const columns: ColumnConfig<Announcement>[] = [
  {
    key: "createdAt",
    label: "Yayın Tarihi",
    render: (item) => formatDate(item.createdAt),
  },
];

export default function AdminAnnouncementsPage() {
  return (
    <CategoryAdminPage<Announcement>
      apiPath="announcements"
      adminBasePath="/admin/duyurular"
      title="Duyurular"
      columns={columns}
    />
  );
}