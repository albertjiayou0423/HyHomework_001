"use client";

import { Folder, File as FileIcon, GitCommit, ChevronRight } from "lucide-react";
import Link from "next/link";

export function FileExplorer({ files, currentPath = "", repoName }) {
  // Sort files: directories first, then files
  const sortedFiles = [...files].sort((a, b) => {
    if (a.type === "DIRECTORY" && b.type !== "DIRECTORY") return -1;
    if (a.type !== "DIRECTORY" && b.type === "DIRECTORY") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="border border-[#30363d] rounded-md overflow-hidden bg-[#0d1117]">
      <div className="bg-[#161b22] p-3 border-b border-[#30363d] flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#21262d] flex items-center justify-center">
            <GitCommit className="w-3 h-3 text-[#7d8590]" />
          </div>
          <span className="font-semibold text-[#f0f6fc]">teacher</span>
          <span className="text-[#7d8590]">Initial commit</span>
        </div>
        <div className="text-[#7d8590]">
          latest commit <span className="text-[#f0f6fc] font-mono">abc1234</span> · 2 days ago
        </div>
      </div>

      <div className="divide-y divide-[#30363d]">
        {currentPath && (
           <div className="flex items-center p-3 hover:bg-[#161b22] text-sm group">
             <div className="w-6 flex items-center">
               <Folder className="w-4 h-4 text-[#54aeff] fill-[#54aeff]/20" />
             </div>
             <div className="flex-1 min-w-0 px-2">
               <Link
                 href={`/repo/${repoName}?path=${currentPath.split('/').slice(0, -1).join('/')}`}
                 className="text-[#58a6ff] hover:underline font-bold"
               >
                 ..
               </Link>
             </div>
           </div>
        )}
        {sortedFiles.map((file) => (
          <div key={file.id} className="flex items-center p-3 hover:bg-[#161b22] text-sm group">
            <div className="w-6 flex items-center">
              {file.type === "DIRECTORY" ? (
                <Folder className="w-4 h-4 text-[#54aeff] fill-[#54aeff]/20" />
              ) : (
                <FileIcon className="w-4 h-4 text-[#7d8590]" />
              )}
            </div>
            <div className="flex-1 min-w-0 px-2">
              <Link
                href={file.type === "DIRECTORY" ? `/repo/${repoName}?path=${file.path}` : `/repo/${repoName}/blob/${file.path}`}
                className="text-[#f0f6fc] hover:text-[#58a6ff] hover:underline block truncate"
              >
                {file.name}
              </Link>
            </div>
            <div className="flex-1 text-[#7d8590] hidden md:block truncate">
              Update {file.name}
            </div>
            <div className="text-[#7d8590] text-xs w-24 text-right">
              2 days ago
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
