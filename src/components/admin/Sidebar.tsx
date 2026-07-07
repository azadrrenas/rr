"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  PenLine,
  NotebookPen,
  Clapperboard,
  Tv,
  Music2,
  Images,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/parfumler", label: "Parfümler", icon: Sparkles },
  { href: "/admin/cantalar", label: "Çantalar", icon: ShoppingBag },
  { href: "/admin/kalemler", label: "Kalemler", icon: PenLine },
  { href: "/admin/kirtasiye", label: "Kırtasiye", icon: NotebookPen },
  { href: "/admin/filmler", label: "Filmler", icon: Clapperboard },
  { href: "/admin/diziler", label: "Diziler", icon: Tv },
  { href: "/admin/muzik-notalari", label: "Müzik Notaları", icon: Music2 },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Çıkış yapıldı");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-white/70 backdrop-blur-md">
      <div className="px-6 py-6">
        <h1 className="font-heading text-lg font-semibold text-gray-800">
          Admin Paneli
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          if ((link as any).disabled) {
            return (
              <div
                key={link.href}
                title="Yakında eklenecek"
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm text-gray-300"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </div>
            );
          }
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm text-gray-600 transition-colors hover:bg-hover",
                active && "bg-primary text-accent font-medium"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
