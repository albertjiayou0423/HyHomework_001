import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { prId } = await params;
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pr = await prisma.pullRequest.findUnique({
    where: { id: prId },
    include: {
      student: true,
      proposedFiles: true
    }
  });

  if (!pr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Authorization Check
  if (session.user.role === 'STUDENT' && pr.studentId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(pr);
}

export async function PATCH(req, { params }) {
  const { prId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'TEACHER') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status, grade, teacherComment } = await req.json();

  try {
    const pr = await prisma.pullRequest.update({
      where: { id: prId },
      data: {
        status,
        grade: grade ? parseFloat(grade) : null,
        teacherComment
      },
      include: { proposedFiles: true, assignment: true }
    });

    if (status === 'MERGED') {
      // Apply changes to the main branch
      for (const proposedFile of pr.proposedFiles) {
        await prisma.file.updateMany({
          where: {
            classId: pr.assignment.classId,
            path: proposedFile.path,
            isMainBranch: true
          },
          data: {
            content: proposedFile.content
          }
        });
      }
    }

    return NextResponse.json(pr);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
