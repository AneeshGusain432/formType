"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PlusIcon, Trash2Icon, GripVerticalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useCreateForm, useUpdateForm } from "~/hooks/api/form/form";

const FIELD_TYPES = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"] as const;

type FieldType = (typeof FIELD_TYPES)[number];

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: "Text",
  NUMBER: "Number",
  EMAIL: "Email",
  YES_NO: "Yes / No",
  PASSWORD: "Password",
};

type FormFieldValues = {
  label: string;
  labelKey: string;
  placeholder: string;
  isRequired: boolean;
  type: FieldType;
};

type CreateFormValues = {
  title: string;
  description: string;
  fields: FormFieldValues[];
};

type ExistingForm = {
  id: string;
  title: string;
  description: string | null;
};

type ExistingField = {
  label: string;
  labelKey: string;
  placeholder: string | null;
  isRequired: boolean;
  type: FieldType;
  index: string;
};

type CreateFormProps = {
  form?: ExistingForm;
  fields?: ExistingField[];
};

const emptyField: FormFieldValues = {
  label: "",
  labelKey: "",
  placeholder: "",
  isRequired: false,
  type: "TEXT",
};

export function CreateForm({ form, fields: existingFields }: CreateFormProps) {
  const router = useRouter();
  const isEditing = Boolean(form);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateFormValues>({
    defaultValues: { title: "", description: "", fields: [emptyField] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const { createFormAsync, isPending: isCreating } = useCreateForm();
  const { updateFormAsync, isPending: isUpdating } = useUpdateForm();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!form) return;

    reset({
      title: form.title,
      description: form.description ?? "",
      fields: [...(existingFields ?? [])]
        .sort((a, b) => Number(a.index) - Number(b.index))
        .map(({ label, labelKey, placeholder, isRequired, type }) => ({
          label,
          labelKey,
          placeholder: placeholder ?? "",
          isRequired,
          type,
        })),
    });
  }, [existingFields, form, reset]);

  const onSubmit = async (values: CreateFormValues) => {
    const fields = values.fields.map((field, index) => ({
      label: field.label,
      labelKey: field.labelKey,
      placeholder: field.placeholder || undefined,
      isRequired: field.isRequired,
      type: field.type,
      index,
    }));

    if (form) {
      await updateFormAsync({
        formId: form.id,
        title: values.title,
        description: values.description,
        fields,
      });
      router.push("/dashboard");
      return;
    }

    await createFormAsync({
      title: values.title,
      description: values.description || undefined,
      fields,
    });
  };

  const handleAddField = () => {
    append(emptyField);
  };

  // auto-generate labelKey from label
  const handleLabelChange = (index: number, value: string) => {
    const key = value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+$/, "");
    setValue(`fields.${index}.labelKey`, key);
  };

  return (
    <Card className="max-w-6xl">
      <CardHeader>
        <CardTitle className="text-xl">{isEditing ? "Edit Form" : "Create New Form"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update your form details and fields. Existing responses will remain available."
            : "Design your form by adding a title, description, and configuring the fields you need."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Form Title */}
            <Field>
              <FieldLabel htmlFor="form-title">Form Title</FieldLabel>
              <Input
                id="form-title"
                placeholder="e.g. Contact Form, Survey, Registration"
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 100,
                    message: "Title must be 100 characters or less",
                  },
                })}
              />
              {errors.title ? (
                <FieldDescription className="text-destructive">
                  {errors.title.message}
                </FieldDescription>
              ) : (
                <FieldDescription>Give your form a clear, descriptive title.</FieldDescription>
              )}
            </Field>

            {/* Form Description */}
            <Field>
              <FieldLabel htmlFor="form-description">
                Description
                <Badge variant="secondary" className="ml-2 text-[10px]">
                  Optional
                </Badge>
              </FieldLabel>
              <Textarea
                id="form-description"
                placeholder="Describe the purpose of this form..."
                rows={3}
                {...register("description", {
                  maxLength: {
                    value: 400,
                    message: "Description must be 400 characters or less",
                  },
                })}
              />
              {errors.description && (
                <FieldDescription className="text-destructive">
                  {errors.description.message}
                </FieldDescription>
              )}
            </Field>

            <Separator />

            {/* Fields Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Form Fields</h3>
                  <p className="text-muted-foreground text-sm">
                    Add and configure fields for your form. At least one field is required.
                  </p>
                </div>
                <Badge variant="outline">
                  {fields.length} field{fields.length !== 1 && "s"}
                </Badge>
              </div>

              {errors.fields?.root && (
                <FieldDescription className="text-destructive mb-3">
                  {errors.fields.root.message}
                </FieldDescription>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="relative border-dashed transition-shadow hover:shadow-md"
                  >
                    <CardContent className="pt-6">
                      {/* Field Header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVerticalIcon className="text-muted-foreground size-4" />
                          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                            Field {index + 1}
                          </span>
                        </div>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                            onClick={() => remove(index)}
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        )}
                      </div>

                      <FieldGroup>
                        {/* Label + Label Key Row */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field>
                            <FieldLabel htmlFor={`field-label-${index}`}>Label</FieldLabel>
                            <Input
                              id={`field-label-${index}`}
                              placeholder="e.g. Full Name"
                              {...register(`fields.${index}.label`, {
                                required: "Label is required",
                                maxLength: { value: 100, message: "Max 100 characters" },
                                onChange: (e) => handleLabelChange(index, e.target.value),
                              })}
                            />
                            {errors.fields?.[index]?.label && (
                              <FieldDescription className="text-destructive">
                                {errors.fields[index].label.message}
                              </FieldDescription>
                            )}
                          </Field>

                          <Field>
                            <FieldLabel htmlFor={`field-key-${index}`}>Key</FieldLabel>
                            <Input
                              id={`field-key-${index}`}
                              placeholder="e.g. full_name"
                              className="font-mono text-sm"
                              {...register(`fields.${index}.labelKey`, {
                                required: "Key is required",
                                maxLength: { value: 100, message: "Max 100 characters" },
                              })}
                            />
                            {errors.fields?.[index]?.labelKey && (
                              <FieldDescription className="text-destructive">
                                {errors.fields[index].labelKey.message}
                              </FieldDescription>
                            )}
                          </Field>
                        </div>

                        {/* Type + Placeholder Row */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field>
                            <FieldLabel htmlFor={`field-type-${index}`}>Field Type</FieldLabel>
                            <Select
                              value={watch(`fields.${index}.type`)}
                              onValueChange={(value: FieldType) =>
                                setValue(`fields.${index}.type`, value)
                              }
                            >
                              <SelectTrigger id={`field-type-${index}`} className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {FIELD_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {FIELD_TYPE_LABELS[type]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>

                          <Field>
                            <FieldLabel htmlFor={`field-placeholder-${index}`}>
                              Placeholder
                              <Badge variant="secondary" className="ml-2 text-[10px]">
                                Optional
                              </Badge>
                            </FieldLabel>
                            <Input
                              id={`field-placeholder-${index}`}
                              placeholder="e.g. Enter your name"
                              {...register(`fields.${index}.placeholder`)}
                            />
                          </Field>
                        </div>

                        {/* Required Toggle */}
                        <Field orientation="horizontal">
                          <FieldLabel
                            htmlFor={`field-required-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            Required Field
                          </FieldLabel>
                          <Switch
                            id={`field-required-${index}`}
                            checked={watch(`fields.${index}.isRequired`)}
                            onCheckedChange={(checked) =>
                              setValue(`fields.${index}.isRequired`, checked)
                            }
                          />
                        </Field>
                      </FieldGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add Field Button */}
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full border-dashed"
                onClick={handleAddField}
              >
                <PlusIcon className="mr-2 size-4" />
                Add Field
              </Button>
            </div>

            <Separator />

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/forms")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditing
                    ? "Saving..."
                    : "Creating..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Form"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
