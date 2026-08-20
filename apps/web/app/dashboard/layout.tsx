"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layers3 } from "lucide-react";

import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Spinner } from "~/components/ui/spinner";
import { useGetUserInfo } from "~/hooks/api/auth/auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isError } = useGetUserInfo();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace("/");
    }
  }, [isError, isLoading, router, user]);

  if (isLoading || isError || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="flex w-full max-w-xs flex-col items-center gap-5 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg shadow-black/20">
            <Layers3 className="size-6" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold tracking-tight">FormType</p>
            <p className="text-sm text-muted-foreground">Checking your workspace...</p>
          </div>
          <Spinner className="size-5 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
