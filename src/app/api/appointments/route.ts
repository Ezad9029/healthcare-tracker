import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { appointmentSchema } from "@/lib/validation";

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

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where: { userId: session.user.id },
        orderBy: { appointmentDate: "asc" },
        skip,
        take: limit,
      }),
      prisma.appointment.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
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
    const validated = appointmentSchema.parse(body);

    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        appointmentName: validated.appointmentName,
        doctorName: validated.doctorName || "",
        appointmentDate: new Date(validated.appointmentDate),
        appointmentStartTime: validated.appointmentStartTime,
        appointmentEndTime: validated.appointmentEndTime,
        notes: validated.notes,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: JSON.parse(error.message) },
        { status: 400 }
      );
    }
    console.error("Failed to create appointment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
