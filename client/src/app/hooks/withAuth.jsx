"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const user = localStorage.getItem("user");

    if (!access_token || !refresh_token || !user) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    useEffect(() => {
      async function validate() {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-user-detail`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );

          if (!response.ok) {
            const refreshResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-new-access-token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh_token }),
              }
            );

            if (!refreshResponse.ok) throw new Error("Refresh failed");

            const { access_token: newAccessToken } =
              await refreshResponse.json();
            localStorage.setItem("access_token", newAccessToken);

            const retry = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-user-detail`,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
            );

            if (!retry.ok) throw new Error("Retry failed");
          }

          setIsAuthenticated(true);
        } catch (err) {
          localStorage.clear();
          console.error("Authentication error:", err);
          window.location.href = "/login";
        }
      }

      validate();
    }, []);

    if (isAuthenticated === null) {
      return null; // Or loading screen
    }

    return <Component {...props} />;
  };
}
