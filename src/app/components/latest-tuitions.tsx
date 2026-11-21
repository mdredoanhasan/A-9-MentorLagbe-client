import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Tuition } from "@/components/type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function getLatestTuitions(): Promise<Tuition[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tuitions?page=1&limit=6`,
      { cache: "no-store" },
    );
    if (!response.ok) return [];
    const data = (await response.json()) as { tuitions?: Tuition[] };
    return Array.isArray(data.tuitions) ? data.tuitions.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export default async function LatestTuitions() {
  const tuitions = await getLatestTuitions();

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#1e2a78]">
              Latest listings
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#101535] sm:text-4xl">
              Latest Approved Tuitions
            </h2>
          </div>
          <Link
            href="/tuitions"
            className="rounded-xl border border-[#1e2a78] px-5 py-2.5 text-sm font-semibold text-[#1e2a78] hover:bg-[#1e2a78]/5"
          >
            View all tuitions
          </Link>
        </div>

        {tuitions.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => {
              const tutorName = tuition.tutorName?.trim();
              const fee = Number(tuition.monthlyFee);

              return (
                <article
                  key={tuition._id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3e5f5] bg-white shadow-sm"
                >
                  <div className="relative h-40 overflow-hidden bg-[#1e2a78]">
                    {tuition.bannerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tuition.bannerUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl font-bold text-white/20">
                        {tuition.subject.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#1e2a78]">
                      {tuition.mode === "in-person" ? "Offline" : tuition.mode}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm font-semibold text-[#1e2a78]">
                      {tuition.subject} · {tuition.classLevel}
                    </p>
                    <h3 className="mt-2 line-clamp-2 min-h-12 font-[family-name:var(--font-fraunces)] text-xl font-bold text-[#101535]">
                      {tuition.title}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-slate-500">
                      <p className="flex items-center gap-2">
                        <MapPin size={15} aria-hidden="true" />
                        <span className="truncate">{tuition.location}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays size={15} aria-hidden="true" />
                        {tuition.daysPerWeek} days per week
                      </p>
                    </div>

                    {tutorName && (
                      <p className="mt-4 text-sm text-slate-500">
                        Tutor: <span className="font-medium text-[#101535]">{tutorName}</span>
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <p className="text-xl font-bold text-[#1e2a78]">
                        ৳{Number.isFinite(fee) ? fee.toLocaleString("en-US") : tuition.monthlyFee}
                        <span className="text-xs font-normal text-slate-500"> /month</span>
                      </p>
                      <Link
                        href={`/tuitions/${tuition._id}`}
                        className="rounded-full bg-[#1e2a78] px-4 py-2 text-sm font-semibold text-white hover:bg-[#161f5c]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-gray-200 bg-[#faf8f4] px-5 py-8 text-center text-slate-500">
            No approved tuitions are available right now.
          </p>
        )}
      </div>
    </section>
  );
}
