import { Suspense } from "react";
import Link from "next/link";
import {
  Search, ChevronDown, CloudOff, SearchX, MapPin, CalendarDays, Monitor, BookOpen,
} from "lucide-react";
import TryAgain from "../components/TryAgain";
import { Tuition } from "@/components/type";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const subjects = ["Math", "Physics", "Chemistry", "Biology", "English", "Programming", "IELTS"];
const levels = ["Class 6-8", "Class 9-10 (SSC)", "Class 11-12 (HSC)", "O/A Level", "University", "Adult / Professional"];
const modes = [
  { value: "", label: "Online and offline" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

const heading = "font-[family-name:var(--font-fraunces)] font-bold text-[#101535]";

type TuitionFilters = {
  searchQuery: string;
  subject: string;
  level: string;
  mode: string;
};

/** Returns the list, or null when the server could not be reached. */
async function getTuitions(filters: TuitionFilters): Promise<Tuition[] | null> {
  const queryParams = new URLSearchParams();
  if (filters.searchQuery) queryParams.set("q", filters.searchQuery);

  for (const filterName of ["subject", "level", "mode"] as const) {
    if (filters[filterName]) queryParams.set(filterName, filters[filterName]);
  }

  const queryString = queryParams.toString();

  try {
    const response = await fetch(`${API_BASE_URL}/api/tuitions?${queryString}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const responseData = await response.json();
    return Array.isArray(responseData)
      ? responseData
      : (responseData.tuitions ?? null);
  } catch {
    return null;
  }
}

function getFirstSearchParam(
  value: string | string[] | undefined,
): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default function BrowseTuitionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <section className="bg-[#faf8f4] py-14">
          <div className="mx-auto max-w-6xl px-6 text-slate-500">
            Loading tuitions...
          </div>
        </section>
      }
    >
      <TuitionResults searchParams={searchParams} />
    </Suspense>
  );
}

async function TuitionResults({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParamValues = await searchParams;
  const filters: TuitionFilters = {
    searchQuery: getFirstSearchParam(
      searchParamValues.searchQuery ?? searchParamValues.q,
    ),
    subject: getFirstSearchParam(searchParamValues.subject),
    level: getFirstSearchParam(searchParamValues.level),
    mode: getFirstSearchParam(searchParamValues.mode),
  };
  const hasFilters = Object.values(filters).some(Boolean);

  const tuitions = await getTuitions(filters);

  return (
    <section className="bg-[#faf8f4] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className={`${heading} text-5xl`}>Browse Tuitions</h1>
        <p className="mt-3 text-slate-500">
          Search and filter approved tuitions. Every filter is saved in the page link.
        </p>

        {/* Filters: a plain GET form, so everything lands in the URL */}
        <form
          action="/tuitions"
          method="get"
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-5"
        >
          <label
            htmlFor="searchQuery"
            className="text-sm font-medium text-[#101535]"
          >
            Search by title or subject
          </label>
          <input
            id="searchQuery"
            name="searchQuery"
            defaultValue={filters.searchQuery}
            placeholder="e.g. Physics, IELTS, Python"
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1e2a78]"
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Subject"
              name="subject"
              value={filters.subject}
              options={[
                { value: "", label: "All subjects" },
                ...subjects.map((subject) => ({
                  value: subject,
                  label: subject,
                })),
              ]}
            />
            <Select
              label="Class level"
              name="level"
              value={filters.level}
              options={[
                { value: "", label: "All levels" },
                ...levels.map((level) => ({ value: level, label: level })),
              ]}
            />
            <Select label="Mode" name="mode" value={filters.mode} options={modes} />
            <div className="flex items-end">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e2a78] py-3 font-semibold text-white hover:bg-[#161f5c]"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="mt-8">
          {tuitions === null ? (
            <ErrorState />
          ) : tuitions.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-500">
                {tuitions.length} {tuitions.length === 1 ? "tuition" : "tuitions"} found
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tuitions.map((tuition) => (
                  <TuitionCard key={tuition._id} tuition={tuition} />
                ))}
              </div>
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
    <div>
      <label htmlFor={name} className="text-sm font-medium text-[#101535]">{label}</label>
      <div className="relative mt-1.5">
        <select
          id={name}
          name={name}
          defaultValue={value}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-[#1e2a78]"
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
    </div>
  );
}

function StateCard({
  icon, title, text, children,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6eafc] text-[#1e2a78]">
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
          className="rounded-xl border border-[#1e2a78] px-5 py-2.5 text-sm font-medium text-[#1e2a78] hover:bg-[#1e2a78]/5"
        >
          Clear filters
        </Link>
      )}
    </StateCard>
  );
}

function TuitionCard({ tuition }: { tuition: Tuition }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors hover:border-[#1e2a78]">
      {/* Banner */}
      <div className="relative h-40 bg-[#1e2a78]">
        {tuition.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tuition.bannerUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <BookOpen size={48} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-[#101535]">
          {tuition.subject}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`${heading} line-clamp-2 text-lg leading-snug`}>
          {tuition.title}
        </h3>
        {tuition.mentorName && (
          <p className="mt-1 text-sm text-slate-500">
            by {tuition.mentorName}
          </p>
        )}

        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <Monitor size={15} className="text-[#1e2a78]" />
            <span className="capitalize">{tuition.mode}</span> ·{" "}
            {tuition.classLevel}
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={15} className="text-[#1e2a78]" />
            {tuition.location}
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays size={15} className="text-[#1e2a78]" />
            {tuition.daysPerWeek} days a week
          </li>
        </ul>

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
          <p>
            <span className={`${heading} text-2xl`}>
              ৳{tuition.monthlyFee}
            </span>
            <span className="text-sm text-slate-500"> / month</span>
          </p>
          <Link
            href={`/tuitions/${tuition._id}`}
            className="rounded-lg bg-[#1e2a78] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161f5c]"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}