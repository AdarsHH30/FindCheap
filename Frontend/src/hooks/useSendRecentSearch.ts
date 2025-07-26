import { useCallback } from "react";
import { createClient } from "@/utils/supabase/client"; // Import the createClient function
type SendSearchFn = (searchTerm: string) => Promise<void>;

const useSendRecentSearch = (): SendSearchFn => {
  const sendRecentSearch = useCallback(async (searchTerm: string) => {
    const supabase = createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Failed to get session:", sessionError.message);
      return;
    }

    if (!session?.user?.id) {
      console.log("User not logged in");
      return;
    }

    const userId = session.user.id;

    console.log("Sending recent search for user:", userId, "Search term:", searchTerm);
    const res = await fetch("/api/search/save/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, search: searchTerm }),
    });

    if (!res.ok) {
      console.error("Failed to send recent search");
    } else {
      console.log("Recent search sent!");
    }
  }, []);

  return sendRecentSearch;
};

export default useSendRecentSearch;
