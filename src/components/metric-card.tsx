import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <Card className="rounded-lg border bg-white shadow-none">
      <CardHeader className="gap-1 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <CardDescription className="text-xs">{hint}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
