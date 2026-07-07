"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export function Hero({
  title = "Kalbinin Sevdiği Her Şey",
  subtitle = "Küçük detaylardan büyük bir koleksiyon: onun beğendiği parfümler, çantalar, filmler ve daha fazlası, tek bir zarif adreste.",
}: HeroProps) {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-hero-gradient px-6 pt-24">
      {/* Dekoratif yumuşak parlama efektleri */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/40 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/70 shadow-soft"
        >
          <Heart className="h-6 w-6 text-accent" fill="currentColor" />
        </motion.div>

        <h1 className="font-heading text-4xl font-semibold leading-tight text-gray-800 sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-body text-base text-gray-600 sm:text-lg">
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
}
