import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

export function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <Card className="rounded-3xl border-border/70 bg-white/85 shadow-sm backdrop-blur">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{label}</CardTitle>
          <CardDescription>{hint}</CardDescription>
        </div>
        <StatusBadge tone="neutral">Live</StatusBadge>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold tracking-tight text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
