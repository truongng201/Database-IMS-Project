"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setPending(true);

    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(username, email, password);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        setError(errorData.message);
        setShowAlert(true);

        // Hide alert after 5 seconds
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);

        setPending(false);
        return;
      }

      router.push("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.message);
      setShowAlert(true);

      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      setPending(false);
      return;
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      {showAlert && (
        <div
          className="fixed top-4 right-4 z-50 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 shadow-lg"
          role="alert"
        >
          <span className="font-medium">Registration error!</span> {error}
        </div>
      )}
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign up</h3>
          <p className="text-sm text-gray-500">
            Create an account with your email and password
          </p>
        </div>
        <form
          onSubmit={handleRegister}
          className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-xs text-gray-600 uppercase"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="John Doe"
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs text-gray-600 uppercase"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="johndoe@gmail.com"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs text-gray-600 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="flex h-10 w-full items-center justify-center rounded-md border bg-black text-white text-sm font-medium transition-all hover:bg-gray-800 disabled:opacity-50"
          >
            {pending ? (
              <>
                <svg
                  className="animate-spin mr-2 h-4 w-4 text-white"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-gray-800">
              Sign in
            </Link>{" "}
            instead.
          </p>
        </form>
      </div>
    </div>
  );
}
