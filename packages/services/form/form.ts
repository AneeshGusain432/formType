import * as formModel from "./model";
import { db, eq, sql } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/formField";
import {
  formAnswersTable,
  formSubmissionsTable,
} from "@repo/database/models/formSubmission";

export async function createForm(payload: formModel.createFormInputType) {
  const { title, description, fields, createdBy } =
    await formModel.createFormInputModel.parseAsync(payload);

  const result = await db.transaction(async (tx) => {
    const [form] = await tx
      .insert(formsTable)
      .values({ title, description, createdBy })
      .returning();

    if (!form) {
      throw new Error("failed to create form");
    }

    const createdFields = await tx
      .insert(formFieldsTable)
      .values(
        fields.map((field) => ({
          label: field.label,
          labelKey: field.labelKey,
          placeholder: field.placeholder,
          isRequired: field.isRequired,
          type: field.type,
          index: String(field.index),
          formId: form.id,
        })),
      )
      .returning();

    if (!createdFields || createdFields.length === 0) {
      throw new Error("failed to create form fields");
    }

    return { form, fields: createdFields };
  });

  return result;
}

export async function updateForm(payload: formModel.updateFormInputType) {
  const { formId, title, description, fields } =
    await formModel.updateFormInputModel.parseAsync(payload);

  const result = await db.transaction(async (tx) => {
    // check form exists
    const [existingForm] = await tx
      .select()
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!existingForm) {
      throw new Error("form not found");
    }

    // update form metadata if provided
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    let updatedForm = existingForm;
    if (Object.keys(updateData).length > 0) {
      const [form] = await tx
        .update(formsTable)
        .set(updateData)
        .where(eq(formsTable.id, formId))
        .returning();

      if (!form) {
        throw new Error("failed to update form");
      }
      updatedForm = form;
    }

    // replace fields if provided
    let updatedFields;
    if (fields && fields.length > 0) {
      // delete existing fields
      await tx
        .delete(formFieldsTable)
        .where(eq(formFieldsTable.formId, formId));

      // insert new fields
      updatedFields = await tx
        .insert(formFieldsTable)
        .values(
          fields.map((field) => ({
            label: field.label,
            labelKey: field.labelKey,
            placeholder: field.placeholder,
            isRequired: field.isRequired,
            type: field.type,
            index: String(field.index),
            formId: formId,
          })),
        )
        .returning();

      if (!updatedFields || updatedFields.length === 0) {
        throw new Error("failed to update form fields");
      }
    } else {
      // return existing fields if no new fields provided
      updatedFields = await tx
        .select()
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, formId));
    }

    return { form: updatedForm, fields: updatedFields };
  });

  return result;
}

export async function deleteForm(payload: formModel.deleteFormInputType) {
  const { formId, userId } = await formModel.deleteFormInputModel.parseAsync(payload);

  await db.transaction(async (tx) => {
    const [form] = await tx
      .select({ id: formsTable.id, createdBy: formsTable.createdBy })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!form || form.createdBy !== userId) {
      throw new Error("form not found");
    }

    await tx.delete(formSubmissionsTable).where(eq(formSubmissionsTable.formId, formId));
    await tx.delete(formFieldsTable).where(eq(formFieldsTable.formId, formId));

    const deletedForms = await tx.delete(formsTable).where(eq(formsTable.id, formId)).returning({ id: formsTable.id });
    if (deletedForms.length === 0) {
      throw new Error("failed to delete form");
    }
  });

  return { formId };
}

export async function getUserFormsByUserId(payload: formModel.getUserFormsInputType) {
  const { userId } = await formModel.getUserFormsInputModel.parseAsync(payload);

  const userForms = await db
    .select()
    .from(formsTable)
    .where(eq(formsTable.createdBy, userId));

  // fetch fields for each form
  const formsWithFields = await Promise.all(
    userForms.map(async (form) => {
      const fields = await db
        .select()
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, form.id));

      return { form, fields };
    }),
  );

  return formsWithFields;
}

