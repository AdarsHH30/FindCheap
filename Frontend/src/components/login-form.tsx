"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/csrf";
const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://127.0.0.1:8000";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.message === "Email not confirmed") {
        setError(
          "Your email address has not been verified. Please check your inbox for a verification email or request a new one."
        );

        try {
          await supabase.auth.resend({
            type: "signup",
            email,
          });
          setError(
            "Your email address has not been verified. We've sent a new verification email to your address."
          );
        } catch (resendError) {
          console.error("Failed to resend verification email:", resendError);
        }
      } else {
        setError(
          error.message || "Failed to login. Please check your credentials."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);

        if (session.access_token) {
          try {
            const response = await fetch(`${baseUrl}/api/auth/verify/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken") || "",
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            if (!response.ok) {
              console.error(
                "Backend verification failed:",
                await response.text()
              );
            }
          } catch (error) {
            console.error("Error verifying with backend:", error);
          }
        }
        router.push("/");
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        router.push("/");
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <>
      {" "}
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={handleEmailLogin}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 mr-2"
            >
              <path
                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                fill="currentColor"
              />
            </svg>
            {isLoading ? "Loading..." : "Login with Google"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              try {
                setIsLoading(true);
                await supabase.auth.signInWithOAuth({
                  provider: "github",
                  options: {
                    redirectTo: `${window.location.origin}/`,
                  },
                });
              } catch (error) {
                console.error("GitHub login error:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 mr-2"
            >
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"
                fill="currentColor"
              />
            </svg>
            {isLoading ? "Loading..." : "Login with GitHub"}
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </form>
      <div className="mt-8 text-center text-sm text-muted-foreground"></div>
    </>
  );
}
