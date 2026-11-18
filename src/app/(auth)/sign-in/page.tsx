"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: call your auth API here
    console.log({ email, password });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f4] ">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#101535]">
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
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1e2a78] text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#1e2a78] py-3 font-semibold text-white hover:bg-[#161f5c]"
          >
            Sign in
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
