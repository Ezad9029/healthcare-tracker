import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { userUpdateSchema } from "@/lib/validation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const validated = userUpdateSchema.parse(body);

    if (id === admin.id) {
      return NextResponse.json({ error: "Cannot modify your own role" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(validated.role && { role: validated.role }),
        ...(validated.name && { name: validated.name }),
        specialty: validated.role === "doctor" ? validated.specialty || undefined : validated.role ? null : validated.specialty !== undefined ? validated.specialty : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        specialty: true,
        createdAt: true,
        _count: { select: { appointments: true, healthChecks: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: JSON.parse(error.message) },
        { status: 400 }
      );
    }
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    if (id === admin.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
