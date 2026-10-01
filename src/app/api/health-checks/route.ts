import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { healthCheckSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const [healthChecks, total] = await Promise.all([
      prisma.healthCheck.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.healthCheck.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      data: healthChecks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch health checks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = healthCheckSchema.parse(body);

    const healthCheck = await prisma.healthCheck.create({
      data: {
        userId: session.user.id,
        title: validated.title,
        icon: validated.icon || "🩺",
        date: new Date(validated.date),
        progress: validated.progress,
        color: validated.color,
      },
    });

    return NextResponse.json(healthCheck, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: JSON.parse(error.message) },
        { status: 400 }
      );
    }
    console.error("Failed to create health check:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
