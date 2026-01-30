import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'TEACHER') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { assignmentId, content } = await req.json();

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    const folderPath = assignment.title.replace(/\s+/g, '');

    await prisma.file.create({
      data: {
        path: `${folderPath}/solution/README.md`,
        content: content,
        classId: id,
        assignmentId: assignment.id,
        isMainBranch: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
