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
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border bg-white shadow-none">
        <ScrollArea className="h-[min(640px,calc(100vh-15rem))]">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="pl-4">Queue</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Angle</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queued.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="pl-4 font-medium text-foreground">{subject.position}</TableCell>
                <TableCell className="max-w-xl py-4 align-top whitespace-normal">
                  <p className="font-medium text-foreground">{subject.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{subject.brief}</p>
                </TableCell>
                <TableCell>
                  <Badge>{subject.angleType}</Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge tone={subject.source === "manual" ? "warning" : "neutral"}>{subject.source}</StatusBadge>
                </TableCell>
                <TableCell className="pr-4">
                  <SubjectRowActions subject={subject} onMove={(direction) => moveSubject(subject.id, direction)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </ScrollArea>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-none">
        <ScrollArea className="max-h-80">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="pl-4">Archived</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4">Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archived.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="pl-4 py-4 align-top whitespace-normal">
                  <p className="font-medium text-foreground">{subject.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{subject.brief}</p>
                </TableCell>
                <TableCell>
                  <StatusBadge tone={subject.status === "used" ? "success" : "warning"}>{subject.status}</StatusBadge>
                </TableCell>
                <TableCell className="pr-4">{formatDate(subject.usedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
