import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, json, boolean, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().$type<"dokter" | "perawat">(),
  specialization: text("specialization"),
  licenseNumber: text("license_number"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  dateOfBirth: timestamp("date_of_birth"),
  status: text("status").notNull().default("aktif").$type<"aktif" | "non-aktif">(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull().$type<"Pria" | "Wanita">(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  bloodType: text("blood_type").$type<"A" | "B" | "AB" | "O" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-">(),
  allergies: text("allergies"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  recordNumber: text("record_number").notNull().unique(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  doctorId: integer("doctor_id").notNull().references(() => users.id),
  visitDate: timestamp("visit_date").notNull().defaultNow(),
  chiefComplaint: text("chief_complaint").notNull(),
  examinationResults: text("examination_results").notNull(),
  diagnosis: text("diagnosis").notNull(),
  treatmentPlan: text("treatment_plan").notNull(),
  treatmentType: text("treatment_type").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("draft").$type<"draft" | "finalized">(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  medicalRecordId: integer("medical_record_id").notNull().references(() => medicalRecords.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  duration: text("duration").notNull(),
  instructions: text("instructions"),
});

export const procedures = pgTable("procedures", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull().$type<"Scaling" | "Tambal" | "Cabut" | "Orthodonti" | "Lainnya">(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const medicalRecordProcedures = pgTable("medical_record_procedures", {
  id: serial("id").primaryKey(),
  medicalRecordId: integer("medical_record_id").notNull().references(() => medicalRecords.id, { onDelete: "cascade" }),
  procedureId: integer("procedure_id").notNull().references(() => procedures.id),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull().default("0"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const medicalRecordPackages = pgTable("medical_record_packages", {
  id: serial("id").primaryKey(),
  medicalRecordId: integer("medical_record_id").notNull().references(() => medicalRecords.id, { onDelete: "cascade" }),
  packageId: integer("package_id").notNull().references(() => packages.id),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull().default("0"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const queue = pgTable("queue", {
  id: serial("id").primaryKey(),
  queueNumber: integer("queue_number").notNull(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  doctorId: integer("doctor_id").notNull().references(() => users.id),
  appointmentTime: timestamp("appointment_time").notNull(),
  status: text("status").notNull().default("waiting").$type<"waiting" | "in-progress" | "completed" | "cancelled">(),
  queueDate: timestamp("queue_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull().references(() => users.id),
  patientId: integer("patient_id").references(() => patients.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  type: text("type").notNull().$type<"appointment" | "leave" | "holiday">(),
  status: text("status").notNull().default("scheduled").$type<"scheduled" | "completed" | "cancelled">(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull().$type<"patient" | "appointment" | "system">(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  medicalRecords: many(medicalRecords),
  queue: many(queue),
  appointments: many(appointments),
  notifications: many(notifications),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
  medicalRecords: many(medicalRecords),
  queue: many(queue),
  appointments: many(appointments),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one, many }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
  doctor: one(users, {
    fields: [medicalRecords.doctorId],
    references: [users.id],
  }),
  medications: many(medications),
  procedures: many(medicalRecordProcedures),
  packages: many(medicalRecordPackages),
}));

export const medicationsRelations = relations(medications, ({ one }) => ({
  medicalRecord: one(medicalRecords, {
    fields: [medications.medicalRecordId],
    references: [medicalRecords.id],
  }),
}));

export const proceduresRelations = relations(procedures, ({ many }) => ({
  medicalRecordProcedures: many(medicalRecordProcedures),
}));

export const medicalRecordProceduresRelations = relations(medicalRecordProcedures, ({ one }) => ({
  medicalRecord: one(medicalRecords, {
    fields: [medicalRecordProcedures.medicalRecordId],
    references: [medicalRecords.id],
  }),
  procedure: one(procedures, {
    fields: [medicalRecordProcedures.procedureId],
    references: [procedures.id],
  }),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  medicalRecordPackages: many(medicalRecordPackages),
}));

export const medicalRecordPackagesRelations = relations(medicalRecordPackages, ({ one }) => ({
  medicalRecord: one(medicalRecords, {
    fields: [medicalRecordPackages.medicalRecordId],
    references: [medicalRecords.id],
  }),
  package: one(packages, {
    fields: [medicalRecordPackages.packageId],
    references: [packages.id],
  }),
}));

export const queueRelations = relations(queue, ({ one }) => ({
  patient: one(patients, {
    fields: [queue.patientId],
    references: [patients.id],
  }),
  doctor: one(users, {
    fields: [queue.doctorId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  doctor: one(users, {
    fields: [appointments.doctorId],
    references: [users.id],
  }),
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  recordNumber: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
});

export const insertProcedureSchema = createInsertSchema(procedures).omit({
  id: true,
});

export const insertMedicalRecordProcedureSchema = createInsertSchema(medicalRecordProcedures).omit({
  id: true,
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

export const insertMedicalRecordPackageSchema = createInsertSchema(medicalRecordPackages).omit({
  id: true,
});

export const insertQueueSchema = createInsertSchema(queue).omit({
  id: true,
  createdAt: true,
  queueDate: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;

export type Procedure = typeof procedures.$inferSelect;
export type InsertProcedure = z.infer<typeof insertProcedureSchema>;

export type MedicalRecordProcedure = typeof medicalRecordProcedures.$inferSelect;
export type InsertMedicalRecordProcedure = z.infer<typeof insertMedicalRecordProcedureSchema>;

export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;

export type MedicalRecordPackage = typeof medicalRecordPackages.$inferSelect;
export type InsertMedicalRecordPackage = z.infer<typeof insertMedicalRecordPackageSchema>;

export type Queue = typeof queue.$inferSelect;
export type InsertQueue = z.infer<typeof insertQueueSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
