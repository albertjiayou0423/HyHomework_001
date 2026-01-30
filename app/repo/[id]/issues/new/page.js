"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewIssuePage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/repo/${id}/assignments`)
      .then(res => res.json())
      .then(data => setAssignments(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/repo/${id}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, assignmentId }),
      });

      if (res.ok) {
        router.push(`/repo/${id}/issues`);
      } else {
        alert("Failed to create issue");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-6">Open a new issue</h1>
        <Card className="bg-[#161b22] border-[#30363d] text-white">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Related Assignment</label>
                <Select onValueChange={setAssignmentId} required>
                  <SelectTrigger className="bg-[#0d1117] border-[#30363d]">
                    <SelectValue placeholder="Select an assignment" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161b22] border-[#30363d] text-white">
                    {assignments.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="bg-[#0d1117] border-[#30363d]"
                required
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Leave a comment"
                className="bg-[#0d1117] border-[#30363d] min-h-[200px]"
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#238636] hover:bg-[#2ea043] text-white"
                >
                  Submit new issue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
