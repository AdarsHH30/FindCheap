"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FetchRecentSearches from "@/components/FetchRecentSearches";
import Footer01Page from "@/components/Footer/footer";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import {
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
} from "lucide-react";

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatRelative(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const divisions: Array<{
    amount: number;
    unit: Intl.RelativeTimeFormatUnit;
  }> = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  const now = Date.now();
  let duration = (date.getTime() - now) / 1000;
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  for (const { amount, unit } of divisions) {
    if (Math.abs(duration) < amount || unit === "year") {
      return formatter.format(Math.round(duration), unit);
    }
    duration /= amount;
  }

  return null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const userId = user?.id ?? "";
  const {
    searches,
    loading: searchesLoading,
    error: searchesError,
    fetchSearches,
    handleDelete,
  } = useRecentSearches(userId);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          router.push("/auth/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [router, supabase]);

  const handleSignOut = useCallback(async () => {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setSigningOut(false);
    }
  }, [router, supabase]);

  const providerLabel = useMemo(() => {
    const providerRaw =
      (user?.app_metadata?.provider as string | undefined) ?? "email";
    return providerRaw
      .split(/[-_]/)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) return "";
    const metadata = user.user_metadata ?? {};
    if (metadata.full_name) return metadata.full_name;
    if (metadata.name) return metadata.name;
    if (user.email) return user.email.split("@")[0];
    return "Guest";
  }, [user]);

  const memberSince = useMemo(
    () => formatDate(user?.created_at),
    [user?.created_at]
  );
  const lastSignInRelative = useMemo(
    () => formatRelative(user?.last_sign_in_at),
    [user?.last_sign_in_at]
  );
  const lastSignInExact = useMemo(
    () => formatDate(user?.last_sign_in_at),
    [user?.last_sign_in_at]
  );
  const emailVerifiedOn = useMemo(
    () => formatDate(user?.email_confirmed_at),
    [user?.email_confirmed_at]
  );

  const latestSearchInfo = useMemo(() => {
    if (!searches.length) return null;
    let newest = 0;

    for (const item of searches) {
      const ts = new Date(item.searched_at).getTime();
      if (!Number.isNaN(ts) && ts > newest) {
        newest = ts;
      }
    }

    if (!newest) return null;
    const iso = new Date(newest).toISOString();
    return {
      relative: formatRelative(iso),
      absolute: formatDate(iso),
    };
  }, [searches]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-background">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/15 via-background to-transparent"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 py-16 space-y-6">
          <div className="h-56 animate-pulse rounded-3xl border bg-muted/40" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-48 animate-pulse rounded-2xl border bg-muted/30" />
            <div className="h-48 animate-pulse rounded-2xl border bg-muted/30" />
          </div>
        </div>
        <Footer01Page />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary/20 via-background to-transparent"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 pb-16 pt-12 sm:pt-16">
        <section className="rounded-3xl border bg-card/90 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-card/75">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="rounded-full border-4 border-primary/20 p-1">
                <CurrentUserAvatar className="h-24 w-24 md:h-28 md:w-28" />
              </div>
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {displayName}
                  </h1>
                  <p className="text-muted-foreground text-base">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    {providerLabel} sign-in
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                      user.email_confirmed_at
                        ? "border border-emerald-300/50 bg-emerald-500/10 text-emerald-600"
                        : "border border-amber-300/50 bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    {user.email_confirmed_at
                      ? `Email verified${
                          emailVerifiedOn ? ` • ${emailVerifiedOn}` : ""
                        }`
                      : "Email verification pending"}
                  </span>
                  {!searchesLoading && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-muted-foreground">
                      {searches.length} saved searches
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground text-sm">
                  {memberSince
                    ? `Member since ${memberSince}`
                    : "Member since data unavailable."}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={signingOut}
                className="border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                {signingOut ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                )}
                Sign out
              </Button>
            </div>
          </div>
        </section>

        <Separator className="my-10" />

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>
                  Key details that help you manage your FindCheap profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4">
                  <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      <dt className="text-sm font-medium uppercase tracking-wide">
                        Email
                      </dt>
                    </div>
                    <dd className="break-all text-sm text-card-foreground sm:text-base">
                      {user.email}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      <dt className="text-sm font-medium uppercase tracking-wide">
                        Auth provider
                      </dt>
                    </div>
                    <dd className="text-sm text-card-foreground sm:text-base">
                      {providerLabel}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      <dt className="text-sm font-medium uppercase tracking-wide">
                        Member since
                      </dt>
                    </div>
                    <dd className="text-sm text-card-foreground sm:text-base">
                      {memberSince || "Not available"}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      <dt className="text-sm font-medium uppercase tracking-wide">
                        Last sign-in
                      </dt>
                    </div>
                    <dd className="text-sm text-card-foreground sm:text-base">
                      {lastSignInRelative || "Not available"}
                      {lastSignInExact && (
                        <span className="block text-xs text-muted-foreground">
                          {lastSignInExact}
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <FetchRecentSearches
              user_id={user.id}
              className="shadow-sm"
              state={{
                searches,
                loading: searchesLoading,
                error: searchesError,
                handleDelete,
                refetch: fetchSearches,
              }}
            />
          </div>

          <div className="space-y-6">
            <Card className="h-full shadow-sm">
              <CardHeader>
                <CardTitle>Activity Snapshot</CardTitle>
                <CardDescription>
                  Your most recent trends at a glance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">
                      Saved searches
                    </p>
                    <p className="text-3xl font-semibold">
                      {searchesLoading ? "--" : searches.length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">
                      Most recent search
                    </p>
                    <p className="text-base font-medium text-card-foreground">
                      {searchesLoading
                        ? "Checking..."
                        : latestSearchInfo?.relative || "No activity yet"}
                    </p>
                    {latestSearchInfo?.absolute && (
                      <p className="text-xs text-muted-foreground">
                        {latestSearchInfo.absolute}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/find-products">Start a new search</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Footer01Page />
    </div>
  );
}
