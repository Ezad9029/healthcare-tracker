import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const appointmentSchema = z.object({
  appointmentName: z.string().min(1, "Appointment name is required"),
  doctorName: z.string().optional(),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentStartTime: z.string().min(1, "Start time is required"),
  appointmentEndTime: z.string().min(1, "End time is required"),
  notes: z.string().optional(),
});

export const appointmentUpdateSchema = z.object({
  appointmentName: z.string().optional(),
  doctorName: z.string().optional(),
  appointmentDate: z.string().optional(),
  appointmentStartTime: z.string().optional(),
  appointmentEndTime: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
});

export const healthCheckSchema = z.object({
  title: z.string().min(1, "Title is required"),
  icon: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  progress: z.number().min(0).max(100),
  color: z.string().min(1, "Color is required"),
});

export const healthCheckUpdateSchema = z.object({
  title: z.string().optional(),
  icon: z.string().optional(),
  date: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  color: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
});

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "doctor", "admin"]).optional(),
  specialty: z.string().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["user", "doctor", "admin"]).optional(),
  specialty: z.string().optional(),
});
