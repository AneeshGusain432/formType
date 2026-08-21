"use client";

import { use, useState } from "react";
import { IconCheck, IconAlertCircle, IconClipboardText } from "@tabler/icons-react";
import { Layers3 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { useGetFormById, useSubmitForm } from "~/hooks/api/form/form";

export default function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);
  const { form, fields, isLoading, isError, error: fetchError } = useGetFormById(formId);
  const { submitFormAsync, isPending } = useSubmitForm();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      await submitFormAsync({
        formId,
        answers,
      });
      setSubmittedSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit form. Please check required fields.";
      setSubmitError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-xl border-border bg-card">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Empty className="max-w-md border-border bg-card text-foreground">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconClipboardText />
            </EmptyMedia>
            <EmptyTitle>Form Not Found</EmptyTitle>
            <EmptyDescription>
              {fetchError?.message || "The requested form does not exist or has been removed."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  if (submittedSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-2xl shadow-black/30">
          <CardContent className="flex flex-col items-center text-center pt-8 pb-8 space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#34483d] text-[#b6d5bd]">
              <IconCheck className="size-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Response Submitted!</CardTitle>
            <CardDescription>
              Thank you for filling out &quot;{form.title}&quot;. Your response has been recorded.
            </CardDescription>
            <Button
              variant="outline"
              className="mt-4 border-[#454640] bg-transparent text-[#f4f1ea] hover:bg-[#30322f] hover:text-white"
              onClick={() => {
                setAnswers({});
                setSubmittedSuccess(false);
              }}
            >
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedFields = [...(fields || [])].sort(
    (a, b) => parseFloat(a.index) - parseFloat(b.index),
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 md:p-8">
      <Card className="w-full max-w-xl border-border bg-card text-card-foreground shadow-2xl shadow-black/30">
        <CardHeader className="border-b border-border bg-card">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-tight text-[#f4f1ea]">
            <span className="flex size-7 items-center justify-center rounded-md bg-[#f4f1ea] text-[#101112]">
              <Layers3 className="size-3.5" />
            </span>
            FormType
          </div>
          <CardTitle className="text-2xl">{form.title}</CardTitle>
          {form.description && (
            <CardDescription className="text-base">{form.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <IconAlertCircle className="size-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <FieldGroup>
              {sortedFields.map((field) => {
                const value = answers[field.labelKey] ?? answers[field.id] ?? "";

                return (
                  <Field key={field.id}>
                    <FieldLabel htmlFor={`input-${field.id}`}>
                      {field.label}
                      {field.isRequired && <span className="ml-1 text-destructive">*</span>}
                    </FieldLabel>

                    {field.type === "YES_NO" ? (
                      <Select
                        value={value}
                        onValueChange={(val) => handleInputChange(field.labelKey, val)}
                      >
                        <SelectTrigger
                          id={`input-${field.id}`}
                          className="w-full border-input bg-background text-foreground data-placeholder:text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          <SelectValue placeholder={field.placeholder || "Select Yes or No"} />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-popover text-popover-foreground">
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={`input-${field.id}`}
                        type={
                          field.type === "EMAIL"
                            ? "email"
                            : field.type === "PASSWORD"
                              ? "password"
                              : field.type === "NUMBER"
                                ? "number"
                                : "text"
                        }
                        placeholder={field.placeholder ?? undefined}
                        className="border-input bg-background text-foreground placeholder:text-muted-foreground"
                        value={value}
                        required={field.isRequired}
                        onChange={(e) => handleInputChange(field.labelKey, e.target.value)}
                      />
                    )}
                  </Field>
                );
              })}
            </FieldGroup>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#e8914a] text-[#101112] hover:bg-[#f0a566]"
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
