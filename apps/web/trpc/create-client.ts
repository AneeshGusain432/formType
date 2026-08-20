import {
  createTRPCProxyClient,
  httpLink,
  httpBatchStreamLink,
  observable,
  TRPCClientError,
  type TRPCLink,
} from "@repo/trpc/client";
import type { ServerRouter } from "@repo/trpc/client";
interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  const link = c({
    url: "/trpc",
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });

  const refreshClient = createTRPCProxyClient<ServerRouter>({
    links: [
      httpLink({
        url: "/trpc",
        fetch(url, options) {
          return fetch(url, { ...options, credentials: "include" });
        },
      }),
    ],
  });

  let refreshPromise: Promise<unknown> | null = null;

  const refreshAccessToken = () => {
    if (!refreshPromise) {
      refreshPromise = refreshClient.auth.generateNewAccessToken
        .mutate({})
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  };

  const refreshLink: TRPCLink<ServerRouter> = (runtime) => {
    const nextLink = link(runtime);

    return ({ op, next }) =>
      observable((observer) => {
        const hasRetried = op.context.__refreshRetried === true;
        let subscription = nextLink({ op, next }).subscribe({
          next: observer.next,
          complete: observer.complete,
          error: (error) => {
            const isAuthError =
              error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED";

            if (!isAuthError || hasRetried || op.path === "auth.generateNewAccessToken") {
              observer.error(error);
              return;
            }

            refreshAccessToken()
              .then(() => {
                const retryOperation = {
                  ...op,
                  context: { ...op.context, __refreshRetried: true },
                };
                subscription = nextLink({ op: retryOperation, next }).subscribe(observer);
              })
              .catch(() => observer.error(error));
          },
        });

        return () => subscription.unsubscribe();
      });
  };

  return refreshLink;
};
