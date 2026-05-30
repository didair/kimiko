"use client";

import { AngleType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <div className="grid gap-2">
        <Label htmlFor="subject-title">Title</Label>
        <Input
          id="subject-title"
          placeholder="Get started with smart thermostats"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subject-brief">Brief</Label>
        <Textarea
          id="subject-brief"
          placeholder="Explain what beginners should look for, where the products fit, and how to choose a first setup."
          value={brief}
          onChange={(event) => setBrief(event.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label>Angle</Label>
        <Select value={angleType} onValueChange={(value) => setAngleType(value as AngleType)}>
          <SelectTrigger className="h-10 w-full rounded-xl bg-white">
            <SelectValue placeholder="Select angle" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(AngleType).map((value) => (
              <SelectItem key={value} value={value}>
                {value.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isPending} size="lg" className="mt-2 w-full rounded-xl">
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
      <Button variant="outline" size="sm" disabled={isPending} onClick={() => startTransition(() => onMove("up"))}>
        Up
      </Button>
      <Button variant="outline" size="sm" disabled={isPending} onClick={() => startTransition(() => onMove("down"))}>
        Down
      </Button>
      <Button variant="secondary" size="sm" disabled={isPending} onClick={() => startTransition(generateArticle)}>
        Write now
      </Button>
      <Button
        variant="destructive"
        size="sm"
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
