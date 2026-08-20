"use client";

import { CreateForm } from "~/components/create-form";

export default function DashboardFormsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div>
            <h1 className="text-2xl font-semibold">Forms</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage your dynamic forms.
            </p>
          </div>
          <CreateForm />
        </div>
      </div>
    </div>
  );
}
