"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [pending, setPending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const user = localStorage.getItem("user");

    if (accessToken && refreshToken && user) {
      router.replace("/"); // 👈 redirect to homepage
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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

    // Success case
    const data = await response.json();
    localStorage.setItem("access_token", data?.data?.access_token);
    localStorage.setItem("refresh_token", data?.data?.refresh_token);
    localStorage.setItem("user", JSON.stringify(data?.data?.user));
    setPending(false);
    setError(null);
    setShowAlert(false);
    router.push("/");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      {showAlert && (
        <div
          className="fixed top-4 right-4 z-50 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 shadow-lg"
          role="alert"
        >
          <span className="font-medium">Login error!</span> {error}
        </div>
      )}
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p>
        </div>
        <form
          className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
          onSubmit={handleSubmit}
        >
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
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <button
            type={pending ? "button" : "submit"}
            aria-disabled={pending}
            className="flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
          >
            Sign In
            {pending && (
              <svg
                className="animate-spin ml-2 h-4 w-4 text-black"
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
            )}
            <span aria-live="polite" className="sr-only" role="status">
              {pending ? "Loading" : "Submit form"}
            </span>
          </button>
          <p className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Sign up
            </Link>
            {" for free."}
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
