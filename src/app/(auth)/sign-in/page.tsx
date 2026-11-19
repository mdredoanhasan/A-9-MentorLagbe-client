"use client";

import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateFormField(fieldName: string, value: string) {
    setForm((previousForm) => ({ ...previousForm, [fieldName]: value }));
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setError(error.message ?? "Invalid email or password.");
        return;
      }

      console.log(data);
      router.push("/");
      router.refresh(); // refresh server components so they see the new session
    } catch {
      setError("Network error. Please try again.");
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
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(event) =>
                updateFormField("password", event.target.value)
              }
              placeholder="Your password"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1e2a78] text-black"
            />
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