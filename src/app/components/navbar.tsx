import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-[#faf8f4]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold">
          <span className="text-[#1e2a78]">Mentor</span>
          <span className="text-amber-500">Lagbe</span>
        </Link>

        {/* Links */}
        <ul className="flex gap-8 text-slate-500">
          <li><Link href="/" className="text-[#1e2a78]">Home</Link></li>
          <li><Link href="/tuitions" className="hover:text-[#1e2a78]">Browse Tuitions</Link></li>
          <li><Link href="/pricing" className="hover:text-[#1e2a78]">Pricing</Link></li>
          <li><Link href="/#how-it-work" className="hover:text-[#1e2a78]">How It Works</Link></li>
        </ul>

        {/* Buttons */}
        <div className="flex gap-3">
          <a href="/sign-in" className="rounded-lg border border-[#1e2a78] px-5 py-2 text-[#1e2a78]">
            Sign In
          </a>
          <a href="/sign-up" className="rounded-lg bg-[#1e2a78] px-5 py-2 text-white">
            Sign Up
          </a>
        </div>
      </nav>
    </header>
  );
}