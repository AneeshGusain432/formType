import { z } from "zod";

export const fieldTypeEnumValues = [
  "TEXT",
  "NUMBER",
  "EMAIL",
  "YES_NO",
  "PASSWORD",
] as const;

export const createFormFieldInputModel = z.object({
  label: z.string().max(100).describe("display label of the field"),
  labelKey: z.string().max(100).describe("unique key for the field within the form"),
  placeholder: z.string().optional().describe("placeholder text for the field"),
  isRequired: z.boolean().default(false).describe("whether the field is required"),
  type: z.enum(fieldTypeEnumValues).describe("type of the form field"),
  index: z.number().describe("order of the field in the form"),
});

export const createFormInputModel = z.object({
  title: z.string().max(100).describe("title of the form"),
  description: z.string().max(400).optional().describe("description of the form"),
  fields: z.array(createFormFieldInputModel).min(1).describe("fields of the form"),
  createdBy: z.string().uuid().describe("id of the user creating the form"),
});

export const updateFormInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to update"),
  title: z.string().max(100).optional().describe("new title of the form"),
  description: z.string().max(400).optional().describe("new description of the form"),
  fields: z
    .array(createFormFieldInputModel)
    .min(1)
    .optional()
    .describe("replacement fields for the form"),
});

export const deleteFormInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to delete"),
  userId: z.string().uuid().describe("id of the user deleting the form"),
});

export const getUserFormsInputModel = z.object({
  userId: z.string().uuid().describe("id of the user whose forms to retrieve"),
});

export const submitFormInputModel = z.object({
  formId: z.string().uuid().describe("id of the form being submitted"),
  submittedBy: z
    .string()
    .uuid()
    .optional()
    .describe("id of the user submitting the form, if authenticated"),
  answers: z
    .record(z.string(), z.string())
    .describe("map of field labelKey/fieldId to submitted string response"),
});

export const getFormSubmissionsInputModel = z.object({
  formId: z.string().uuid().describe("id of the form whose submissions to retrieve"),
});

export const getFormByIdInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to retrieve"),
});

export const getDashboardStatsInputModel = z.object({
  days: z.union([z.literal(7), z.literal(30), z.literal(90)]).default(90),
  userId: z.string().uuid().describe("id of the form owner"),
});

export type createFormFieldInputType = z.infer<typeof createFormFieldInputModel>;
export type createFormInputType = z.infer<typeof createFormInputModel>;
export type updateFormInputType = z.infer<typeof updateFormInputModel>;
export type deleteFormInputType = z.infer<typeof deleteFormInputModel>;
export type getUserFormsInputType = z.infer<typeof getUserFormsInputModel>;
export type submitFormInputType = z.infer<typeof submitFormInputModel>;
export type getFormSubmissionsInputType = z.infer<typeof getFormSubmissionsInputModel>;
export type getFormByIdInputType = z.infer<typeof getFormByIdInputModel>;
export type getDashboardStatsInputType = z.infer<typeof getDashboardStatsInputModel>;
