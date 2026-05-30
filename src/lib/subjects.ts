import { AngleType, SubjectSource, SubjectStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { dedupeBy, normalizeWhitespace } from "@/lib/utils";
import type { SubjectDraft } from "@/lib/types";

export async function listSubjects() {
  return prisma.subject.findMany({
    orderBy: [{ status: "asc" }, { position: "asc" }, { createdAt: "desc" }],
  });
}

export async function createManualSubject(input: { title: string; brief: string; angleType: AngleType }) {
  const maxPosition = await prisma.subject.aggregate({
    _max: { position: true },
    where: { status: SubjectStatus.queued },
  });

  return prisma.subject.create({
    data: {
      title: normalizeWhitespace(input.title),
      brief: normalizeWhitespace(input.brief),
      angleType: input.angleType,
      source: SubjectSource.manual,
      status: SubjectStatus.queued,
      position: (maxPosition._max.position ?? 0) + 1,
    },
  });
}

export async function updateSubject(id: string, input: Partial<{ title: string; brief: string; angleType: AngleType; status: SubjectStatus }>) {
  return prisma.subject.update({
    where: { id },
    data: {
      title: input.title ? normalizeWhitespace(input.title) : undefined,
      brief: input.brief ? normalizeWhitespace(input.brief) : undefined,
      angleType: input.angleType,
      status: input.status,
    },
  });
}

export async function deleteSubject(id: string) {
  await prisma.subject.delete({ where: { id } });
  await rebalanceQueuedSubjectPositions();
}

export async function reorderSubjects(ids: string[]) {
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.subject.update({
        where: { id },
        data: { position: index + 1 },
      }),
    ),
  );
}

export async function appendGeneratedSubjects(drafts: SubjectDraft[]) {
  const cleaned = dedupeGeneratedSubjects(drafts);
  const existing = await prisma.subject.findMany({
    where: { status: SubjectStatus.queued },
    select: { title: true },
  });
  const existingTitles = new Set(existing.map((subject) => normalizeWhitespace(subject.title).toLowerCase()));
  const maxPosition = await prisma.subject.aggregate({
    _max: { position: true },
    where: { status: SubjectStatus.queued },
  });

  let nextPosition = (maxPosition._max.position ?? 0) + 1;

  const toCreate = cleaned
    .filter((draft) => !existingTitles.has(normalizeWhitespace(draft.title).toLowerCase()))
    .map((draft) => ({
      title: normalizeWhitespace(draft.title),
      brief: normalizeWhitespace(draft.brief),
      angleType: draft.angleType,
      status: SubjectStatus.queued,
      source: SubjectSource.ai,
      position: nextPosition++,
    }));

  if (toCreate.length === 0) {
    return [];
  }

  await prisma.subject.createMany({ data: toCreate });
  return toCreate;
}

export async function getNextQueuedSubject() {
  return prisma.subject.findFirst({
    where: { status: SubjectStatus.queued },
    orderBy: { position: "asc" },
  });
}

export async function moveSubjectToTop(id: string) {
  const queued = await prisma.subject.findMany({
    where: { status: SubjectStatus.queued },
    orderBy: { position: "asc" },
  });
  const reordered = queued
    .filter((subject) => subject.id !== id)
    .map((subject) => subject.id);
  await reorderSubjects([id, ...reordered]);
}

export async function markSubjectUsed(id: string) {
  await prisma.subject.update({
    where: { id },
    data: {
      status: SubjectStatus.used,
      usedAt: new Date(),
      position: 999999,
    },
  });
  await rebalanceQueuedSubjectPositions();
}

export function dedupeGeneratedSubjects(subjects: SubjectDraft[]) {
  return dedupeBy(subjects, (subject) => normalizeWhitespace(subject.title).toLowerCase())
    .map((subject) => ({
      ...subject,
      title: normalizeWhitespace(subject.title),
      brief: normalizeWhitespace(subject.brief),
      angleType: Object.values(AngleType).includes(subject.angleType) ? subject.angleType : AngleType.guide,
    }))
    .filter((subject) => subject.title.length > 0 && subject.brief.length > 0);
}

export async function rebalanceQueuedSubjectPositions() {
  const queued = await prisma.subject.findMany({
    where: { status: SubjectStatus.queued },
    orderBy: { position: "asc" },
  });

  await prisma.$transaction(
    queued.map((subject, index) =>
      prisma.subject.update({
        where: { id: subject.id },
        data: { position: index + 1 },
      }),
    ),
  );
}
