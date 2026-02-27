"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RunCheckButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleCheck() {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/accountability/check", { method: "POST" });
    const data = await res.json();

    setResult(
      `Processed ${data.processed}: ${data.reminders} reminders, ${data.warnings} warnings, ${data.escalations} escalations`
    );
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      {result && (
        <span className="text-xs text-muted-foreground">{result}</span>
      )}
      <Button onClick={handleCheck} disabled={loading} variant="outline">
        {loading ? "Running..." : "Run Check"}
      </Button>
    </div>
  );
}
