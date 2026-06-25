import { ShoppingBag, CalendarDays, TrendingUp, BarChart3 } from "lucide-react";
import { formatDZD } from "@/lib/utils";
import type { OrderStats } from "@/lib/queries/orders";

function Card({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-light text-brand">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function StatCards({ stats }: { stats: OrderStats }) {
  const topVariant = Object.entries(stats.byVariant).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card
        label="Total orders"
        value={stats.total.toLocaleString("en-US")}
        icon={<ShoppingBag className="size-5" />}
      />
      <Card
        label="Today"
        value={stats.today.toLocaleString("en-US")}
        hint={`${stats.week.toLocaleString("en-US")} in last 7 days`}
        icon={<CalendarDays className="size-5" />}
      />
      <Card
        label="Est. revenue"
        value={formatDZD(stats.estRevenue)}
        hint="total orders × unit price"
        icon={<TrendingUp className="size-5" />}
      />
      <Card
        label="Top variant"
        value={topVariant && topVariant[1] > 0 ? topVariant[0] : "—"}
        hint={
          topVariant && topVariant[1] > 0
            ? `${topVariant[1]} orders`
            : "no data yet"
        }
        icon={<BarChart3 className="size-5" />}
      />
    </div>
  );
}
