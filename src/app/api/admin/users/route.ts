import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { userCreateSchema } from "@/lib/validation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          specialty: true,
          createdAt: true,
          appointments: {
            select: {
              id: true,
              appointmentName: true,
              doctorName: true,
              appointmentDate: true,
              appointmentStartTime: true,
              appointmentEndTime: true,
              status: true,
            },
            orderBy: { appointmentDate: "desc" },
          },
          _count: { select: { appointments: true, healthChecks: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const validated = userCreateSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: validated.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);
    const newUser = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
        role: validated.role === "admin" ? "admin" : validated.role === "doctor" ? "doctor" : "user",
        specialty: validated.role === "doctor" ? validated.specialty || null : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        specialty: true,
        createdAt: true,
        appointments: { select: { id: true } },
        _count: { select: { appointments: true, healthChecks: true } },
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: JSON.parse(error.message) },
        { status: 400 }
      );
    }
    console.error("Failed to create user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
