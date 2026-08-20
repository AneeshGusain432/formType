"use client";

import { use } from "react";
import { IconClipboardText } from "@tabler/icons-react";

import { CreateForm } from "~/components/create-form";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import { useGetFormById } from "~/hooks/api/form/form";

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { form, fields, isLoading, isError, error } = useGetFormById(id);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:px-6 md:py-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-96 w-full max-w-6xl" />
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Empty className="max-w-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconClipboardText />
            </EmptyMedia>
            <EmptyTitle>Form Not Found</EmptyTitle>
            <EmptyDescription>{error?.message || "The form could not be loaded."}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div>
            <h1 className="text-2xl font-semibold">Edit Form</h1>
            <p className="text-sm text-muted-foreground">Update your form configuration.</p>
          </div>
          <CreateForm form={form} fields={fields} />
        </div>
      </div>
    </div>
  );
}
