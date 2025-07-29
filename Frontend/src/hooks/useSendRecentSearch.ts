import { useCallback } from "react";
import { createClient } from "@/utils/supabase/client"; // Import the createClient function
type SendSearchFn = (searchTerm: string) => Promise<void>;
import { getCookie } from '@/utils/csrf'


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
    const token = session.access_token;

    console.log("Sending recent search for user:", userId, "Search term:", searchTerm);
    const res = await fetch("http://localhost:8000/api/search/save/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken") || "",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ search_text: searchTerm }),
    });

    if (!res.ok) {
      console.error("Failed to send recent search:", await res.text());
    } else {
      console.log("Recent search sent!");
    }
  }, []);

  return sendRecentSearch;
};

export default useSendRecentSearch;
