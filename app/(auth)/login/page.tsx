import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import logInImage from "@/assets/login-image.jpg";
import LogInForm from "./LogInForm";
import GoogleSignInButton from "./GoogleSignInButton";

export const metadata: Metadata = {
  title: "Log in",
};

const page = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h2 className="text-3xl font-bold">Log in to Connect</h2>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted"></div>
              <span>OR</span>
              <div className="h-px flex-1 bg-muted"></div>
            </div>
            <LogInForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        <Image
          src={logInImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default page;
