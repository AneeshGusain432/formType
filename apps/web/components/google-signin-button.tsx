"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleSignin } from "~/hooks/api/auth/auth";
import { env } from "~/env";
import { Spinner } from "~/components/ui/spinner";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;

          renderButton: (
            element: HTMLElement,
            options: Record<string, string>
          ) => void;
        };
      };
    };
  }
}

type GoogleSigninButtonProps = {
  label?: string;
};

const MAX_BUTTON_WIDTH = 360;
const MIN_BUTTON_WIDTH = 200;

export function GoogleSigninButton({
  label = "Continue with Google",
}: GoogleSigninButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { signinWithGoogleAsync, isPending, error } =
    useGoogleSignin();

  const [isReady, setIsReady] = useState(false);
  const [buttonWidth, setButtonWidth] =
    useState(MAX_BUTTON_WIDTH);


  const initializedRef = useRef(false);


  const lastRenderedWidthRef =
    useRef<number | null>(null);


  const signinWithGoogleRef =
    useRef(signinWithGoogleAsync);

  useEffect(() => {
    signinWithGoogleRef.current = signinWithGoogleAsync;
  }, [signinWithGoogleAsync]);


  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    const clientId =
      env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return;
    }

    if (
      !containerRef.current ||
      !buttonRef.current
    ) {
      return;
    }

    let resizeObserver: ResizeObserver | null = null;
    let createdScript: HTMLScriptElement | null = null;
    let existingScript: HTMLScriptElement | null =
      null;

    const getButtonWidth = () => {
      const containerWidth =
        containerRef.current?.clientWidth ??
        MAX_BUTTON_WIDTH;

      return Math.max(
        MIN_BUTTON_WIDTH,
        Math.min(
          MAX_BUTTON_WIDTH,
          Math.round(containerWidth)
        )
      );
    };


    const renderGoogleButton = (width: number) => {
      if (
        !window.google ||
        !buttonRef.current ||
        !initializedRef.current
      ) {
        return;
      }

      if (
        lastRenderedWidthRef.current === width
      ) {
        return;
      }

      lastRenderedWidthRef.current = width;


      buttonRef.current.replaceChildren();

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: "filled_white",
          size: "large",
          width: String(width),
          text: "continue_with",


          logo_alignment: "left",
        }
      );

      setIsReady(true);
    };

    const initializeGoogle = () => {
      if (
        !window.google ||
        !buttonRef.current
      ) {
        return;
      }

      if (!initializedRef.current) {
        initializedRef.current = true;

        window.google.accounts.id.initialize({
          client_id: clientId,

          callback: async ({ credential }) => {
            try {
              await signinWithGoogleRef.current({
                credential,
              });

              routerRef.current.replace(
                "/dashboard"
              );
            } catch (error) {
              console.error(
                "Google sign-in failed:",
                error
              );
            }
          },
        });
      }

      const width = getButtonWidth();

      setButtonWidth(width);

      renderGoogleButton(width);
    };

    existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (window.google) {
      initializeGoogle();
    }

    else if (existingScript) {
      existingScript.addEventListener(
        "load",
        initializeGoogle
      );
    }

    else {
      createdScript =
        document.createElement("script");

      createdScript.src =
        "https://accounts.google.com/gsi/client";

      createdScript.async = true;
      createdScript.defer = true;
      createdScript.onload = initializeGoogle;

      document.head.appendChild(createdScript);
    }


    resizeObserver = new ResizeObserver(
      (entries) => {
        const width = Math.max(
          MIN_BUTTON_WIDTH,
          Math.min(
            MAX_BUTTON_WIDTH,
            Math.round(
              entries[0]?.contentRect?.width ??
                MAX_BUTTON_WIDTH
            )
          )
        );

        setButtonWidth((previousWidth) => {
          if (previousWidth === width) {
            return previousWidth;
          }

          return width;
        });
      }
    );

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver?.disconnect();

      if (existingScript) {
        existingScript.removeEventListener(
          "load",
          initializeGoogle
        );
      }

      if (createdScript) {
        createdScript.onload = null;
      }
    };
  }, []);


  useEffect(() => {
    if (
      !window.google ||
      !buttonRef.current ||
      !initializedRef.current
    ) {
      return;
    }

    if (
      lastRenderedWidthRef.current ===
      buttonWidth
    ) {
      return;
    }

    lastRenderedWidthRef.current =
      buttonWidth;

    buttonRef.current.replaceChildren();

    window.google.accounts.id.renderButton(
      buttonRef.current,
      {
        theme: "filled_white",
        size: "large",
        width: String(buttonWidth),
        text: "continue_with",

        logo_alignment: "left",
      }
    );

    setIsReady(true);
  }, [buttonWidth]);


  if (!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        {label} is not configured.
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[360px] space-y-2 overflow-hidden"
    >
      <div className="relative min-h-10 w-full overflow-hidden rounded-md">
        {/* Loading skeleton */}
        {!isReady && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-muted/50 animate-pulse"
            aria-hidden="true"
          >
            <Spinner className="size-4 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Loading Google sign-in…
            </span>
          </div>
        )}

      
        <div
          ref={buttonRef}
          className="min-h-10 w-full"
          aria-label={label}
          style={{
            visibility: isReady
              ? "visible"
              : "hidden",
          }}
        />

        {isPending && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#191b1b]"
            aria-hidden="true"
          >
            <Spinner className="size-5 text-primary" />
          </div>
        )}
      </div>

      {isReady && error && (
        <p className="text-center text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}