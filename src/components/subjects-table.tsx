"use client";

import type { Subject } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { SubjectRowActions } from "@/components/subject-forms";
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
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Table>
          <THead>
            <tr>
              <TH>Queue</TH>
              <TH>Subject</TH>
              <TH>Angle</TH>
              <TH>Source</TH>
              <TH>Actions</TH>
            </tr>
          </THead>
          <TBody>
            {queued.map((subject) => (
              <tr key={subject.id}>
                <TD className="font-medium text-slate-900">{subject.position}</TD>
                <TD>
                  <p className="font-medium text-slate-900">{subject.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{subject.brief}</p>
                </TD>
                <TD>
                  <Badge>{subject.angleType}</Badge>
                </TD>
                <TD>
                  <Badge tone={subject.source === "manual" ? "warning" : "default"}>{subject.source}</Badge>
                </TD>
                <TD>
                  <SubjectRowActions subjectId={subject.id} onMove={(direction) => moveSubject(subject.id, direction)} />
                </TD>
              </tr>
            ))}
          </TBody>
        </Table>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Table>
          <THead>
            <tr>
              <TH>Archived</TH>
              <TH>Status</TH>
              <TH>Used</TH>
            </tr>
          </THead>
          <TBody>
            {archived.map((subject) => (
              <tr key={subject.id}>
                <TD>
                  <p className="font-medium text-slate-900">{subject.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{subject.brief}</p>
                </TD>
                <TD>
                  <Badge tone={subject.status === "used" ? "success" : "warning"}>{subject.status}</Badge>
                </TD>
                <TD>{formatDate(subject.usedAt)}</TD>
              </tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
