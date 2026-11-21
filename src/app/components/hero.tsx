import Link from "next/link";
import {
  Search,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  BadgeCheck,
  Send,
} from "lucide-react";

const popular = ["Math", "Physics", "Chemistry", "Biology", "English"];

export default function Hero() {
  return (
    <section className="bg-[#faf8f4]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        {/* Left */}
        <div>
          <h1 className="font-(family-name:--font-fraunces) text-5xl font-bold leading-[1.05] text-[#101535]">
            Find Your Ideal Tutor or Tuition Batch Today
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-500">
            Browse approved tuitions in Math, Physics, Programming, IELTS and
            more. Apply with your preferred schedule and hear back directly from
            the tutor.
          </p>

          {/* Search (submits to /tuitions?searchQuery=...) */}
          <form action="/tuitions" method="get" className="mt-8 flex gap-3">
            <input
              type="text"
              name="searchQuery"
              placeholder="Search a subject or title, e.g. Physics"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1e2a78] text-black/50"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-[#1e2a78] hover:bg-amber-400"
            >
              <Search size={16} />
              Search
            </button>
          </form>

          {/* Popular */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-500">Popular:</span>
            {popular.map((item) => (
              <Link
                key={item}
                href={`/tuitions?searchQuery=${item}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-1 text-[#1e2a78] hover:border-[#1e2a78]"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <Link
              href="/tuitions"
              className="rounded-xl bg-[#1e2a78] px-6 py-3 font-semibold text-white hover:bg-[#161f5c]"
            >
              Browse Tuitions
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl border border-[#1e2a78] px-6 py-3 font-semibold text-[#1e2a78] hover:bg-[#1e2a78]/5"
            >
              Become a Tutor
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#1e2a78]" /> Every listing
              is reviewed
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap size={16} className="text-[#1e2a78]" /> Online and
              Offline tutors
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#1e2a78]" /> Free to browse
              and apply
            </span>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-4xl bg-[#e6eafc] p-4">
            <svg viewBox="0 0 490 405" className="w-full">
              <circle cx="400" cy="88" r="49" fill="#f5a623" />
              <path
                d="M58 112l10 22 22 10-22 10-10 22-10-22-22-10 22-10z"
                fill="#f5a623"
              />
              <path
                d="M437 205l7 15 15 7-15 7-7 15-7-15-15-7 15-7z"
                fill="#7b86c4"
              />
              <rect
                x="55"
                y="335"
                width="385"
                height="12"
                rx="6"
                fill="#c3c8e6"
              />
              <rect
                x="105"
                y="280"
                width="182"
                height="43"
                rx="6"
                fill="#1e2a78"
              />
              <rect
                x="120"
                y="238"
                width="156"
                height="42"
                rx="6"
                fill="#f59e0b"
              />
              <rect
                x="138"
                y="196"
                width="128"
                height="42"
                rx="10"
                fill="#3f4a8a"
                stroke="#1e2a78"
                strokeWidth="4"
              />
              <polygon
                points="107,148 203,115 297,148 203,176"
                fill="#1e2a78"
              />
              <line
                x1="297"
                y1="148"
                x2="297"
                y2="200"
                stroke="#f59e0b"
                strokeWidth="5"
              />
              <circle cx="297" cy="206" r="8" fill="#f59e0b" />
              <rect
                x="305"
                y="232"
                width="130"
                height="90"
                rx="8"
                fill="#fff"
                stroke="#1e2a78"
                strokeWidth="4"
              />
              <rect
                x="320"
                y="248"
                width="40"
                height="7"
                rx="3"
                fill="#7b86c4"
              />
              <rect
                x="320"
                y="264"
                width="92"
                height="7"
                rx="3"
                fill="#c3c8e6"
              />
              <rect
                x="320"
                y="280"
                width="75"
                height="7"
                rx="3"
                fill="#c3c8e6"
              />
              <circle cx="410" cy="304" r="7" fill="#f59e0b" />
              <rect
                x="290"
                y="322"
                width="160"
                height="6"
                rx="3"
                fill="#1e2a78"
              />
            </svg>
          </div>

          <div className="absolute -left-6 top-6 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm shadow-md text-black/50">
            <BadgeCheck size={18} className="text-green-600" />
            Admin-approved listings
          </div>
          <div className="absolute -right-4 bottom-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm shadow-md text-black/50">
            <Send size={18} className="text-[#1e2a78]" />
            Apply in under a minute
          </div>
        </div>
      </div>
    </section>
  );
}
