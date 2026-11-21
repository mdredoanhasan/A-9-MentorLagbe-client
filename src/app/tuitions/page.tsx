import { Suspense } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  CloudOff,
  SearchX,
  MapPin,
  CalendarDays,
} from "lucide-react";
import TryAgain from "../components/TryAgain";
import { BookmarkButton, BookmarkProvider } from "../components/bookmark-controls";
import { Tuition } from "@/components/type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const PAGE_SIZE = 9;

const subjects = ["Math", "Physics", "Chemistry", "Biology", "English", "Programming", "IELTS"];
const levels = ["Class 6-8", "Class 9-10 (SSC)", "Class 11-12 (HSC)", "O/A Level", "University", "Adult / Professional"];
const modes = [
  { value: "", label: "Online and offline" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

const serif = "font-[family-name:var(--font-fraunces)] font-bold";
const heading = `${serif} text-[#101535]`;

const subjectColors: Record<string, string> = {
  math: "#1e2a78",
  mathematics: "#1e2a78",
  physics: "#3b4aa8",
  programming: "#101535",
  ielts: "#b45309",
  chemistry: "#0f766e",
  biology: "#15803d",
  english: "#6d4bd1",
};
const subjectColor = (subject?: string) =>
  subjectColors[(subject ?? "").trim().toLowerCase()] ?? "#1e2a78";

type TuitionFilters = {
  searchQuery: string;
  subject: string;
  level: string;
  mode: string;
};

type TuitionResult = {
  tuitions: Tuition[];
  total: number;
  totalPages: number;
};

/** Returns the result, or null when the server could not be reached. */
async function getTuitions(
  filters: TuitionFilters,
  page: number,
): Promise<TuitionResult | null> {
  const queryParams = new URLSearchParams();
  if (filters.searchQuery) queryParams.set("q", filters.searchQuery);
  for (const name of ["subject", "level", "mode"] as const) {
    if (filters[name]) queryParams.set(name, filters[name]);
  }
  queryParams.set("page", String(page));
  queryParams.set("limit", String(PAGE_SIZE));

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tuitions?${queryParams.toString()}`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;
    const data = await response.json();

    // Plain array (no pagination on the server yet)
    if (Array.isArray(data)) {
      return { tuitions: data, total: data.length, totalPages: 1 };
    }
    if (!Array.isArray(data.tuitions)) return null;

    const total = Number(data.total ?? data.tuitions.length);
    return {
      tuitions: data.tuitions,
      total,
      totalPages: Number(data.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE))),
    };
  } catch {
    return null;
  }
}

function getFirstSearchParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function pageHref(filters: TuitionFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.searchQuery) params.set("searchQuery", filters.searchQuery);
  if (filters.subject) params.set("subject", filters.subject);
  if (filters.level) params.set("level", filters.level);
  if (filters.mode) params.set("mode", filters.mode);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/tuitions?${qs}` : "/tuitions";
}

function getPageList(current: number, total: number): (number | "...")[] {
  const pages = [
    ...new Set(
      [1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total),
    ),
  ].sort((a, b) => a - b);
  const list: (number | "...")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) list.push("...");
    list.push(p);
  });
  return list;
}

export default function BrowseTuitionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <TuitionResults searchParams={searchParams} />
    </Suspense>
  );
}

