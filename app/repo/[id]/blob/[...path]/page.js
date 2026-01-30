import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppLayout } from "@/components/AppLayout";
import { RepoHeader } from "@/components/RepoHeader";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { FileCode, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { canStudentSeeFile } from "@/lib/auth-utils";

export default async function BlobPage({ params }) {
  const { id, path } = await params;
  const filePath = path.map(decodeURIComponent).join('/');
  console.log("DEBUG: filePath =", filePath);
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const repo = await prisma.class.findUnique({
    where: { id },
    include: { teacher: true }
  });

  const file = await prisma.file.findFirst({
    where: {
      classId: id,
      path: filePath,
      isMainBranch: true
    },
    include: { assignment: true }
  });

  if (!file) return <div>File not found</div>;

  // Authorization Check
  if (!canStudentSeeFile(file, session, file.assignment)) {
    return <div>Access Denied</div>;
  }

  return (
    <AppLayout>
      <RepoHeader repoName={repo.name} ownerName={repo.teacher.name} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="border border-[#30363d] rounded-md bg-[#0d1117] overflow-hidden">
          <div className="bg-[#161b22] p-3 border-b border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <FileCode className="w-4 h-4 text-[#7d8590]" />
              <span className="font-semibold">{file.path}</span>
            </div>
            {(session.user.role === 'TEACHER' || session.user.id === file.userId) && (
              <div className="flex gap-2">
                <Link href={`/repo/${id}/edit/${filePath}`}>
                  <Button variant="outline" size="sm" className="bg-[#21262d] border-[#30363d] h-7 px-2">
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="bg-[#21262d] border-[#30363d] h-7 px-2 text-red-400">
                  <Trash className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            )}
          </div>
          <div className="p-8">
            {file.path.endsWith('.md') ? (
              <MarkdownRenderer content={file.content} />
            ) : (
              <pre className="text-sm font-mono whitespace-pre-wrap text-[#f0f6fc]">{file.content}</pre>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
