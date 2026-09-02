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
  const [buttonWidth, setButtonWidth] = useState(MAX_BUTTON_WIDTH);

  // Prevent multiple Google initializations
  const initializedRef = useRef(false);

  // Prevent repeated renderButton calls
  const lastRenderedWidthRef = useRef<number | null>(null);

  // Keep latest callback without reinitializing Google
  const signinWithGoogleRef = useRef(signinWithGoogleAsync);

  useEffect(() => {
    signinWithGoogleRef.current = signinWithGoogleAsync;
  }, [signinWithGoogleAsync]);

  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    const clientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return;
    }

    if (!containerRef.current || !buttonRef.current) {
      return;
    }

    let resizeObserver: ResizeObserver | undefined;

    const getButtonWidth = () => {
      const width =
        containerRef.current?.clientWidth ?? MAX_BUTTON_WIDTH;

      return Math.max(
        MIN_BUTTON_WIDTH,
        Math.min(MAX_BUTTON_WIDTH, Math.round(width))
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

      // ⭐ VERY IMPORTANT
      // Don't render again if width hasn't actually changed.
      if (lastRenderedWidthRef.current === width) {
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
          logo_alignment: "center",
        }
      );

      setIsReady(true);
    };

    const initializeGoogle = () => {
      if (!window.google || !buttonRef.current) {
        return;
      }

      // ⭐ Initialize ONLY ONCE
      if (!initializedRef.current) {
        initializedRef.current = true;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            try {
              await signinWithGoogleRef.current({
                credential,
              });

              routerRef.current.replace("/dashboard");
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

    /*
     * Google script
     */
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (window.google) {
      initializeGoogle();
    } else if (existingScript) {
      existingScript.addEventListener(
        "load",
        initializeGoogle
      );
    } else {
      const script = document.createElement("script");

      script.src =
        "https://accounts.google.com/gsi/client";

      script.async = true;
      script.defer = true;

      script.onload = initializeGoogle;

      document.head.appendChild(script);
    }

    /*
     * Resize observer
     *
     * IMPORTANT:
     * We only update the width here.
     * We DO NOT call renderButton() directly
     * on every ResizeObserver callback.
     */
    resizeObserver = new ResizeObserver((entries) => {
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
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver?.disconnect();

      if (existingScript) {
        existingScript.removeEventListener(
          "load",
          initializeGoogle
        );
      }
    };
  }, []);

  /*
   * Render button when width actually changes.
   */
  useEffect(() => {
    if (
      !window.google ||
      !buttonRef.current ||
      !initializedRef.current
    ) {
      return;
    }

    if (lastRenderedWidthRef.current === buttonWidth) {
      return;
    }

    lastRenderedWidthRef.current = buttonWidth;

    buttonRef.current.replaceChildren();

    window.google.accounts.id.renderButton(
      buttonRef.current,
      {
        theme: "filled_white",
        size: "large",
        width: String(buttonWidth),
        text: "continue_with",
        logo_alignment: "center",
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
      <div
        className="relative min-h-10 w-full overflow-hidden rounded-md"
        style={{
          width: buttonWidth,
        }}
      >
        {!isReady && (
          <div
            className="absolute inset-0 flex items-center justify-center gap-2 bg-muted/50 animate-pulse"
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
          className="flex min-h-10 w-full justify-center [&>div]:!w-full [&_iframe]:!w-full"
          aria-label={label}
          style={{
            visibility: isReady ? "visible" : "hidden",
          }}
        />

        {isPending && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#191b1b]"
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