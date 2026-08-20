"use client"

import { useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useSignin } from "~/hooks/api/auth/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers3 } from "lucide-react";
import { Spinner } from "~/components/ui/spinner";
import { GoogleSigninButton } from "~/components/google-signin-button";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const { signinUserWithEmailAndPasswordAsync, isPending, error } = useSignin();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await signinUserWithEmailAndPasswordAsync({
        email: values.email,
        password: values.password,
      });

      router.replace("/dashboard")
    } catch {
      // error is already captured by the mutation's `error` state and rendered below
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex items-center justify-center gap-2 text-xl font-semibold tracking-tight text-[#f4f1ea]">
        <span className="flex size-8 items-center justify-center rounded-md bg-[#f4f1ea] text-[#101112]"><Layers3 className="size-4" /></span>
        FormType
      </div>
      <Card className="border-[#383a36] bg-[#191b1b] text-[#f4f1ea] shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm text-[#aaa59b] underline-offset-4 hover:text-[#e8914a] hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  placeholder="********"
                  id="password"
                  type="password"
                  className="border-[#454640] bg-[#202220] text-[#f4f1ea] placeholder:text-[#817f76]"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isPending} className="bg-[#e8914a] text-[#101112] hover:bg-[#f0a566]">
                  {isPending && <Spinner />}
                  {isPending ? "Signing in..." : "Login"}
                </Button>
                {error && (
                  <FieldDescription className="text-center text-destructive">
                    {error.message}
                  </FieldDescription>
                )}
                <GoogleSigninButton label="Sign in with Google" />
                <FieldDescription className="text-center text-[#aaa59b]">
                  Don&apos;t have an account? <Link className="text-[#e8914a] hover:underline" href="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}