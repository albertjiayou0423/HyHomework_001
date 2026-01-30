import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppLayout } from "@/components/AppLayout";
import { RepoHeader } from "@/components/RepoHeader";
import { GitPullRequest, Check, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function PRListPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const repo = await prisma.class.findUnique({
    where: { id },
    include: { teacher: true }
  });

  const pulls = await prisma.pullRequest.findMany({
    where: {
      assignment: { classId: id },
      ...(session.user.role === 'STUDENT' ? { studentId: session.user.id } : {})
    },
    include: { student: true, assignment: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <AppLayout>
      <RepoHeader repoId={id} repoName={repo.name} ownerName={repo.teacher.name} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="border border-[#30363d] rounded-md bg-[#0d1117]">
          <div className="bg-[#161b22] p-4 border-b border-[#30363d] flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-[#f0f6fc] font-semibold">
              <GitPullRequest className="w-4 h-4" />
              {pulls.filter(p => p.status === 'OPEN').length} Open
            </div>
            <div className="flex items-center gap-1 text-[#7d8590]">
              <Check className="w-4 h-4" />
              {pulls.filter(p => p.status !== 'OPEN').length} Closed
            </div>
          </div>

          <div className="divide-y divide-[#30363d]">
            {pulls.length > 0 ? (
              pulls.map((pr) => (
                <div key={pr.id} className="p-4 hover:bg-[#161b22] group">
                  <div className="flex items-start gap-2">
                    <GitPullRequest className={`w-4 h-4 mt-1 ${pr.status === 'OPEN' ? 'text-[#3fb950]' : pr.status === 'MERGED' ? 'text-[#a371f7]' : 'text-[#f85149]'}`} />
                    <div className="flex-1">
                      <Link
                        href={`/repo/${id}/pull/${pr.id}`}
                        className="text-[#f0f6fc] font-semibold text-base hover:text-[#58a6ff]"
                      >
                        {pr.title}
                      </Link>
                      <div className="text-xs text-[#7d8590] mt-1">
                        #{pr.id.slice(-4)} opened by {pr.student.name} for {pr.assignment.title}
                      </div>
                    </div>
                    {pr.grade !== null && (
                      <Badge variant="outline" className="text-[#3fb950] border-[#3fb950]">
                        Grade: {pr.grade}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-[#7d8590]">
                <GitPullRequest className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No pull requests found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
