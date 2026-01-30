"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileCode, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function EditPage() {
  const { id, path } = useParams();
  const filePath = path.join('/');
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prTitle, setPrTitle] = useState("");
  const [prDescription, setPrDescription] = useState("");

  useEffect(() => {
    fetch(`/api/repo/${id}/files?path=${filePath}`)
      .then(res => res.json())
      .then(data => {
        setContent(data.content);
        setPrTitle(`Update ${filePath}`);
        setLoading(false);
      });
  }, [id, filePath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/repo/${id}/pulls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prTitle,
          description: prDescription,
          path: filePath,
          content
        }),
      });

      if (res.ok) {
        const pr = await res.json();
        router.push(`/repo/${id}/pull/${pr.id}`);
      } else {
        alert("Failed to create pull request");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link href={`/repo/${id}`} className="text-[#58a6ff] hover:underline">Repo</Link>
          <span className="text-[#7d8590]">/</span>
          <span className="text-[#f0f6fc]">{filePath}</span>
        </div>

        <div className="border border-[#30363d] rounded-md bg-[#0d1117] overflow-hidden">
          <Tabs defaultValue="edit">
            <div className="bg-[#161b22] px-4 pt-2 border-b border-[#30363d] flex items-center justify-between">
              <TabsList className="bg-transparent border-none">
                <TabsTrigger value="edit" className="data-[state=active]:bg-[#0d1117] data-[state=active]:border-[#30363d] border-b-0 rounded-t-md px-4 py-2 text-xs">
                  <FileCode className="w-3 h-3 mr-2" /> Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-[#0d1117] data-[state=active]:border-[#30363d] border-b-0 rounded-t-md px-4 py-2 text-xs">
                  <BookOpen className="w-3 h-3 mr-2" /> Preview
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="edit" className="m-0">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[500px] bg-[#0d1117] border-none focus-visible:ring-0 font-mono text-sm p-6 resize-none"
              />
            </TabsContent>
            <TabsContent value="preview" className="m-0 p-8">
              <MarkdownRenderer content={content} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 border border-[#30363d] rounded-md bg-[#161b22] p-6">
          <h3 className="text-lg font-semibold mb-4">Propose changes</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              placeholder="Title your changes"
              className="bg-[#0d1117] border-[#30363d]"
              required
            />
            <Textarea
              value={prDescription}
              onChange={(e) => setPrDescription(e.target.value)}
              placeholder="Add an optional extended description..."
              className="bg-[#0d1117] border-[#30363d] min-h-[100px]"
            />
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#238636] hover:bg-[#2ea043] text-white"
            >
              {saving ? "Creating PR..." : "Propose changes"}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

import Link from "next/link";
