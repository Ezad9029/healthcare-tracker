import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Verify ownership
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      status: body.status ?? existing.status,
      appointmentName: body.appointmentName ?? existing.appointmentName,
      doctorName: body.doctorName ?? existing.doctorName,
      appointmentDate: body.appointmentDate
        ? new Date(body.appointmentDate)
        : existing.appointmentDate,
      appointmentStartTime: body.appointmentStartTime ?? existing.appointmentStartTime,
      appointmentEndTime: body.appointmentEndTime ?? existing.appointmentEndTime,
      notes: body.notes ?? existing.notes,
    },
  });

  return NextResponse.json(appointment);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.appointment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
