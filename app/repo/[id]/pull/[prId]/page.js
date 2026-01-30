"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppLayout } from "@/components/AppLayout";
import { RepoHeader } from "@/components/RepoHeader";
import { DiffView } from "@/components/DiffView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitPullRequest, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PRDetailsPage() {
  const { id, prId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [pr, setPr] = useState(null);
  const [oldFile, setOldFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function fetchData() {
      const prRes = await fetch(`/api/repo/${id}/pulls/${prId}`);
      const prData = await prRes.json();
      setPr(prData);
      setGrade(prData.grade || "");

      const proposedFile = prData.proposedFiles[0];
      setNewFile(proposedFile);

      const oldRes = await fetch(`/api/repo/${id}/files?path=${proposedFile.path}`);
      const oldData = await oldRes.json();
      setOldFile(oldData);

      setLoading(false);
    }
    fetchData();
  }, [id, prId]);

  const handleAction = async (status) => {
    await fetch(`/api/repo/${id}/pulls/${prId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, grade, teacherComment: comment }),
    });
    router.refresh();
    // Re-fetch data
    const prRes = await fetch(`/api/repo/${id}/pulls/${prId}`);
    const prData = await prRes.json();
    setPr(prData);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AppLayout>
      <RepoHeader repoName="Class Repo" ownerName="Teacher" />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-2xl mb-2">
            <span className="font-semibold text-[#f0f6fc]">{pr.title}</span>
            <span className="text-[#7d8590] font-light">#{prId.slice(-4)}</span>
          </div>
          <div className="flex items-center gap-2 mb-6 border-b border-[#30363d] pb-6">
            <Badge className={`${pr.status === 'OPEN' ? 'bg-[#238636]' : pr.status === 'MERGED' ? 'bg-[#8957e5]' : 'bg-[#da3633]'} text-white flex items-center gap-1`}>
              <GitPullRequest className="w-3 h-3" /> {pr.status}
            </Badge>
            <span className="text-[#7d8590] text-sm">
              <span className="font-semibold text-[#f0f6fc]">{pr.student.name}</span> wants to merge changes into <span className="font-mono bg-[#161b22] px-1 rounded">main</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-[#161b22] border-[#30363d] text-white">
              <CardHeader className="flex flex-row items-center gap-4 py-3 border-b border-[#30363d]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{pr.student.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="font-semibold">{pr.student.name}</span> commented 2 days ago
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <p>{pr.description || "No description provided."}</p>
              </CardContent>
            </Card>

            <h3 className="text-sm font-semibold text-[#7d8590] uppercase tracking-wider">Changes</h3>
            <DiffView oldContent={oldFile?.content || ""} newContent={newFile?.content || ""} />
          </div>

          <div className="space-y-6">
            {session?.user.role === 'TEACHER' && pr.status === 'OPEN' && (
              <Card className="bg-[#161b22] border-[#30363d] text-white">
                <CardHeader className="py-3 border-b border-[#30363d]">
                  <CardTitle className="text-sm">Review & Grade</CardTitle>
                </CardHeader>
                <CardContent className="py-4 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[#7d8590]">Grade (0-100)</label>
                    <Input
                      type="number"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="bg-[#0d1117] border-[#30363d] h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#7d8590]">Feedback</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="bg-[#0d1117] border-[#30363d] min-h-[100px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      onClick={() => handleAction('MERGED')}
                      className="bg-[#238636] hover:bg-[#2ea043] text-white w-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Merge & Approve
                    </Button>
                    <Button
                      onClick={() => handleAction('CLOSED')}
                      variant="outline"
                      className="border-[#da3633] text-[#da3633] hover:bg-[#da3633] hover:text-white w-full"
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Close with suggestions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-sm border-t border-[#30363d] pt-4">
              <h4 className="font-semibold text-[#7d8590] mb-2">Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#7d8590]">Reviewers</span>
                  <span className="text-[#f0f6fc]">Teacher Lee</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8590]">Grade</span>
                  <span className="text-[#f0f6fc] font-bold">{pr.grade ?? 'Pending'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
