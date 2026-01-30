import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, assignmentId } = await req.json();

  try {
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        studentId: session.user.id,
        assignmentId,
        status: "OPEN"
      }
    });

    return NextResponse.json(issue);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const issues = await prisma.issue.findMany({
    where: {
      assignment: { classId: id },
      ...(session.user.role === 'STUDENT' ? { studentId: session.user.id } : {})
    },
    include: {
      student: true,
      assignment: true
    }
  });

  return NextResponse.json(issues);
}
