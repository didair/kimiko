"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

  return (
    <Button
      variant={variant}
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
      {loading ? "Running..." : label}
    </Button>
  );
}
