import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.getUserForms.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useUpdateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFormAsync,
    mutate: updateForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.updateForm.useMutation({
    onSuccess: async (_, variables) => {
      await utils.form.getUserForms.invalidate();
      await utils.form.getFormById.invalidate({ formId: variables.formId });
    },
  });

  return {
    updateFormAsync,
    updateForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useDeleteForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFormAsync,
    mutate: deleteForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.deleteForm.useMutation({
    onSuccess: async () => {
      await utils.form.getUserForms.invalidate();
    },
  });

  return {
    deleteFormAsync,
    deleteForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useGetUserForms = () => {
  const { data, error, isError, isFetched, isFetching, isLoading } =
    trpc.form.getUserForms.useQuery();

  return {
    data,
    error,
    isError,
    isFetched,
    isFetching,
    isLoading,
  };
};

export const useGetDashboardStats = (days: 7 | 30 | 90 = 90) => {
  const { data, error, isError, isFetched, isFetching, isLoading } =
    trpc.form.getDashboardStats.useQuery({ days: String(days) as "7" | "30" | "90" });

  return {
    data,
    error,
    isError,
    isFetched,
    isFetching,
    isLoading,
  };
};

export const useSubmitForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: submitFormAsync,
    mutate: submitForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.submitForm.useMutation({
    onSuccess: async (_, variables) => {
      await utils.form.getFormSubmissions.invalidate({ formId: variables.formId });
    },
  });

  return {
    submitFormAsync,
    submitForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useGetFormSubmissions = (formId: string) => {
  const { data, error, isError, isFetched, isFetching, isLoading } =
    trpc.form.getFormSubmissions.useQuery({ formId }, { enabled: !!formId });

  return {
    data,
    error,
    isError,
    isFetched,
    isFetching,
    isLoading,
  };
};

export const useGetFormById = (formId: string) => {
  const { data, error, isError, isFetched, isFetching, isLoading } =
    trpc.form.getFormById.useQuery({ formId }, { enabled: !!formId });

  return {
    form: data?.form,
    fields: data?.fields,
    data,
    error,
    isError,
    isFetched,
    isFetching,
    isLoading,
  };
};

