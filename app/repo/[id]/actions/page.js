import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppLayout } from "@/components/AppLayout";
import { RepoHeader } from "@/components/RepoHeader";
import { Layout, CheckCircle, Clock, XCircle, Play } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ActionsPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const repo = await prisma.class.findUnique({
    where: { id },
    include: { teacher: true }
  });

  // Simulated workflow runs based on PRs
  const prs = await prisma.pullRequest.findMany({
    where: { assignment: { classId: id } },
    include: { student: true, assignment: true },
    orderBy: { createdAt: 'desc' }
  });

  const workflows = [
    { id: 1, name: "Autograder", status: "active" },
    { id: 2, name: "Setup-node", status: "idle" },
  ];

  return (
    <AppLayout>
      <RepoHeader repoId={id} repoName={repo.name} ownerName={repo.teacher.name} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#f0f6fc]">
          <Layout className="w-5 h-5" /> All workflows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="border border-[#30363d] rounded-md overflow-hidden bg-[#0d1117]">
              {workflows.map((wf) => (
                <div key={wf.id} className="p-3 text-sm border-b border-[#30363d] last:border-0 hover:bg-[#161b22] cursor-pointer text-[#7d8590] hover:text-[#f0f6fc]">
                  {wf.name}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="border border-[#30363d] rounded-md bg-[#0d1117] divide-y divide-[#30363d]">
              <div className="p-4 bg-[#161b22] text-sm text-[#7d8590]">
                {prs.length} workflow runs
              </div>
              {prs.map((pr, idx) => (
                <div key={pr.id} className="p-4 flex items-center justify-between hover:bg-[#161b22]">
                  <div className="flex items-center gap-3">
                    {idx === 0 ? (
                      <CheckCircle className="w-5 h-5 text-[#3fb950]" />
                    ) : idx === 1 ? (
                      <Clock className="w-5 h-5 text-[#d29922]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#f85149]" />
                    )}
                    <div>
                      <div className="text-[#f0f6fc] font-semibold hover:text-[#58a6ff] cursor-pointer">
                        Autograde: {pr.title}
                      </div>
                      <div className="text-xs text-[#7d8590]">
                        {pr.assignment.title} · #{pr.id.slice(-4)}: pushed by {pr.student.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#7d8590]">
                    1/30/2026
                  </div>
                </div>
              ))}
              {prs.length === 0 && (
                <div className="p-12 text-center text-[#7d8590]">
                  No workflow runs found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
