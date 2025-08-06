import { useState, useEffect } from "react";

export interface AuthStatus {
  isLoggedIn: boolean;
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
}

export function useAuthStatus() {
  const [auth, setAuth] = useState<AuthStatus>({ isLoggedIn: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/status", {
          credentials: "include",
        });
        const data = await res.json();
        setAuth({
          isLoggedIn: data.isLoggedIn,
          user: data.user,
        });
      } catch {
        setAuth({ isLoggedIn: false });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return { ...auth, loading };
}