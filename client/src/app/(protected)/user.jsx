"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function User() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user")) || null
      : null;

  const signOut = async (e) => {
    e.preventDefault();

    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout?refresh_token=${refresh_token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${access_token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.message);
      setShowAlert(true);

      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      return;
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <DropdownMenu>
      {showAlert && (
        <div
          className="fixed top-4 right-4 z-50 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 shadow-lg"
          role="alert"
        >
          <span className="font-medium">Logout error!</span> {error}
        </div>
      )}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={user?.image ?? "/placeholder-user.jpg"}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="https://github.com/truongng201/Database-IMS-Project"
            target="_blank"
          >
            Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem asChild>
            <button onClick={signOut} className="w-full text-left">
              Sign Out
            </button>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <Link href="/login">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
