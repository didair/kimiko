"use client";

import { FilePenLineIcon, Loader2Icon, NewspaperIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const endpointIcons = {
  "/api/jobs/crawl": SearchIcon,
  "/api/jobs/generate-subjects": FilePenLineIcon,
  "/api/jobs/generate-article": NewspaperIcon,
};

export function JobButton({
  endpoint,
  label,
  body,
  variant = "secondary",
}: {
  endpoint: string;
  label: string;
  body?: Record<string, unknown>;
  variant?: "default" | "secondary" | "outline" | "destructive";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const Icon = endpointIcons[endpoint as keyof typeof endpointIcons] ?? FilePenLineIcon;

  return (
    <Button
      variant={variant}
      size="sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body ?? {}),
          });
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <Loader2Icon className="animate-spin" /> : <Icon />}
      {loading ? "Running..." : label}
    </Button>
  );
}
