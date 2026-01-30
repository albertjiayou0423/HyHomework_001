"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { RepoHeader } from "@/components/RepoHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleDot, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function IssueDetailsPage() {
  const { id, issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  async function fetchComments() {
    const res = await fetch(`/api/repo/${id}/comments?issueId=${issueId}`);
    const data = await res.json();
    setComments(data);
  }

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/repo/${id}/issues/${issueId}`);
      const data = await res.json();
      setIssue(data);
      await fetchComments();
      setLoading(false);
    }
    fetchData();
  }, [id, issueId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    const res = await fetch(`/api/repo/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment, issueId }),
    });
    if (res.ok) {
      setNewComment("");
      fetchComments();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AppLayout>
      <RepoHeader repoName="Class Repo" ownerName="Teacher" />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-normal mb-2 text-[#f0f6fc]">{issue.title} <span className="text-[#7d8590]">#{issueId.slice(-4)}</span></h1>
          <div className="flex items-center gap-2 pb-4 border-b border-[#30363d]">
            <Badge className={`${issue.status === 'OPEN' ? 'bg-[#238636]' : 'bg-[#8957e5]'} text-white flex items-center gap-1 px-3 py-1`}>
              <CircleDot className="w-4 h-4" /> {issue.status}
            </Badge>
            <span className="text-[#7d8590] text-sm">
              <span className="font-semibold text-[#f0f6fc]">{issue.student.name}</span> opened this issue for {issue.assignment.title}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#161b22] border-[#30363d] text-white">
            <CardHeader className="flex flex-row items-center gap-4 py-3 border-b border-[#30363d] bg-[#161b22]">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{issue.student.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold">{issue.student.name}</span> commented
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <MarkdownRenderer content={issue.description} />
            </CardContent>
          </Card>

          {comments.map((c) => (
            <Card key={c.id} className="bg-[#161b22] border-[#30363d] text-white">
              <CardHeader className="flex flex-row items-center gap-4 py-2 border-b border-[#30363d] bg-[#161b22]">
                <Avatar className="w-6 h-6">
                  <AvatarFallback>{c.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-semibold">{c.user.name}</span> commented
                </div>
              </CardHeader>
              <CardContent className="py-3">
                <MarkdownRenderer content={c.content} />
              </CardContent>
            </Card>
          ))}

          <div className="pt-4 space-y-4">
            <Textarea
              placeholder="Leave a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-[#0d1117] border-[#30363d] min-h-[120px]"
            />
            <div className="flex justify-end">
              <Button onClick={handlePostComment} className="bg-[#238636] hover:bg-[#2ea043] text-white">
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