async function TuitionResults({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters: TuitionFilters = {
    searchQuery: getFirstSearchParam(params.searchQuery ?? params.q),
    subject: getFirstSearchParam(params.subject),
    level: getFirstSearchParam(params.level),
    mode: getFirstSearchParam(params.mode),
  };
  const hasFilters = Object.values(filters).some(Boolean);
  const page = Math.max(1, Number.parseInt(getFirstSearchParam(params.page), 10) || 1);

  const result = await getTuitions(filters, page);

  return (
    <section className="bg-[#faf8f4] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className={`${heading} text-4xl sm:text-5xl`}>Browse Tuitions</h1>
        <p className="mt-3 text-slate-500">
          Search approved tuition batches and 1-on-1 tutoring by subject, class
          level and mode.
        </p>

        {/* Search and filter bar: a plain GET form, so everything lands in the URL */}
        <form
          action="/tuitions"
          method="get"
          className="mt-8 flex flex-col gap-3 rounded-3xl border border-[#e3e5f5] bg-white p-4 shadow-sm lg:flex-row lg:items-center"
        >
          <div className="relative flex-1">
            <label htmlFor="searchQuery" className="sr-only">
              Search by title or subject
            </label>
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="searchQuery"
              name="searchQuery"
              defaultValue={filters.searchQuery}
              placeholder="Search by title or subject, e.g. Physics"
              className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm text-[#101535] outline-none placeholder:text-slate-400 focus:border-[#1e2a78] focus:ring-2 focus:ring-[#1e2a78]/20"
            />
          </div>

          <Select
            label="Subject"
            name="subject"
            value={filters.subject}
            options={[
              { value: "", label: "All subjects" },
              ...subjects.map((s) => ({ value: s, label: s })),
            ]}
          />
          <Select
            label="Class level"
            name="level"
            value={filters.level}
            options={[
              { value: "", label: "All levels" },
              ...levels.map((l) => ({ value: l, label: l })),
            ]}
          />
          <Select label="Mode" name="mode" value={filters.mode} options={modes} />

          <button
            type="submit"
            className="h-12 rounded-xl bg-amber-500 px-7 text-sm font-bold text-[#101535] transition-colors hover:bg-amber-400"
          >
            Search
          </button>
        </form>

        {/* Results */}
        <div className="mt-8">
          {result === null ? (
            <ErrorState />
          ) : result.tuitions.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <>
              <p className="mb-5 text-sm font-medium text-slate-500">
                Showing {(page - 1) * PAGE_SIZE + 1}-
                {(page - 1) * PAGE_SIZE + result.tuitions.length} of {result.total}{" "}
                approved {result.total === 1 ? "tuition" : "tuitions"}
              </p>
              <BookmarkProvider>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {result.tuitions.map((tuition) => (
                    <TuitionCard key={tuition._id} tuition={tuition} />
                  ))}
                </div>
              </BookmarkProvider>
              {result.totalPages > 1 && (
                <Pagination
                  filters={filters}
                  page={page}
                  totalPages={result.totalPages}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pieces ---------- */

function Select({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative lg:w-48">
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={value}
        className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-[#101535] outline-none focus:border-[#1e2a78] focus:ring-2 focus:ring-[#1e2a78]/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

function TuitionCard({ tuition }: { tuition: Tuition }) {
  const isOnline = tuition.mode?.toLowerCase() === "online";
  const tutorName = tuition.tutorName;
  const fee = Number(tuition.monthlyFee);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e3e5f5] bg-white shadow-lg shadow-[#1e2a78]/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1e2a78]/10">
      {/* Banner */}
      <div
        className="relative h-37.5 shrink-0 overflow-hidden"
        style={{ backgroundColor: subjectColor(tuition.subject) }}
      >
        <BookmarkButton
          tuitionId={tuition._id}
          className="absolute right-4 top-4 z-10"
        />
        {tuition.bannerUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tuition.bannerUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"
            />
          </>
        ) : (
          <>
            <span
              aria-hidden="true"
              className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-white/10"
            />
          </>
        )}

        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#101535]">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-600" : "bg-amber-500"}`}
          />
          <span>{tuition.mode === "in-person" ? "Offline" : tuition.mode}</span>
        </span>

        <p className={`${serif} absolute bottom-4 left-5 right-5 truncate text-2xl text-white`}>
          {tuition.subject}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#e8eafb] px-2.5 py-1 text-xs font-medium text-[#1e2a78]">
            {tuition.classLevel}
          </span>
          <span className="rounded-full bg-[#e8eafb] px-2.5 py-1 text-xs font-medium text-[#1e2a78]">
            {tuition.daysPerWeek} days/week
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-12 text-lg font-semibold leading-6 text-[#101535]">
          {tuition.title}
        </h3>

        <p className="mt-3 flex items-center gap-2 text-[13px] text-slate-500">
          <MapPin size={15} className="shrink-0" />
          <span className="truncate">{tuition.location}</span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-[13px] text-slate-500">
          <CalendarDays size={15} className="shrink-0" />
          <span>{tuition.daysPerWeek} days a week</span>
        </p>

        {tutorName && (
          <div className="mt-4 flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e2a78] text-sm font-semibold text-white">
              {tutorName.trim().charAt(0).toUpperCase()}
            </span>
            <span className="truncate text-sm font-medium text-[#101535]">
              {tutorName}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#e3e5f5] pt-4">
          <p className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-[#1e2a78]">
              ৳{Number.isFinite(fee) ? fee.toLocaleString("en-US") : tuition.monthlyFee}
            </span>
            <span className="text-[13px] text-slate-500">/month</span>
          </p>
          <Link
            href={`/tuitions/${tuition._id}`}
            className="rounded-full bg-[#1e2a78] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#161f5c]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function Pagination({
  filters,
  page,
  totalPages,
}: {
  filters: TuitionFilters;
  page: number;
  totalPages: number;
}) {
  const base =
    "flex h-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors";
  const idle = "border-[#e3e5f5] bg-white text-[#101535] hover:border-[#1e2a78]";
  const disabled = "cursor-not-allowed border-[#e3e5f5] bg-white text-slate-300";

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={pageHref(filters, page - 1)} className={`${base} ${idle} px-5`}>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={`${base} ${disabled} px-5`}>
          Previous
        </span>
      )}

      {getPageList(page, totalPages).map((item, index) =>
        item === "..." ? (
          <span key={`gap-${index}`} className="px-1 text-slate-400">
            ...
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(filters, item)}
            aria-current={item === page ? "page" : undefined}
            className={`${base} w-10 ${
              item === page
                ? "border-[#1e2a78] bg-[#1e2a78] text-white"
                : idle
            }`}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={pageHref(filters, page + 1)} className={`${base} ${idle} px-5`}>
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={`${base} ${disabled} px-5`}>
          Next
        </span>
      )}
    </nav>
  );
}

function StateCard({
  icon,
  title,
  text,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8eafb] text-[#1e2a78]">
        {icon}
      </span>
      <h2 className={`${heading} mt-5 text-xl`}>{title}</h2>
      <p className="mt-1 text-slate-500">{text}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ErrorState() {
  return (
    <StateCard
      icon={<CloudOff size={24} />}
      title="We could not load tuitions"
      text="The server did not respond. Please try again."
    >
      <TryAgain />
    </StateCard>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <StateCard
      icon={<SearchX size={24} />}
      title="No tuitions available"
      text={
        hasFilters
          ? "Nothing matches these filters. Try a different search."
          : "There are no approved tuitions right now. Please check back soon."
      }
    >
      {hasFilters && (
        <Link
          href="/tuitions"
          className="rounded-full border border-[#1e2a78] px-5 py-2.5 text-sm font-semibold text-[#1e2a78] hover:bg-[#e8eafb]"
        >
          Clear filters
        </Link>
      )}
    </StateCard>
  );
}

function LoadingSkeleton() {
  return (
    <section className="bg-[#faf8f4] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-12 w-72 animate-pulse rounded-xl bg-[#e8eafb]" />
        <div className="mt-8 h-20 animate-pulse rounded-3xl bg-white" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-117 animate-pulse rounded-[20px] bg-white" />
          ))}
        </div>
      </div>
    </section>
  );
}