import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, prId, issueId, line } = await req.json();

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        prId,
        issueId,
        line: line ? parseInt(line) : null
      },
      include: { user: true }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const prId = searchParams.get('prId');
  const issueId = searchParams.get('issueId');

  const comments = await prisma.comment.findMany({
    where: {
      OR: [
        { prId: prId || undefined },
        { issueId: issueId || undefined }
      ]
    },
    include: { user: true },
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json(comments);
}
