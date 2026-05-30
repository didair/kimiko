"use client";

import { FileJsonIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export function JsonDetailsDialog({
  title,
  description,
  value,
  triggerLabel = "Details",
}: {
  title: string;
  description?: string;
  value: string | null | undefined;
  triggerLabel?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileJsonIcon />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-lg p-0 sm:max-w-3xl">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <pre className="overflow-x-auto px-6 py-6 text-xs leading-6 text-foreground">
            {value ?? "n/a"}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
