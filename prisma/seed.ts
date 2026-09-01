import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.healthCheck.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: { name: "Super Admin", email: "admin@healthcare.com", passwordHash: adminHash, role: "admin" },
  });

  const userHash = await bcrypt.hash("user123", 12);
  const user = await prisma.user.create({
    data: { name: "John Doe", email: "john@example.com", passwordHash: userHash, role: "user" },
  });

  const docHash = await bcrypt.hash("doctor123", 12);
  const drSmith = await prisma.user.create({
    data: { name: "Dr. Smith", email: "drsmith@healthcare.com", passwordHash: docHash, role: "doctor", specialty: "Cardiology" },
  });
  const drPatel = await prisma.user.create({
    data: { name: "Dr. Patel", email: "drpatel@healthcare.com", passwordHash: docHash, role: "doctor", specialty: "Dentistry" },
  });
  const drChen = await prisma.user.create({
    data: { name: "Dr. Chen", email: "drchen@healthcare.com", passwordHash: docHash, role: "doctor", specialty: "Dermatology" },
  });

  // Health checks
  await prisma.healthCheck.createMany({
    data: [
      { userId: admin.id, title: "Lungs", icon: "🫁", date: new Date(), progress: 80, color: "#D63A3A" },
      { userId: admin.id, title: "Teeth", icon: "🦷", date: new Date(), progress: 50, color: "#43BDBB" },
      { userId: admin.id, title: "Bone", icon: "🦴", date: new Date(), progress: 65, color: "#FF914D" },
      { userId: user.id, title: "Heart", icon: "❤️", date: new Date(), progress: 90, color: "#EF4444" },
      { userId: user.id, title: "Eyes", icon: "👁️", date: new Date(), progress: 70, color: "#8B5CF6" },
    ],
  });

  const today = new Date();
  const day = (offset: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return d;
  };

  // Appointments
  await prisma.appointment.createMany({
    data: [
      // Admin appointments
      { userId: admin.id, doctorId: drPatel.id, appointmentName: "Dentist Checkup", doctorName: "Dr. Patel", appointmentDate: day(0), appointmentStartTime: "09:00", appointmentEndTime: "10:00", status: "scheduled" },
      { userId: admin.id, doctorId: drSmith.id, appointmentName: "Cardiology", doctorName: "Dr. Smith", appointmentDate: day(2), appointmentStartTime: "11:00", appointmentEndTime: "12:00", status: "scheduled" },
      { userId: admin.id, doctorId: drSmith.id, appointmentName: "Heart Follow-up", doctorName: "Dr. Smith", appointmentDate: day(4), appointmentStartTime: "14:00", appointmentEndTime: "14:45", status: "scheduled" },
      // User appointments
      { userId: user.id, doctorId: drPatel.id, appointmentName: "Dentist Checkup", doctorName: "Dr. Patel", appointmentDate: day(1), appointmentStartTime: "09:30", appointmentEndTime: "10:15", status: "scheduled" },
      { userId: user.id, doctorId: drChen.id, appointmentName: "Dermatology", doctorName: "Dr. Chen", appointmentDate: day(3), appointmentStartTime: "15:00", appointmentEndTime: "15:30", status: "scheduled" },
      { userId: user.id, doctorId: drSmith.id, appointmentName: "General Checkup", doctorName: "Dr. Smith", appointmentDate: day(5), appointmentStartTime: "10:00", appointmentEndTime: "11:00", status: "completed" },
      // More appointments for Dr. Smith
      { userId: admin.id, doctorId: drSmith.id, appointmentName: "Heart Review", doctorName: "Dr. Smith", appointmentDate: day(-1), appointmentStartTime: "16:00", appointmentEndTime: "16:30", status: "completed" },
    ],
  });

  console.log("───────────────────────────────────────────");
  console.log("  ✅  Database seeded successfully!");
  console.log("───────────────────────────────────────────");
  console.log("  Admin:     admin@healthcare.com / admin123");
  console.log("  User:      john@example.com / user123");
  console.log("  Doctor:    drsmith@healthcare.com / doctor123");
  console.log("  Doctor:    drpatel@healthcare.com / doctor123");
  console.log("  Doctor:    drchen@healthcare.com / doctor123");
  console.log("───────────────────────────────────────────");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
