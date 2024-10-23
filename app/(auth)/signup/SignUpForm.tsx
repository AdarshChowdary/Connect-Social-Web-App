"use client";

import { signUpSchema, SignUpValues } from "@/lib/validation";
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
import { Input } from "@/components/ui/input";
import { signUp } from "./actions";
import { PasswordInput } from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";

const SignUpForm = () => {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();
  // SignUpValues are the values that we expect from the user.
  const form = useForm<SignUpValues>({
    // The values entered by the user will be checked using the signUpSchema.
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await signUp(values);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="abc@xyz.com" type="email" {...field} />
              </FormControl>
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
          Create an account
        </LoadingButton>
      </form>
    </Form>
  );
};

export default SignUpForm;
