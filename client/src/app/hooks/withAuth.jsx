"use client";

import { useEffect, useState } from "react";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
      async function validate() {
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");
        const user = localStorage.getItem("user");

        if (!access_token || !refresh_token || !user) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        try {
          let token = access_token;

          let response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-user-detail`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          if (!response.ok) {
            // Try to refresh token
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

            token = newAccessToken;

            // Retry original request
            response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-user-detail`,
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );

            if (!response.ok) throw new Error("Retry failed");
          }

          setIsAuthenticated(true);
        } catch (err) {
          console.error("Authentication error:", err);
          localStorage.clear();
          window.location.href = "/login";
        }
      }

      validate();
    }, []);

    // 🔄 Loading screen while checking auth
    if (isAuthenticated === null) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-white">
          <svg
            className="animate-spin h-10 w-10 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
