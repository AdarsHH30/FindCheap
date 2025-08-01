"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

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
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {user && (
        <div className="bg-card rounded-lg p-6 shadow">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4">
            <CurrentUserAvatar className="h-24 w-24 md:h-32 md:w-32" />
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-semibold">
                {user.user_metadata.full_name}
              </h2>
              <p className="text-lg text-muted-foreground">{user.email}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Account ID: {user.id}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8">
        {" "}
        <Button
          variant="outline"
          className=" bg-red-500 text-white hover:bg-red-600"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/");
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
