"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient, useSession } from "@/app/lib/auth-client";
import { normalizeUserRole } from "@/components/type";
import { toast } from "sonner";

const linkStyle = "text-slate-500 hover:text-[#1e2a78]";

export default function FooterAccount() {
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const user = session?.user;

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const { error: signOutError } = await authClient.signOut();
      if (signOutError) {
        toast.error(signOutError.message ?? "Could not log out. Please try again.");
        return;
      }
      toast.success("Signed out successfully.");
    } catch {
      toast.error("Could not log out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isPending) {
    return <p className="mt-4 text-slate-500">Loading account...</p>;
  }

  if (!user) {
    return (
      <ul className="mt-4 space-y-3">
        <li>
          <Link href="/sign-in" className={linkStyle}>
            Sign In
          </Link>
        </li>
        <li>
          <Link href="/sign-up" className={linkStyle}>
            Sign Up
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div>
        <p className="font-medium text-[#101535]">{user.name}</p>
        <p className="text-sm capitalize text-slate-500">
          {normalizeUserRole(user.role)}
        </p>
      </div>
      <Link href="/profile" className={linkStyle}>
        Update profile
      </Link>
      <button
        type="button"
        disabled={isSigningOut}
        onClick={handleSignOut}
        className={`block disabled:opacity-60 ${linkStyle}`}
      >
        {isSigningOut ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
}
