import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { CurrentUserAvatar } from "./current-user-avatar";
import { getCSRFToken } from "@/utils/csrf";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://127.0.0.1:8000";

interface LoginComponentProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ user, setUser }) => {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Setup auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);

        if (session.access_token) {
          try {
            const response = await fetch(`${baseUrl}/api/auth/verify/`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken() || "",
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
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    // Initial session check
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setUser]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  if (user) {
    return (
      <Popover>
        <PopoverTrigger>
          <CurrentUserAvatar className="hover:opacity-70" />
        </PopoverTrigger>
        <PopoverContent className="w-max flex flex-col items-center justify-center gap-2">
          <div className="gap-4 justify-center items-center text-sm flex">
            <Icons.google className="h-6 w-6" />
            <div className="flex flex-col">
              <p className="font-bold text-[17px]">
                {user.user_metadata.full_name}
              </p>
              <p>{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full gap-0"
            onClick={() => (window.location.href = "/profile")}
          >
            Profile
          </Button>
          <Button
            variant="destructive"
            className="w-full gap-0"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Logout"}
          </Button>
        </PopoverContent>
      </Popover>
    );
  } else {
    return (
      <Button
        className="rounded-full"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Login"}
      </Button>
    );
  }
};

export default LoginComponent;
