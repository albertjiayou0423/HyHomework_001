import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, path, content } = await req.json();

  // Authorization Check for students: can only edit files in their own folder
  if (session.user.role === 'STUDENT') {
    const parts = path.split('/');
    if (parts.length < 2 || parts[1] !== session.user.name) {
      return NextResponse.json({ error: "Forbidden: You can only propose changes to your own folder" }, { status: 403 });
    }
  }

  // Find original file to get assignment info
  const originalFile = await prisma.file.findFirst({
    where: { classId: id, path, isMainBranch: true }
  });

  if (!originalFile) return NextResponse.json({ error: "Original file not found" }, { status: 404 });

  // Check deadline
  if (originalFile.assignmentId) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: originalFile.assignmentId }
    });
    if (assignment.deadline && new Date() > assignment.deadline) {
      return NextResponse.json({ error: "Assignment deadline has passed" }, { status: 403 });
    }
  }

  try {
    const pr = await prisma.pullRequest.create({
      data: {
        title,
        description,
        studentId: session.user.id,
        assignmentId: originalFile.assignmentId,
        status: "OPEN"
      }
    });

    // Create the proposed change
    await prisma.file.create({
      data: {
        path,
        content,
        classId: id,
        assignmentId: originalFile.assignmentId,
        isMainBranch: false,
        prId: pr.id,
        userId: session.user.id
      }
    });

    return NextResponse.json(pr);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pulls = await prisma.pullRequest.findMany({
    where: {
      assignment: { classId: id },
      // Student can only see their own PRs, Teacher sees all
      ...(session.user.role === 'STUDENT' ? { studentId: session.user.id } : {})
    },
    include: { student: true }
  });

  return NextResponse.json(pulls);
}
