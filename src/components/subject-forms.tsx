"use client";

import { AngleType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function CreateSubjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [angleType, setAngleType] = useState<AngleType>(AngleType.guide);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          await fetch("/api/subjects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, brief, angleType }),
          });
          setTitle("");
          setBrief("");
          setAngleType(AngleType.guide);
          router.refresh();
        });
      }}
    >
      <Input placeholder="Subject title" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <Textarea placeholder="Short plan for the article" value={brief} onChange={(event) => setBrief(event.target.value)} required />
      <Select value={angleType} onChange={(event) => setAngleType(event.target.value as AngleType)}>
        {Object.values(AngleType).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Add subject"}
      </Button>
    </form>
  );
}

export function SubjectRowActions({ subjectId, onMove }: { subjectId: string; onMove: (direction: "up" | "down") => Promise<void> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function removeSubject() {
    await fetch(`/api/subjects/${subjectId}`, { method: "DELETE" });
    router.refresh();
  }

  async function generateArticle() {
    await fetch(`/api/subjects/${subjectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_article" }),
    });
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" disabled={isPending} onClick={() => startTransition(() => onMove("up"))}>
        Up
      </Button>
      <Button variant="outline" disabled={isPending} onClick={() => startTransition(() => onMove("down"))}>
        Down
      </Button>
      <Button variant="secondary" disabled={isPending} onClick={() => startTransition(generateArticle)}>
        Write now
      </Button>
      <Button
        variant="destructive"
        disabled={isPending}
        onClick={() => {
          if (window.confirm("Delete this subject?")) {
            startTransition(removeSubject);
          }
        }}
      >
        Delete
      </Button>
    </div>
  );
}
