"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ModeToggle } from "@/components/theme-mode";


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.format();
      setFormErrors({
        email: errors.email?._errors[0] || "",
        password: errors.password?._errors[0] || "",
      });
      return;
    }
    setFormErrors({ email: "", password: "" });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || "Login failed");
        return;
      }

      const data = await response.json();
      const token = data.token;
      localStorage.setItem("authToken", token);
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">

      <div className="mx-5 md:mx-16 max-w-md w-full rounded-2xl px-4 pb-8 pt-12 md:p-8 shadow-input bg-white dark:bg-black border border-stone-400 dark:border-stone-300 ">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-100 mb-1">
          Welcome to Festivix
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">Connect to exciting events and manage your bookings all in one place.</p>
        
        <ModeToggle/>

        <form className="my-8" onSubmit={handleSubmit} noValidate>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
          </LabelInputContainer>

          

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Login &rarr;
            <BottomGradient />
          </button>

          {errorMessage && <> <p className="text-red-500 text-sm mt-2  text-center mx-auto">{errorMessage}</p>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-2 mb-8 h-[1px] w-full" /> </>}
          {!errorMessage && <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-8 mb-8 h-[1px] w-full" />}

          

          <div className="flex items-center justify-between mx-2">
            <div className="text-sm">
              <Link href="/register" className="font-medium text-neutral-800 dark:text-neutral-200">
                Register Instead
              </Link>
            </div>

            <div className="text-sm">
              <Link href="/reset-request" className="font-medium text-neutral-800 dark:text-neutral-200">
                Forgot password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);
