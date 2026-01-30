"use client";

import { Book, Star, GitFork, Eye, Settings, Code, CircleDot, GitPullRequest, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function RepoHeader({ repoId, repoName, ownerName, isPublic = true }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Code", icon: Code, href: `/repo/${repoId}` },
    { label: "Issues", icon: CircleDot, href: `/repo/${repoId}/issues`, count: 0 },
    { label: "Pull requests", icon: GitPullRequest, href: `/repo/${repoId}/pulls`, count: 0 },
    { label: "Actions", icon: Layout, href: `/repo/${repoId}/actions` },
    { label: "Settings", icon: Settings, href: `/repo/${repoId}/settings` },
  ];

  return (
    <div className="bg-[#0d1117] border-b border-[#30363d] pt-4">
      <div className="px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-xl">
          <Book className="w-5 h-5 text-[#7d8590]" />
          <Link href={`/${ownerName}`} className="text-[#58a6ff] hover:underline">{ownerName}</Link>
          <span className="text-[#7d8590]">/</span>
          <Link href={`/repo/${repoId}`} className="font-semibold text-[#58a6ff] hover:underline">{repoName}</Link>
          <Badge variant="outline" className="text-[#7d8590] border-[#30363d] rounded-full text-xs ml-2 uppercase">
            {isPublic ? "Public" : "Private"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]">
            <Eye className="w-4 h-4 mr-2" /> Watch <span className="ml-1 bg-[#30363d] px-1 rounded text-xs text-white">1</span>
          </Button>
          <Button variant="outline" size="sm" className="bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]">
            <GitFork className="w-4 h-4 mr-2" /> Fork <span className="ml-1 bg-[#30363d] px-1 rounded text-xs text-white">0</span>
          </Button>
          <Button variant="outline" size="sm" className="bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]">
            <Star className="w-4 h-4 mr-2" /> Star <span className="ml-1 bg-[#30363d] px-1 rounded text-xs text-white">0</span>
          </Button>
        </div>
      </div>

      <div className="px-4 md:px-8 flex overflow-x-auto gap-4 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== `/repo/${repoName}` && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex items-center gap-2 px-3 py-2 text-sm border-b-2 transition-colors ${
                isActive
                  ? "border-[#f78166] text-[#f0f6fc]"
                  : "border-transparent text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#8b949e]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className="bg-[#30363d] text-[#f0f6fc] text-xs px-1.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
