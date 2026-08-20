"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useSignup } from "~/hooks/api/auth/auth";
import { Layers3 } from "lucide-react";
import { Spinner } from "~/components/ui/spinner";
import { GoogleSigninButton } from "~/components/google-signin-button";

type SignupFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const { signupUserWithEmailAndPasswordAsync, isPending, error } = useSignup();

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signupUserWithEmailAndPasswordAsync({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      router.replace("/login");
    } catch {
      // error is already captured by the mutation's `error` state and rendered below;
      // swallow here so this doesn't surface as an unhandled rejection.
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-xl font-semibold tracking-tight text-[#f4f1ea]">
        <span className="flex size-8 items-center justify-center rounded-md bg-[#f4f1ea] text-[#101112]"><Layers3 className="size-4" /></span>
        FormType
      </div>
      <Card {...props} className="border-[#383a36] bg-[#191b1b] text-[#f4f1ea] shadow-2xl shadow-black/30">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="border-[#454640] bg-[#202220] text-[#f4f1ea] placeholder:text-[#817f76]"
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && (
                <FieldDescription className="text-destructive">
                  {errors.fullName.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="border-[#454640] bg-[#202220] text-[#f4f1ea] placeholder:text-[#817f76]"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email ? (
                <FieldDescription className="text-destructive">
                  {errors.email.message}
                </FieldDescription>
              ) : (
                <FieldDescription className="text-[#aaa59b]">
                  We&apos;ll use this to contact you. We will not share your email with anyone else.
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                className="border-[#454640] bg-[#202220] text-[#f4f1ea] placeholder:text-[#817f76]"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters long",
                  },
                })}
              />
              {errors.password ? (
                <FieldDescription className="text-destructive">
                  {errors.password.message}
                </FieldDescription>
              ) : (
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                className="border-[#454640] bg-[#202220] text-[#f4f1ea] placeholder:text-[#817f76]"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <FieldDescription className="text-destructive">
                  {errors.confirmPassword.message}
                </FieldDescription>
              )}
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isPending} className="bg-[#e8914a] text-[#101112] hover:bg-[#f0a566]">
                  {isPending && <Spinner />}
                  {isPending ? "Creating account..." : "Create Account"}
                </Button>
                {error && (
                  <FieldDescription className="text-center text-destructive">
                    {error.message}
                  </FieldDescription>
                )}
                <GoogleSigninButton label="Sign up with Google" />
                <FieldDescription className="px-6 text-center text-[#aaa59b]">
                  Already have an account? <Link className="text-[#e8914a] hover:underline" href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
      </Card>
    </div>
  );
}