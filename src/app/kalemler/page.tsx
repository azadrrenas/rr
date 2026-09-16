"use client";

import { CategoryListingPage } from "@/components/public/CategoryListingPage";
import { GenericCard } from "@/components/public/GenericCard";
import type { Pen } from "@/types";

export default function PensPage() {
  return (
    <CategoryListingPage<Pen>
      apiPath="pens"
      title="Kalemler"
      subtitle="Yazmayı sevdiren, özenle seçilmiş kalemler."
      searchPlaceholder="Kalem veya marka ara..."
      renderCard={(pen, i) => (
        <GenericCard
          key={pen.id}
          item={pen}
          subtitle={pen.brand}
          metaLine={pen.model}
          delay={i * 0.05}
        />
      )}
    />
  );
}
