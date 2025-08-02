"use client";
import { useEffect } from "react";

export default function CSRFInit() {
  useEffect(() => {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://127.0.0.1:8000";

    fetch(`${baseUrl}/api/csrf/`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("CSRF cookie set", data);
      })
      .catch((error) => console.error("Failed to set CSRF cookie:", error));
  }, []);

  return null;
}
