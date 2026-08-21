"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
          renderButton: (element: HTMLElement, options: Record<string, string>) => void;
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

export function GoogleSigninButton({ label = "Continue with Google" }: GoogleSigninButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signinWithGoogleAsync, isPending, error } = useGoogleSignin();
  const [isReady, setIsReady] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(MAX_BUTTON_WIDTH);

  const renderGoogleButton = useCallback(
    (width: number) => {
      const clientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId || !window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          await signinWithGoogleAsync({ credential });
          router.replace("/dashboard");
        },
      });
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "filled_white",
        size: "large",
        width: String(Math.max(MIN_BUTTON_WIDTH, Math.min(MAX_BUTTON_WIDTH, width))),
        text: "continue_with",
        logo_alignment: "center",
      });
      setIsReady(true);
    },
    [router, signinWithGoogleAsync],
  );

  useEffect(() => {
    const clientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !containerRef.current) return;

    const getWidth = () => containerRef.current?.clientWidth ?? MAX_BUTTON_WIDTH;

    const init = () => renderGoogleButton(getWidth());

    if (window.google) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.head.appendChild(script);
    }

    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width ?? getWidth());
      setButtonWidth(width);
      if (window.google) renderGoogleButton(width);
    });
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [renderGoogleButton]);

  if (!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return <p className="text-center text-xs text-muted-foreground">{label} is not configured.</p>;
  }

  return (
    <div ref={containerRef} className="w-full max-w-[360px] mx-auto space-y-2 overflow-hidden">
      <div
        className="relative min-h-10 w-full overflow-hidden rounded-md"
        style={{ width: buttonWidth }}
      >
        {/* Skeleton shown until the GSI script has rendered the real button */}
        {!isReady && (
          <div
            className="absolute inset-0 flex items-center justify-center gap-2 bg-muted/50 animate-pulse"
            aria-hidden="true"
          >
            <Spinner className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading Google sign-in…</span>
          </div>
        )}

        <div
          ref={buttonRef}
          className="flex min-h-10 w-full justify-center [&>div]:!w-full [&_iframe]:!w-full"
          aria-label={label}
          style={{ visibility: isReady ? "visible" : "hidden" }}
        />

        {/* Overlay + spinner while a sign-in request is in flight */}
        {isPending && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#191b1b]"
            aria-hidden="true"
          >
            <Spinner className="size-5 text-primary" />
          </div>
        )}
      </div>

      {isReady && error && <p className="text-center text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
