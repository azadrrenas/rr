"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/parfumler", label: "Parfümler" },
  { href: "/cantalar", label: "Çantalar" },
  { href: "/kalemler", label: "Kalemler" },
  { href: "/kirtasiye", label: "Kırtasiye" },
  { href: "/dizi-film", label: "Dizi & Film" },
  { href: "/muzik-notalari", label: "Müzik Notaları" },
  { href: "/galeri", label: "Galeri" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/70 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-semibold text-gray-800">
          <Sparkles className="h-5 w-5 text-accent" />
          Bizim Koleksiyonumuz
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-body text-sm text-gray-600 transition-colors hover:text-accent",
                pathname === link.href && "text-accent font-medium"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="hidden items-center gap-1.5 rounded-full border border-border bg-white/60 px-4 py-2 font-body text-sm text-gray-700 transition-colors hover:bg-hover sm:flex"
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
          <button
            className="rounded-full p-2 text-gray-700 hover:bg-hover lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menüyü aç/kapat"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-col gap-1 bg-white/90 backdrop-blur-md px-6 pb-4 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 font-body text-sm text-gray-700 hover:bg-hover"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-3 py-2 font-body text-sm text-accent"
          >
            Admin Girişi
          </Link>
        </motion.nav>
      )}
    </motion.header>
  );
}
