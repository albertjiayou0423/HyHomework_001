"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";

export default function NewAssignmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/repo/${id}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, deadline }),
      });

      if (res.ok) {
        router.push(`/repo/${id}`);
      } else {
        alert("Failed to create assignment");
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
        <h1 className="text-2xl font-semibold mb-6">Create new assignment</h1>
        <Card className="bg-[#161b22] border-[#30363d] text-white">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab 2: Data Structures"
                  className="bg-[#0d1117] border-[#30363d]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Description / Instructions (Markdown)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide instructions for the assignment..."
                  className="bg-[#0d1117] border-[#30363d] min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Deadline
                </label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="bg-[#0d1117] border-[#30363d]"
                  required
                />
              </div>

              <div className="pt-4 border-t border-[#30363d]">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#238636] hover:bg-[#2ea043] text-white"
                >
                  {loading ? "Creating..." : "Create assignment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
