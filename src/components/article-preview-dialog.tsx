"use client";

import { EyeIcon } from "lucide-react";
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

export function ArticlePreviewDialog({
  title,
  subjectTitle,
  excerpt,
  contentHtml,
}: {
  title: string;
  subjectTitle: string;
  excerpt: string;
  contentHtml: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <EyeIcon />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl rounded-lg p-0 sm:max-w-4xl">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{subjectTitle}</DialogDescription>
          <p className="text-sm leading-6 text-muted-foreground">{excerpt}</p>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <div className="px-6 py-6">
            <article
              className="mx-auto max-w-3xl rounded-lg border border-border bg-white p-6 text-foreground shadow-sm [&_a]:text-primary [&_article]:space-y-5 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_section]:mt-6"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
