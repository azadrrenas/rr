"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Megaphone, Pin, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  externalLink: string | null;
  isFavorite: boolean;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/announcements?pageSize=50");
        const data = await res.json();
        setItems(data.items ?? []);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-3xl px-6 pb-24 pt-32">
        <div className="mb-14 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Megaphone className="h-5 w-5 text-accent" />
          </div>
          <h1 className="font-heading text-4xl font-semibold text-gray-800">Duyurular</h1>
          <p className="mt-3 font-body text-gray-500">Koleksiyona neler eklendiğini buradan takip et.</p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-heading text-xl text-gray-400">Henüz duyuru yok</p>
          </div>
        ) : (
          <div className="relative space-y-8 border-l-2 border-border pl-8">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="absolute -left-[41px] top-7 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />

                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-body text-xs text-gray-400">{formatDate(item.createdAt)}</span>
                  {item.isFavorite && (
                    <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 font-body text-xs font-medium text-accent">
                      <Pin className="h-3 w-3" />
                      Öne Çıkan
                    </span>
                  )}
                </div>

                <h2 className="mb-2 font-heading text-xl font-semibold text-gray-800">{item.title}</h2>

                {item.coverImage && (
                  <div className="relative mb-3 h-48 w-full overflow-hidden rounded-xl bg-primary">
                    <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
                  </div>
                )}

                {item.description && (
                  <p className="whitespace-pre-line font-body text-sm text-gray-600">{item.description}</p>
                )}

                {item.externalLink && (
                    <a
                  
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-body text-sm font-medium text-accent hover:underline"
                  >
                    Detaylar
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}