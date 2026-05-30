export const runtime = "nodejs";

import { AngleType } from "@prisma/client";
import { listSubjects, createManualSubject } from "@/lib/subjects";

export async function GET() {
  return Response.json(await listSubjects());
}

export async function POST(request: Request) {
  const body = (await request.json()) as { title: string; brief: string; angleType?: AngleType };
  const subject = await createManualSubject({
    title: body.title,
    brief: body.brief,
    angleType: body.angleType ?? AngleType.guide,
  });
  return Response.json(subject, { status: 201 });
}
