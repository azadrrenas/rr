import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface CategoryCardProps {
  href: string;
  title: string;
  icon: LucideIcon;
  delay?: number;
}

export function CategoryCard({ href, title, icon: Icon, delay = 0 }: CategoryCardProps) {
  return (
    <Link href={href}>
      <Card
        delay={delay}
        className="flex flex-col items-center gap-3 px-6 py-8 text-center cursor-pointer"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <span className="font-heading text-base font-medium text-gray-800">
          {title}
        </span>
      </Card>
    </Link>
  );
}
