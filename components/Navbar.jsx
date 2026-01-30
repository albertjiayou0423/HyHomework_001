"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Github, LogOut, User, Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-[#010409] text-white border-b border-[#30363d]">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Github className="w-8 h-8" />
        </Link>
        <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1 text-sm text-[#7d8590] w-64">
          <Search className="w-4 h-4 mr-2" />
          <span>Search or jump to...</span>
          <span className="ml-auto border border-[#30363d] rounded px-1 text-xs">/</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
          <Link href="/pulls" className="hover:text-[#7d8590]">Pull requests</Link>
          <Link href="/issues" className="hover:text-[#7d8590]">Issues</Link>
          <Link href="/marketplace" className="hover:text-[#7d8590]">Marketplace</Link>
          <Link href="/explore" className="hover:text-[#7d8590]">Explore</Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-white hover:bg-[#30363d]">
          <Bell className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#30363d]">
              <Plus className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#161b22] border-[#30363d] text-white">
            <DropdownMenuItem className="hover:bg-[#1f242c]">New assignment</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#1f242c]">New class</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer ring-1 ring-[#30363d]">
                <AvatarImage src={session.user.image} />
                <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#161b22] border-[#30363d] text-white w-48">
              <div className="px-2 py-1.5 text-sm text-[#7d8590]">
                Signed in as <span className="text-white font-semibold">{session.user.email}</span>
              </div>
              <DropdownMenuItem className="hover:bg-[#1f242c] cursor-pointer">
                <User className="w-4 h-4 mr-2" /> Your profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-[#1f242c] cursor-pointer text-red-400"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button size="sm" variant="outline" className="border-[#30363d] text-white hover:bg-[#30363d]">Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
