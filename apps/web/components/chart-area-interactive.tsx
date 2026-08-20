"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "~/hooks/use-mobile";
import { useGetDashboardStats } from "~/hooks/api/form/form";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const rangeLabels = {
  "90": "Last 3 months",
  "30": "Last 30 days",
  "7": "Last 7 days",
} as const;

type Range = keyof typeof rangeLabels;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [days, setDays] = React.useState<Range>("90");
  const { data, isLoading } = useGetDashboardStats(Number(days) as 7 | 30 | 90);

  React.useEffect(() => {
    if (isMobile) setDays("7");
  }, [isMobile]);

  const handleRangeChange = (value: string) => {
    if (value in rangeLabels) setDays(value as Range);
  };

  const formatDate = (value: string | number) =>
    new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Form Submissions</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Submission activity over time</span>
          <span className="@[540px]/card:hidden">Submission activity</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={days}
            onValueChange={handleRangeChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            {Object.entries(rangeLabels).map(([value, label]) => (
              <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select value={days} onValueChange={handleRangeChange}>
            <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm" aria-label="Select submission range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(rangeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={data?.submissionTrend ?? []}>
              <defs>
                <linearGradient id="fillSubmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-submissions)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-submissions)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDate}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatDate(String(value))}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="submissions"
                type="natural"
                fill="url(#fillSubmissions)"
                stroke="var(--color-submissions)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
