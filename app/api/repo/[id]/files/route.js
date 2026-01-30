import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { canStudentSeeFile } from "@/lib/auth-utils";

export async function GET(req, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const file = await prisma.file.findFirst({
    where: {
      classId: id,
      path: path,
      isMainBranch: true
    },
    include: { assignment: true }
  });

  if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

  // Authorization Check
  if (!canStudentSeeFile(file, session, file.assignment)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(file);
}
