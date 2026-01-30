import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppLayout } from "@/components/AppLayout";
import { RepoHeader } from "@/components/RepoHeader";
import { FileExplorer } from "@/components/FileExplorer";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Book, ChevronRight, Folder } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { canStudentSeeFile } from "@/lib/auth-utils";

export default async function RepoPage({ params, searchParams }) {
  const { id } = await params;
  const { path = "" } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const repo = await prisma.class.findUnique({
    where: { id },
    include: { teacher: true, assignments: true }
  });

  if (!repo) return <div>Class not found</div>;

  // Fetch contributors (Teacher + Students with merged PRs)
  const mergedPRs = await prisma.pullRequest.findMany({
    where: {
      assignment: { classId: id },
      status: 'MERGED'
    },
    include: { student: true }
  });

  // Unique students who have merged PRs
  const uniqueStudents = [];
  const seenIds = new Set();
  mergedPRs.forEach(pr => {
    if (!seenIds.has(pr.studentId)) {
      seenIds.add(pr.studentId);
      uniqueStudents.push(pr.student);
    }
  });

  // Fetch all files in main branch for this class
  let allFiles = await prisma.file.findMany({
    where: {
      classId: id,
      isMainBranch: true,
      prId: null
    }
  });

  // Filter files for students
  if (session.user.role === 'STUDENT') {
    allFiles = allFiles.filter(file => {
      const assignment = repo.assignments.find(a => a.id === file.assignmentId);
      return canStudentSeeFile(file, session, assignment);
    });
  }

  // Filter files by current path and group into directories
  const currentLevelFiles = [];
  const directories = new Map();

  allFiles.forEach(file => {
    if (path === "") {
      // At root
      const parts = file.path.split('/');
      if (parts.length === 1) {
        currentLevelFiles.push({
          id: file.id,
          name: file.path,
          path: file.path,
          type: "FILE"
        });
      } else {
        const dirName = parts[0];
        if (!directories.has(dirName)) {
          directories.set(dirName, {
            id: dirName,
            name: dirName,
            path: dirName,
            type: "DIRECTORY"
          });
        }
      }
    } else {
      // In a subdirectory
      if (file.path.startsWith(path + "/")) {
        const remaining = file.path.substring(path.length + 1);
        const parts = remaining.split('/');
        if (parts.length === 1) {
          currentLevelFiles.push({
            id: file.id,
            name: parts[0],
            path: file.path,
            type: "FILE"
          });
        } else {
          const dirName = parts[0];
          const fullDirPath = path + "/" + dirName;
          if (!directories.has(fullDirPath)) {
            directories.set(fullDirPath, {
              id: fullDirPath,
              name: dirName,
              path: fullDirPath,
              type: "DIRECTORY"
            });
          }
        }
      }
    }
  });

  const displayFiles = [...Array.from(directories.values()), ...currentLevelFiles];

  // Find README to display (either in current folder or root)
  const readme = allFiles.find(f => {
    if (path === "") {
        return f.path.toLowerCase() === 'readme.md';
    } else {
        return f.path.toLowerCase() === (path + '/readme.md').toLowerCase();
    }
  });

  const pathParts = path ? path.split('/') : [];

  return (
    <AppLayout>
      <RepoHeader repoName={repo.name} ownerName={repo.teacher.name} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
             <Link href={`/repo/${id}`} className="text-[#58a6ff] hover:underline font-semibold">
               {repo.name}
             </Link>
             {pathParts.map((part, idx) => (
               <div key={idx} className="flex items-center gap-2">
                 <ChevronRight className="w-3 h-3 text-[#7d8590]" />
                 <Link
                   href={`/repo/${id}?path=${pathParts.slice(0, idx + 1).join('/')}`}
                   className="text-[#58a6ff] hover:underline font-semibold"
                 >
                   {part}
                 </Link>
               </div>
             ))}
          </div>

          {session.user.role === 'TEACHER' && path === "" && (
            <Link href={`/repo/${id}/new-assignment`}>
              <Button className="bg-[#238636] hover:bg-[#2ea043] text-white gap-2">
                New Assignment
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="mb-6">
              <FileExplorer files={displayFiles} repoName={repo.id} currentPath={path} />
            </div>

            {readme && (
              <div className="border border-[#30363d] rounded-md bg-[#0d1117]">
                <div className="bg-[#161b22] p-3 border-b border-[#30363d] flex items-center gap-2 text-sm font-semibold">
                  <Book className="w-4 h-4" />
                  {readme.path}
                </div>
                <div className="p-8">
                  <MarkdownRenderer content={readme.content} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-[#f0f6fc] mb-4">About</h3>
              <p className="text-sm text-[#7d8590]">{repo.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#f0f6fc] mb-4">Contributors</h3>
              <div className="flex flex-wrap gap-2">
                <Avatar title={`Teacher: ${repo.teacher.name}`} className="w-8 h-8 ring-1 ring-[#30363d] cursor-help">
                  <AvatarFallback className="bg-blue-900">{repo.teacher.name[0]}</AvatarFallback>
                </Avatar>
                {uniqueStudents.map(student => (
                  <Avatar key={student.id} title={`Student: ${student.name}`} className="w-8 h-8 ring-1 ring-[#30363d] cursor-help">
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
