import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { issueId } = await params;
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      student: true,
      assignment: true
    }
  });

  if (!issue) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Authorization Check
  if (session.user.role === 'STUDENT' && issue.studentId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(issue);
}
