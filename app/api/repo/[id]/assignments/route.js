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

  const { title, description, deadline } = await req.json();

  try {
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        classId: id,
      }
    });

    // Create Assignment folder and README
    const folderPath = title.replace(/\s+/g, '');
    await prisma.file.create({
      data: {
        path: `${folderPath}/README.md`,
        content: `# ${title}\n\n${description}`,
        classId: id,
        assignmentId: assignment.id,
        isMainBranch: true
      }
    });

    // Create folders for all students in the class
    const members = await prisma.classMember.findMany({
      where: { classId: id, user: { role: 'STUDENT' } },
      include: { user: true }
    });

    for (const member of members) {
      await prisma.file.create({
        data: {
          path: `${folderPath}/${member.user.name}/README.md`,
          content: `# ${member.user.name}'s Submission for ${title}`,
          classId: id,
          assignmentId: assignment.id,
          userId: member.user.id,
          isMainBranch: true
        }
      });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
