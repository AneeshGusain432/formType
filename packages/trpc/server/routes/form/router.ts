import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFormInputTrpcModel,
  createFormOutputTrpcModel,
  updateFormInputTrpcModel,
  updateFormOutputTrpcModel,
  deleteFormInputTrpcModel,
  deleteFormOutputTrpcModel,
  getUserFormsInputTrpcModel,
  getUserFormsOutputTrpcModel,
  submitFormInputTrpcModel,
  submitFormOutputTrpcModel,
  getFormSubmissionsInputTrpcModel,
  getFormSubmissionsOutputTrpcModel,
  getFormByIdInputTrpcModel,
  getFormByIdOutputTrpcModel,
  getDashboardStatsInputTrpcModel,
  getDashboardStatsOutputTrpcModel,
} from "./model";
import * as formService from "@repo/services/form/form";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  getDashboardStats: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getDashboardStats"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getDashboardStatsInputTrpcModel)
    .output(getDashboardStatsOutputTrpcModel)
    .query(async ({ input, ctx }) => {
      return formService.getDashboardStats({
        days: Number(input.days) as 7 | 30 | 90,
        userId: ctx.user.id,
      });
    }),

  // Public procedure: Fetch a form and its fields by ID
  getFormById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormById"),
        tags: TAGS,
      },
    })
    .input(getFormByIdInputTrpcModel)
    .output(getFormByIdOutputTrpcModel)
    .query(async ({ input }) => {
      const { form, fields } = await formService.getFormById(input);

      return { form, fields };
    }),

  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInputTrpcModel)
    .output(createFormOutputTrpcModel)
    .mutation(async ({ input, ctx }) => {
      const { form, fields } = await formService.createForm({
        ...input,
        createdBy: ctx.user.id,
      });

      return { form, fields };
    }),

  updateForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/updateForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFormInputTrpcModel)
    .output(updateFormOutputTrpcModel)
    .mutation(async ({ input }) => {
      const { form, fields } = await formService.updateForm(input);

      return { form, fields };
    }),

  deleteForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/deleteForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFormInputTrpcModel)
    .output(deleteFormOutputTrpcModel)
    .mutation(async ({ input, ctx }) => {
      return formService.deleteForm({ ...input, userId: ctx.user.id });
    }),

  getUserForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getUserForms"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getUserFormsInputTrpcModel)
    .output(getUserFormsOutputTrpcModel)
    .query(async ({ ctx }) => {
      const forms = await formService.getUserFormsByUserId({
        userId: ctx.user.id,
      });

      return { forms };
    }),

  // Public procedure: Anyone can submit a form without authentication
  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submitForm"),
        tags: TAGS,
      },
    })
    .input(submitFormInputTrpcModel)
    .output(submitFormOutputTrpcModel)
    .mutation(async ({ input }) => {
      const { submission, answers } = await formService.submitForm(input);

      return { submission, answers };
    }),

  // Protected procedure: Only authenticated users can view form submissions
  getFormSubmissions: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormSubmissions"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFormSubmissionsInputTrpcModel)
    .output(getFormSubmissionsOutputTrpcModel)
    .query(async ({ input }) => {
      const submissions = await formService.getFormSubmissionsByFormId(input);

      return { submissions };
    }),
});
