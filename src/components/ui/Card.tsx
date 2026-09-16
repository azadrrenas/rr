"use client";

import { motion } from "framer-motion";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
}

export function Card({ className, children, delay = 0, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className={cn(
        "rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-glow",
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
