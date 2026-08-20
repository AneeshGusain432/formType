"use client";

import * as React from "react";
import {
  IconDashboard,
  IconClipboardText ,
} from "@tabler/icons-react";

import { NavMain } from "~/components/nav-main";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
import { useGetUserInfo } from "~/hooks/api/auth/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Forms",
      url: "/dashboard/forms",
      icon: IconClipboardText,
    },
  ],
  navSecondary: [
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useGetUserInfo();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <div>
                <IconClipboardText className="size-5!" />
                <span className="text-base font-semibold">FormType</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.fullName ?? "User",
            email: user?.email ?? "",
            avatar: user?.profileImageUrl ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
