import { trpc } from "~/trpc/client";

export const useSignup = () => {
  const {
    mutateAsync: signupUserWithEmailAndPasswordAsync,
    mutate: signupUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.auth.signupUserWithEmailAndPassword.useMutation({ onSuccess: async () => {
    
  }});

  return {
    signupUserWithEmailAndPasswordAsync,
    signupUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useSignin = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: signinUserWithEmailAndPasswordAsync,
    mutate: signinUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.auth.signinUserWithEmailAndPassword.useMutation({
    onSuccess: (data) => {
      utils.auth.getLoggedInUserInfo.setData(undefined, { user: data.user });
    },
  });

  return {
    signinUserWithEmailAndPasswordAsync,
    signinUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useGoogleSignin = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.auth.signinWithGoogle.useMutation({
    onSuccess: (data) => {
      utils.auth.getLoggedInUserInfo.setData(undefined, { user: data.user });
    },
  });

  return {
    signinWithGoogleAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export const useGetUserInfo = () => {
  const { data, error, isError, isFetched, isFetching, isLoading } =
    trpc.auth.getLoggedInUserInfo.useQuery(undefined, {
      retry: false,
    });

  return {
    user: data?.user,
    error,
    isError,
    isFetched,
    isFetching,
    isLoading,
  };
};

export const useLogout = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: logoutAsync,
    mutate: logout,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.reset();
    },
  });

  return {
    logoutAsync,
    logout,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};
