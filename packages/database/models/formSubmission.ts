import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { formsTable } from "./form";
import { formFieldsTable } from "./formField";
import { usersTable } from "./user";

export const formSubmissionsTable = pgTable("forms_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),
  submittedBy: uuid("submitted_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  answers: jsonb("answers").$type<Record<string, any>>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const formAnswersTable = pgTable("forms_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => formSubmissionsTable.id, { onDelete: "cascade" }),
  fieldId: uuid("field_id")
    .notNull()
    .references(() => formFieldsTable.id, { onDelete: "cascade" }),
  value: text("value"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectFormSubmission = typeof formSubmissionsTable.$inferSelect;
export type InsertFormSubmission = typeof formSubmissionsTable.$inferInsert;

export type SelectFormAnswer = typeof formAnswersTable.$inferSelect;
export type InsertFormAnswer = typeof formAnswersTable.$inferInsert;
