"use client";

import { logInSchema, LogInValues } from "@/lib/validation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";

import { PasswordInput } from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { logIn } from "./actions";

const LogInForm = () => {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();
  const form = useForm<LogInValues>({
    // The values entered by the user will be checked using the signUpSchema.
    resolver: zodResolver(logInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LogInValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await logIn(values);
      if (error) setError(error);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Username</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <LoadingButton loading={isPending} type="submit" className="w-full">
          Log in
        </LoadingButton>
      </form>
    </Form>
  );
};

export default LogInForm;
