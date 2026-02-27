"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const TAGS = [
  "TASK",
  "DOCUMENT_REQUEST",
  "MEETING_REQUEST",
  "DECISION_REQUEST",
  "DELIVERABLE",
  "APPROVAL",
  "BILLING",
  "CLIENT_REQUEST",
];

const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"];

interface Contract {
  id: string;
  name: string;
  milestones?: { id: string; title: string }[];
}

interface User {
  id: string;
  name: string;
}

export default function NewRequestPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [contractId, setContractId] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [ownerId, setOwnerId] = useState("");
  const [dueAt, setDueAt] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/contracts").then((r) => r.json()),
      fetch("/api/team").then((r) => r.json()),
    ]).then(([c, u]) => {
      setContracts(c);
      setUsers(u);
    });
  }, []);

  const selectedContract = contracts.find((c) => c.id === contractId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractId,
        milestoneId: milestoneId || undefined,
        title,
        description: description || undefined,
        tag,
        priority,
        ownerId,
        dueAt,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.violations) {
        setError(data.violations.map((v: { message: string }) => v.message).join(". "));
      } else {
        setError(data.error || "Failed to create request");
      }
      setLoading(false);
      return;
    }

    router.push("/requests");
    router.refresh();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        href="/requests"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block transition-colors"
      >
        &larr; All requests
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contract">Contract *</Label>
              <Select value={contractId} onValueChange={setContractId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contract" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedContract?.milestones && selectedContract.milestones.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="milestone">Milestone</Label>
                <Select value={milestoneId} onValueChange={setMilestoneId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select milestone (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedContract.milestones.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag">Tag *</Label>
                <Select value={tag} onValueChange={setTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAGS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">Owner *</Label>
                <Select value={ownerId} onValueChange={setOwnerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueAt">Due Date *</Label>
                <Input
                  id="dueAt"
                  type="date"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Request"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
