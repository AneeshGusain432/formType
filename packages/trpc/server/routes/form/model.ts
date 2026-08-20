import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

const formFieldOutputModel = z.object({
  id: z.string(),
  label: z.string(),
  labelKey: z.string(),
  placeholder: z.string().nullable(),
  isRequired: z.boolean(),
  type: fieldTypeEnum,
  index: z.string(),
  formId: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

const formOutputModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  createdBy: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const createFormInputTrpcModel = z.object({
  title: z.string().max(100).describe("title of the form"),
  description: z.string().max(400).optional().describe("description of the form"),
  fields: z
    .array(
      z.object({
        label: z.string().max(100).describe("display label of the field"),
        labelKey: z.string().max(100).describe("unique key for the field within the form"),
        placeholder: z.string().optional().describe("placeholder text for the field"),
        isRequired: z.boolean().default(false).describe("whether the field is required"),
        type: fieldTypeEnum.describe("type of the form field"),
        index: z.number().describe("order of the field in the form"),
      }),
    )
    .min(1)
    .describe("fields of the form"),
});

export const createFormOutputTrpcModel = z.object({
  form: formOutputModel,
  fields: z.array(formFieldOutputModel),
});

export const updateFormInputTrpcModel = z.object({
  formId: z.string().uuid().describe("id of the form to update"),
  title: z.string().max(100).optional().describe("new title of the form"),
  description: z.string().max(400).optional().describe("new description of the form"),
  fields: z
    .array(
      z.object({
        label: z.string().max(100).describe("display label of the field"),
        labelKey: z.string().max(100).describe("unique key for the field within the form"),
        placeholder: z.string().optional().describe("placeholder text for the field"),
        isRequired: z.boolean().default(false).describe("whether the field is required"),
        type: fieldTypeEnum.describe("type of the form field"),
        index: z.number().describe("order of the field in the form"),
      }),
    )
    .min(1)
    .optional()
    .describe("replacement fields for the form"),
});

export const updateFormOutputTrpcModel = z.object({
  form: formOutputModel,
  fields: z.array(formFieldOutputModel),
});

export const deleteFormInputTrpcModel = z.object({
  formId: z.string().uuid().describe("id of the form to delete"),
});

export const deleteFormOutputTrpcModel = z.object({
  formId: z.string().uuid(),
});

export const getUserFormsInputTrpcModel = z.undefined();

export const getUserFormsOutputTrpcModel = z.object({
  forms: z.array(
    z.object({
      form: formOutputModel,
      fields: z.array(formFieldOutputModel),
    }),
  ),
});

export const submitFormInputTrpcModel = z.object({
  formId: z.string().uuid().describe("id of the form being submitted"),
  answers: z
    .record(z.string(), z.string())
    .describe("map of field labelKey/fieldId to response value"),
});

const formSubmissionOutputModel = z.object({
  id: z.string(),
  formId: z.string(),
  submittedBy: z.string().nullable(),
  answers: z.record(z.string(), z.any()),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

const formAnswerOutputModel = z.object({
  id: z.string(),
  submissionId: z.string(),
  fieldId: z.string(),
  value: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const submitFormOutputTrpcModel = z.object({
  submission: formSubmissionOutputModel,
  answers: z.array(formAnswerOutputModel),
});

export const getFormSubmissionsInputTrpcModel = z.object({
  formId: z.string().uuid().describe("id of the form to retrieve submissions for"),
});

export const getFormSubmissionsOutputTrpcModel = z.object({
  submissions: z.array(
    z.object({
      submission: formSubmissionOutputModel,
      answers: z.array(formAnswerOutputModel),
    }),
  ),
});

export const getFormByIdInputTrpcModel = z.object({
  formId: z.string().uuid().describe("id of the form to retrieve"),
});

export const getFormByIdOutputTrpcModel = z.object({
  form: formOutputModel,
  fields: z.array(formFieldOutputModel),
});

export const getDashboardStatsInputTrpcModel = z.object({
  days: z.enum(["7", "30", "90"]).default("90"),
});

export const getDashboardStatsOutputTrpcModel = z.object({
  totalForms: z.number(),
  totalSubmissions: z.number(),
  submissionsThisMonth: z.number(),
  averageSubmissionsPerForm: z.number(),
  submissionTrend: z.array(
    z.object({
      date: z.string(),
      submissions: z.number(),
    }),
  ),
});
