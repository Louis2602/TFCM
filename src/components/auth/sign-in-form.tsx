"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations/auth";
import { Icons } from "@/components/global/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "@/app/(auth)/auth.action";
import { toast } from "sonner";

type FormData = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);

    const res = await signIn(values);
    if (res.success) {
      toast.success("Login successful");
      router.push("/dashboard");
      setIsLoading(false);
    } else {
      toast.error(res.error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="my-8 w-full">
        <h1 className="text-lg font-semibold">Hi, Welcome back!</h1>
        <p className="text-sm text-muted-foreground">
          Fill in your email and password to sign in
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="hello@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="***********" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="mt-4">
            {isLoading && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Sign in
          </Button>
        </form>
      </Form>
    </>
  );
};
