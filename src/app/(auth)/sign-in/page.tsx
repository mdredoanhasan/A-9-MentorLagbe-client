"use client";

import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

function getSafeRedirectPath(callbackUrl: string | null, origin: string) {
  if (
    !callbackUrl ||
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//")
  ) {
    return "/";
  }

  try {
    const destination = new URL(callbackUrl, origin);
    if (destination.origin !== origin) return "/";
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/";
  }
}

export default function SignInPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function updateFormField(fieldName: string, value: string) {
    setForm((previousForm) => ({ ...previousForm, [fieldName]: value }));
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (error) {
        const message = error.message ?? "Invalid email or password.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Signed in successfully.");
      const callbackUrl = new URLSearchParams(
        window.location.search,
      ).get("callbackUrl");
      const redirectPath = getSafeRedirectPath(
        callbackUrl,
        window.location.origin,
      );
      router.replace(redirectPath);
      router.refresh();
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f4] px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="font-(family-name:--font-fraunces) text-3xl font-bold text-[#101535]">
          Welcome back
        </h1>
        <p className="mt-1 text-slate-500">
          Sign in to manage your tuitions and applications.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#101535]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                updateFormField("email", event.target.value)
              }
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1e2a78] text-black"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#101535]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(event) =>
                  updateFormField("password", event.target.value)
                }
                placeholder="Your password"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm text-black outline-none focus:border-[#1e2a78]"
              />
              <button
                type="button"
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-[#1e2a78] focus-visible:outline-2 focus-visible:outline-[#1e2a78]"
              >
                {isPasswordVisible ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#1e2a78] py-3 font-semibold text-white hover:bg-[#161f5c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to MentorLagbe?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-[#1e2a78] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}