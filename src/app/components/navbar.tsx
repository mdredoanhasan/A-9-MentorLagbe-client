"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { authClient, useSession } from "@/app/lib/auth-client";
import { normalizeUserRole } from "@/components/type";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-work", label: "How It Works" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;
  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";
  const userRole = normalizeUserRole(user?.role);

  async function handleSignOut() {
    setSignOutError("");
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setSignOutError(error.message ?? "Could not sign out. Please try again.");
        return;
      }

      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      setSignOutError("Could not sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-[#faf8f4] backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5">
        <Link href="/" className="font-serif text-2xl font-bold">
          <span className="text-[#1e2a78]">Mentor</span>
          <span className="text-amber-500">Lagbe</span>
        </Link>

        <ul className="hidden gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#1e2a78] ${
                    active ? "text-[#1e2a78]" : "text-slate-500"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex min-w-48 items-center justify-end gap-3">
          {user ? (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Open account menu for ${user.name}`}
                  className="flex items-center gap-2 rounded-full border-2 border-[#1e2a78] bg-white py-1 pl-1 pr-3 text-[#101535] outline-none transition-colors hover:bg-[#e8eafb] focus-visible:ring-2 focus-visible:ring-[#1e2a78] focus-visible:ring-offset-2 data-[state=open]:bg-[#e8eafb]"
                >
                  <Avatar>
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>
                  <span className="block truncate">{user.name}</span>
                  <span className="block truncate text-xs font-normal text-slate-500">
                    {user.email}
                  </span>
                  <span className="mt-2 inline-block rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold capitalize text-amber-700">
                    {userRole}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      userRole === "mentor"
                        ? "/dashboard/mentor"
                        : userRole === "admin"
                          ? "/dashboard/admin"
                          : "/dashboard/student"
                    }
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Update profile</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {signOutError && (
                  <p role="alert" className="px-3 py-1 text-sm text-red-600">
                    {signOutError}
                  </p>
                )}
                <DropdownMenuItem
                  variant="danger"
                  disabled={isSigningOut}
                  onSelect={(event) => {
                    event.preventDefault();
                    void handleSignOut();
                  }}
                >
                  {isSigningOut ? "Signing out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isPending ? (
            <span className="size-10" aria-hidden="true" />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full border border-[#1e2a78] px-5 py-2 text-sm font-semibold text-[#1e2a78] transition-colors hover:bg-[#e8eafb]"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[#1e2a78] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#161f5c]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}