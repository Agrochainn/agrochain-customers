"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function GlobalFetchHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          // Check if we should skip the global toast (e.g. if handled by apiCall)
          if (
            args[1]?.headers &&
            (args[1].headers as any)["X-Skip-Global-Toast"]
          ) {
            return response;
          }

          const clone = response.clone();

          try {
            const data = await clone.json();
            const errorMessage =
              data.message ||
              data.error ||
              `Error ${response.status}: ${response.statusText}`;

            // Avoid showing toasts for certain silent errors if needed
            // But user asked for EVERY fetch error
            toast.error("Process Failed", {
              description: errorMessage,
              position: "top-center",
              duration: 5000,
            });
          } catch (e) {
            // If response is not JSON, show a generic error
            toast.error("Process Failed", {
              description: `Server returned ${response.status}: ${response.statusText}`,
              position: "top-center",
              duration: 5000,
            });
          }

          // Handle 401 Unauthorized globally
          if (
            response.status === 401 &&
            !window.location.pathname.includes("/auth")
          ) {
            // Clear token if necessary
            // localStorage.removeItem("authToken");
          }
        }

        return response;
      } catch (error: any) {
        // Network errors (e.g., DNS failure, connection refused)
        toast.error("Network Error", {
          description:
            "Failed to connect to the server. Please check your internet connection.",
          position: "top-center",
          duration: 5000,
        });
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
