import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { userId: session.user.id },
    orderBy: { appointmentDate: "asc" },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { appointmentName, doctorName, appointmentDate, appointmentStartTime, appointmentEndTime } = body;

  if (!appointmentName || !appointmentDate || !appointmentStartTime || !appointmentEndTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      userId: session.user.id,
      appointmentName,
      doctorName: doctorName || "",
      appointmentDate: new Date(appointmentDate),
      appointmentStartTime,
      appointmentEndTime,
    },
  });

  return NextResponse.json(appointment, { status: 201 });
}
