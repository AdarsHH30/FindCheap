"use client";

import { RegisterForm } from "@/components/register-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
