"use client";

import { AngleType, type Subject } from "@prisma/client";
import { ArrowDownIcon, ArrowUpIcon, PenLineIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CreateSubjectForm({ onCreated }: { onCreated?: () => void }) {
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
          onCreated?.();
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
          <SelectTrigger className="h-10 w-full rounded-md bg-white">
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
      <Button type="submit" disabled={isPending} size="sm" className="mt-2 w-full">
        <PenLineIcon />
        {isPending ? "Saving..." : "Add subject"}
      </Button>
    </form>
  );
}

export function CreateSubjectDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Add subject
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add subject</DialogTitle>
          <DialogDescription>Create a manual article idea and place it at the end of the queue.</DialogDescription>
        </DialogHeader>
        <CreateSubjectForm onCreated={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export function EditSubjectDialog({ subject }: { subject: Subject }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(subject.title);
  const [brief, setBrief] = useState(subject.brief);
  const [angleType, setAngleType] = useState<AngleType>(subject.angleType);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PenLineIcon />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit subject</DialogTitle>
          <DialogDescription>Adjust the queued title, brief, or article angle before generation.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const response = await fetch(`/api/subjects/${subject.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, brief, angleType }),
              });

              if (!response.ok) {
                return;
              }

              setOpen(false);
              router.refresh();
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor={`edit-subject-title-${subject.id}`}>Title</Label>
            <Input
              id={`edit-subject-title-${subject.id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-subject-brief-${subject.id}`}>Brief</Label>
            <Textarea
              id={`edit-subject-brief-${subject.id}`}
              value={brief}
              rows={12}
              onChange={(event) => setBrief(event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Angle</Label>
            <Select value={angleType} onValueChange={(value) => setAngleType(value as AngleType)}>
              <SelectTrigger className="h-10 w-full rounded-md bg-white">
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
          <Button type="submit" disabled={isPending} size="sm" className="mt-2 w-full">
            <PenLineIcon />
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SubjectRowActions({ subject, onMove }: { subject: Subject; onMove: (direction: "up" | "down") => Promise<void> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function removeSubject() {
    await fetch(`/api/subjects/${subject.id}`, { method: "DELETE" });
    router.refresh();
  }

  async function generateArticle() {
    await fetch(`/api/subjects/${subject.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_article" }),
    });
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-sm" disabled={isPending} onClick={() => startTransition(() => onMove("up"))}>
            <ArrowUpIcon />
            <span className="sr-only">Move up</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Move up</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-sm" disabled={isPending} onClick={() => startTransition(() => onMove("down"))}>
            <ArrowDownIcon />
            <span className="sr-only">Move down</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Move down</TooltipContent>
      </Tooltip>
      <EditSubjectDialog subject={subject} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            size="icon-sm"
            disabled={isPending}
            onClick={() => {
              if (window.confirm("Delete this subject?")) {
                startTransition(removeSubject);
              }
            }}
          >
            <Trash2Icon />
            <span className="sr-only">Delete</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
      <Button variant="secondary" size="sm" disabled={isPending} onClick={() => startTransition(generateArticle)}>
        <PenLineIcon />
        Write now
      </Button>
    </div>
  );
}
