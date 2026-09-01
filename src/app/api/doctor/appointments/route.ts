import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "doctor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: session.user.id },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { appointmentDate: "asc" },
  });

  return NextResponse.json(appointments);
}
