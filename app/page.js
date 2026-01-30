import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Book, Plus, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-white p-4">
        <Book className="w-16 h-16 mb-4 text-[#7d8590]" />
        <h1 className="text-4xl font-bold mb-2">Welcome to GitClass</h1>
        <p className="text-[#7d8590] mb-8 text-center max-w-md">
          A professional assignment management platform inspired by the GitHub workflow.
        </p>
        <Link href="/login">
          <Button size="lg" className="bg-[#238636] hover:bg-[#2ea043] text-white">
            Sign in to your account
          </Button>
        </Link>
      </div>
    );
  }

  const userClasses = await prisma.classMember.findMany({
    where: { userId: session.user.id },
    include: { class: { include: { teacher: true } } }
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Book className="w-6 h-6 text-[#7d8590]" />
            Your Classes
          </h2>
          {session.user.role === 'TEACHER' && (
            <Button className="bg-[#238636] hover:bg-[#2ea043] text-white gap-2">
              <Plus className="w-4 h-4" /> New Class
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userClasses.length > 0 ? (
            userClasses.map(({ class: c }) => (
              <Link key={c.id} href={`/repo/${c.id}`}>
                <Card className="bg-[#161b22] border-[#30363d] hover:border-[#8b949e] transition-colors cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Book className="w-4 h-4 text-[#7d8590]" />
                        <CardTitle className="text-[#58a6ff] group-hover:underline">{c.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-[#7d8590] mt-2 line-clamp-2">
                      {c.description || "No description provided."}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-4 text-xs text-[#7d8590]">
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-[#f1e05a]"></span>
                        JavaScript
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Teacher: {c.teacher.name}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full border-2 border-dashed border-[#30363d] rounded-xl p-12 text-center">
              <Book className="w-12 h-12 mx-auto mb-4 text-[#30363d]" />
              <p className="text-[#7d8590]">You are not enrolled in any classes yet.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
