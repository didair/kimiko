import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-card shadow-[0_1px_0_rgba(23,33,29,0.08),0_12px_30px_rgba(23,33,29,0.05)]">
      <div className="absolute inset-y-0 left-0 w-1 bg-[#e7be3d]" />
      <CardHeader className="gap-1 pb-1 pl-6">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="pl-6">
        <p className={cn("font-heading leading-none tracking-tight text-foreground", typeof value === "string" && value.length > 12 ? "text-2xl" : "text-4xl")}>
          {value}
        </p>
        <CardDescription className="mt-2 text-xs leading-5">{hint}</CardDescription>
      </CardContent>
    </Card>
  );
}