export async function submitForm(payload: formModel.submitFormInputType) {
  const { formId, submittedBy, answers } =
    await formModel.submitFormInputModel.parseAsync(payload);

  // verify form exists
  const [existingForm] = await db
    .select()
    .from(formsTable)
    .where(eq(formsTable.id, formId));

  if (!existingForm) {
    throw new Error("form not found");
  }

  // fetch form fields to map answers and check required fields
  const fields = await db
    .select()
    .from(formFieldsTable)
    .where(eq(formFieldsTable.formId, formId));

  for (const field of fields) {
    const val = answers[field.labelKey] ?? answers[field.id];
    if (field.isRequired && (!val || val.trim() === "")) {
      throw new Error(`field "${field.label}" is required`);
    }
  }

  const result = await db.transaction(async (tx) => {
    // 1. insert submission header
    const [submission] = await tx
      .insert(formSubmissionsTable)
      .values({
        formId,
        submittedBy,
        answers,
      })
      .returning();

    if (!submission) {
      throw new Error("failed to record form submission");
    }

    // 2. insert granular answers for each field
    const answerEntries = fields
      .map((field) => {
        const val = answers[field.labelKey] ?? answers[field.id];
        if (val === undefined) return null;
        return {
          submissionId: submission.id,
          fieldId: field.id,
          value: String(val),
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    let createdAnswers: typeof formAnswersTable.$inferSelect[] = [];
    if (answerEntries.length > 0) {
      createdAnswers = await tx
        .insert(formAnswersTable)
        .values(answerEntries)
        .returning();
    }

    return { submission, answers: createdAnswers };
  });

  return result;
}

export async function getFormSubmissionsByFormId(
  payload: formModel.getFormSubmissionsInputType,
) {
  const { formId } = await formModel.getFormSubmissionsInputModel.parseAsync(payload);

  const submissions = await db
    .select()
    .from(formSubmissionsTable)
    .where(eq(formSubmissionsTable.formId, formId));

  const submissionsWithAnswers = await Promise.all(
    submissions.map(async (submission) => {
      const answers = await db
        .select()
        .from(formAnswersTable)
        .where(eq(formAnswersTable.submissionId, submission.id));

      return { submission, answers };
    }),
  );

  return submissionsWithAnswers;
}

export async function getFormById(payload: formModel.getFormByIdInputType) {
  const { formId } = await formModel.getFormByIdInputModel.parseAsync(payload);

  const [form] = await db
    .select()
    .from(formsTable)
    .where(eq(formsTable.id, formId));

  if (!form) {
    throw new Error("form not found");
  }

  const fields = await db
    .select()
    .from(formFieldsTable)
    .where(eq(formFieldsTable.formId, formId));

  return { form, fields };
}

export async function getDashboardStats(payload: formModel.getDashboardStatsInputType) {
  const { days, userId } = await formModel.getDashboardStatsInputModel.parseAsync(payload);

  const summaryResult = await db.execute<{
    total_forms: number;
    total_submissions: number;
    submissions_this_month: number;
    average_submissions_per_form: string;
  }>(sql`
    SELECT
      (SELECT count(*)::int
       FROM forms
       WHERE created_by = ${userId}) AS total_forms,
      (SELECT count(*)::int
       FROM forms_submissions submissions
       INNER JOIN forms ON forms.id = submissions.form_id
       WHERE forms.created_by = ${userId}) AS total_submissions,
      (SELECT count(*)::int
       FROM forms_submissions submissions
       INNER JOIN forms ON forms.id = submissions.form_id
       WHERE forms.created_by = ${userId}
         AND submissions.created_at >= date_trunc('month', now())) AS submissions_this_month,
      (SELECT coalesce(avg(submission_counts.total), 0)::numeric(12, 2)
       FROM (
         SELECT forms.id, count(submissions.id)::int AS total
         FROM forms
         LEFT JOIN forms_submissions submissions ON submissions.form_id = forms.id
         WHERE forms.created_by = ${userId}
         GROUP BY forms.id
       ) submission_counts) AS average_submissions_per_form
  `);

  const trendRows = await db.execute<{ date: string; submissions: number }>(sql`
    WITH days AS (
      SELECT generate_series(
        current_date - (${days - 1})::int,
        current_date,
        interval '1 day'
      )::date AS date
    ), owned_submissions AS (
      SELECT submissions.created_at::date AS date
      FROM forms_submissions submissions
      INNER JOIN forms ON forms.id = submissions.form_id
      WHERE forms.created_by = ${userId}
        AND submissions.created_at >= current_date - (${days - 1})::int
    )
    SELECT
      to_char(days.date, 'YYYY-MM-DD') AS date,
      count(owned_submissions.date)::int AS submissions
    FROM days
    LEFT JOIN owned_submissions ON owned_submissions.date = days.date
    GROUP BY days.date
    ORDER BY days.date
  `);

  return {
    totalForms: Number(summaryResult.rows[0]?.total_forms ?? 0),
    totalSubmissions: Number(summaryResult.rows[0]?.total_submissions ?? 0),
    submissionsThisMonth: Number(summaryResult.rows[0]?.submissions_this_month ?? 0),
    averageSubmissionsPerForm: Number(summaryResult.rows[0]?.average_submissions_per_form ?? 0),
    submissionTrend: trendRows.rows.map((row) => ({
      date: row.date,
      submissions: Number(row.submissions),
    })),
  };
}
