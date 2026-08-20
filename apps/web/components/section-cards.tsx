"use client";

import { IconCalendarMonth, IconChartBar, IconClipboardText, IconInbox } from "@tabler/icons-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useGetDashboardStats } from "~/hooks/api/form/form";

export function SectionCards() {
  const { data, isLoading } = useGetDashboardStats();
  const cards = [
    {
      label: "Total Forms",
      value: data?.totalForms,
      description: "Forms currently owned by you",
      icon: IconClipboardText,
    },
    {
      label: "Total Submissions",
      value: data?.totalSubmissions,
      description: "Responses across all forms",
      icon: IconInbox,
    },
    {
      label: "This Month",
      value: data?.submissionsThisMonth,
      description: "Submissions received this month",
      icon: IconCalendarMonth,
    },
    {
      label: "Average per Form",
      value: data?.averageSubmissionsPerForm.toFixed(2),
      description: "Average responses for each form",
      icon: IconChartBar,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map(({ label, value, description, icon: Icon }) => (
        <Card key={label} className="@container/card">
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {isLoading ? <Skeleton className="h-9 w-20" /> : (value ?? 0)}
            </CardTitle>
            <Badge variant="outline" className="w-fit gap-1">
              <Icon className="size-3.5" />
              Live
            </Badge>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {description}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
