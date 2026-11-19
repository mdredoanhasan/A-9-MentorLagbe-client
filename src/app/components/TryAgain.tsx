"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function TryAgain() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      className="rounded-full bg-[#1e2a78] px-6 py-2.5 font-semibold text-white hover:bg-[#161f5c] disabled:opacity-60"
    >
      {pending ? "Trying…" : "Try again"}
    </button>
  );
}