export const runtime = "nodejs";

import { getDashboardData } from "@/lib/dashboard";

export async function GET() {
  return Response.json(await getDashboardData());
}
