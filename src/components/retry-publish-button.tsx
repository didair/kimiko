"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RetryPublishButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        variant="secondary"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError(null);
          try {
            const response = await fetch(`/api/content/${articleId}/retry-publish`, {
              method: "POST",
            });

            if (!response.ok) {
              const body = (await response.json().catch(() => null)) as { error?: string } | null;
              throw new Error(body?.error ?? "Retry publish failed");
            }

            router.refresh();
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Retry publish failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Retrying..." : "Retry publish"}
      </Button>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
