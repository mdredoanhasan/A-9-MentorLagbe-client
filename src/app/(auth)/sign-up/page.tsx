"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { FormEvent, useState } from "react";
import { authClient } from "@/app/lib/auth-client";

const inputStyle =
  "mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1e2a78] focus:ring-2 focus:ring-[#1e2a78] text-black";
const labelStyle = "text-sm font-medium text-[#101535]";
const hintStyle = "mt-2 text-sm text-slate-500";

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
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
      const { data, error } = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        ...{ role: form.role },
      });

      if (error) {
        setError(error.message ?? "Something went wrong. Please try again.");
        return;
      }

      console.log(data);
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f4] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="font-(family-name:--font-fraunces) text-3xl font-bold text-[#101535]">
          Create your account
        </h1>
        <p className="mt-1 text-slate-500">
          Join as a student or a mentor. It takes under a minute.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className={labelStyle}>
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={(event) =>
                updateFormField("name", event.target.value)
              }
              placeholder="Your full name"
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(event) =>
                updateFormField("email", event.target.value)
              }
              placeholder="you@example.com"
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelStyle}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(event) =>
                updateFormField("password", event.target.value)
              }
              placeholder="Create a password"
              className={inputStyle}
            />
            <p className={hintStyle}>At least 8 characters.</p>
          </div>

          <div>
            <label htmlFor="role" className={labelStyle}>
              I am a
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={(event) =>
                  updateFormField("role", event.target.value)
                }
                className={`${inputStyle} appearance-none bg-white pr-10`}
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
            <p className={hintStyle}>
              Mentors post tuitions. Students apply to them.
            </p>
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-[#1e2a78] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}