import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const healthChecks = await prisma.healthCheck.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(healthChecks);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, icon, date, progress, color } = body;

  if (!title || !date || progress === undefined || !color) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const healthCheck = await prisma.healthCheck.create({
    data: {
      userId: session.user.id,
      title,
      icon: icon || "🩺",
      date: new Date(date),
      progress: Number(progress),
      color,
    },
  });

  return NextResponse.json(healthCheck, { status: 201 });
}
