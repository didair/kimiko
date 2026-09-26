"use client";

import type { Subject } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubjectRowActions } from "@/components/subject-forms";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";

export function SubjectsTable({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const queued = subjects.filter((subject) => subject.status === "queued");
  const archived = subjects.filter((subject) => subject.status !== "queued");

  async function reorder(ids: string[]) {
    await fetch("/api/subjects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    router.refresh();
  }

  async function moveSubject(subjectId: string, direction: "up" | "down") {
    const index = queued.findIndex((subject) => subject.id === subjectId);
    if (index < 0) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= queued.length) {
      return;
    }

    const next = [...queued];
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    await reorder(next.map((subject) => subject.id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{queued.length} active subjects</p>
        <p className="text-xs text-muted-foreground">Articles are written from top to bottom</p>
      </div>

      <div className="space-y-3 md:hidden">
        {queued.map((subject) => (
          <article key={subject.id} className="rounded-2xl bg-card p-4 shadow-[0_1px_0_rgba(23,33,29,0.06),0_12px_28px_rgba(23,33,29,0.045)] ring-1 ring-foreground/6">
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#17211d] font-heading text-sm text-white">
                {subject.position}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="font-heading text-lg leading-snug text-foreground">{subject.title}</h4>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{subject.brief}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{subject.angleType.replaceAll("_", " ")}</Badge>
                  <StatusBadge tone={subject.source === "manual" ? "warning" : "neutral"}>{subject.source}</StatusBadge>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-black/6 pt-3">
              <SubjectRowActions subject={subject} onMove={(direction) => moveSubject(subject.id, direction)} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl bg-card shadow-[0_1px_0_rgba(23,33,29,0.06),0_14px_36px_rgba(23,33,29,0.045)] ring-1 ring-foreground/6 md:block">
        <ScrollArea className="h-[min(640px,calc(100vh-15rem))]">
          <Table>
            <TableHeader className="bg-muted/45">
              <TableRow>
                <TableHead className="pl-5">Queue</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Angle</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queued.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="pl-5">
                    <span className="grid size-8 place-items-center rounded-full bg-[#17211d] font-heading text-sm text-white">{subject.position}</span>
                  </TableCell>
                  <TableCell className="max-w-xl py-4 align-top whitespace-normal">
                    <p className="font-heading text-base font-medium text-foreground">{subject.title}</p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">{subject.brief}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{subject.angleType.replaceAll("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={subject.source === "manual" ? "warning" : "neutral"}>{subject.source}</StatusBadge>
                  </TableCell>
                  <TableCell className="pr-5">
                    <SubjectRowActions subject={subject} onMove={(direction) => moveSubject(subject.id, direction)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {archived.length > 0 ? (
        <div className="space-y-3">
          <div>
            <h4 className="font-heading text-xl text-foreground">Archive</h4>
            <p className="text-sm text-muted-foreground">Previously used or skipped ideas.</p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-card shadow-[0_1px_0_rgba(23,33,29,0.06)] ring-1 ring-foreground/6">
            <ScrollArea className="max-h-80">
              <Table>
                <TableHeader className="bg-muted/45">
                  <TableRow>
                    <TableHead className="pl-5">Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5">Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archived.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="pl-5 py-4 align-top whitespace-normal">
                        <p className="font-medium text-foreground">{subject.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{subject.brief}</p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={subject.status === "used" ? "success" : "warning"}>{subject.status}</StatusBadge>
                      </TableCell>
                      <TableCell className="pr-5 text-muted-foreground">{formatDate(subject.usedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      ) : null}
    </div>
  );
}
