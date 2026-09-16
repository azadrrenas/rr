import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <Card delay={delay} className="flex items-center gap-4 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div>
        <p className="font-heading text-2xl font-semibold text-gray-800">
          {value}
        </p>
        <p className="font-body text-xs text-gray-500">{label}</p>
      </div>
    </Card>
  );
}
