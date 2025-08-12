"use client";
// import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Icons } from "@/components/icons";
import Link from "next/dist/client/link";
import Footer01Page from "@/components/Footer/footer";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      {/* <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <Link href="/" className="flex items-center gap-2 font-medium">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <Icons.logo className="h-6 w-6" />
        </div>
        </Link>
      </div> */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <LoginForm />
        </div>
      </div>
      {/* </div> */}
      {/* <div className="bg-muted relative hidden lg:block">
        <video
          src="/placeholder.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </div> */}
    </div>
  );
}
