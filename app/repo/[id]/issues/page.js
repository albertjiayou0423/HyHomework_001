import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppLayout } from "@/components/AppLayout";
import { RepoHeader } from "@/components/RepoHeader";
import { CircleDot, Check, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function IssueListPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const repo = await prisma.class.findUnique({
    where: { id },
    include: { teacher: true }
  });

  const issues = await prisma.issue.findMany({
    where: {
      assignment: { classId: id },
      ...(session.user.role === 'STUDENT' ? { studentId: session.user.id } : {})
    },
    include: { student: true, assignment: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <AppLayout>
      <RepoHeader repoName={repo.name} ownerName={repo.teacher.name} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex justify-end mb-4">
          <Link href={`/repo/${id}/issues/new`}>
            <Button className="bg-[#238636] hover:bg-[#2ea043] text-white">
              New Issue
            </Button>
          </Link>
        </div>

        <div className="border border-[#30363d] rounded-md bg-[#0d1117]">
          <div className="bg-[#161b22] p-4 border-b border-[#30363d] flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-[#f0f6fc] font-semibold">
              <CircleDot className="w-4 h-4 text-[#3fb950]" />
              {issues.filter(i => i.status === 'OPEN').length} Open
            </div>
            <div className="flex items-center gap-1 text-[#7d8590]">
              <Check className="w-4 h-4" />
              {issues.filter(i => i.status === 'CLOSED').length} Closed
            </div>
          </div>

          <div className="divide-y divide-[#30363d]">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <div key={issue.id} className="p-4 hover:bg-[#161b22] group">
                  <div className="flex items-start gap-2">
                    <CircleDot className={`w-4 h-4 mt-1 ${issue.status === 'OPEN' ? 'text-[#3fb950]' : 'text-[#7d8590]'}`} />
                    <div className="flex-1">
                      <Link
                        href={`/repo/${id}/issue/${issue.id}`}
                        className="text-[#f0f6fc] font-semibold text-base hover:text-[#58a6ff]"
                      >
                        {issue.title}
                      </Link>
                      <div className="text-xs text-[#7d8590] mt-1">
                        #{issue.id.slice(-4)} opened by {issue.student.name} for {issue.assignment.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-[#7d8590]">
                <CircleDot className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No issues found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
