"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { RepoHeader } from "@/components/RepoHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleDot, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function IssueDetailsPage() {
  const { id, issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/repo/${id}/issues/${issueId}`)
      .then(res => res.json())
      .then(data => {
        setIssue(data);
        setLoading(false);
      });
  }, [id, issueId]);

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
              <p>{issue.description}</p>
            </CardContent>
          </Card>

          <div className="border-l-2 border-[#30363d] ml-8 pl-8 py-2 text-[#7d8590] text-sm italic">
            Discussion system coming soon...
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
