import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
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
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, email, password, role, specialty } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role === "admin" ? "admin" : role === "doctor" ? "doctor" : "user",
      specialty: role === "doctor" ? specialty || null : null,
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
}
