"use client";

import { CategoryListingPage } from "@/components/public/CategoryListingPage";
import { GenericCard } from "@/components/public/GenericCard";
import type { Bag } from "@/types";

export default function BagsPage() {
  return (
    <CategoryListingPage<Bag>
      apiPath="bags"
      title="Çantalar"
      subtitle="Her davette yanında olan, özenle seçilmiş çantalar."
      searchPlaceholder="Çanta, marka veya model ara..."
      renderCard={(bag, i) => (
        <GenericCard
          key={bag.id}
          item={bag}
          subtitle={bag.brand}
          metaLine={[bag.model, bag.color].filter(Boolean).join(" · ") || null}
          delay={i * 0.05}
        />
      )}
    />
  );
}
