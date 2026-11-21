"use client";

import Link from "next/link";
import { Bookmark, Crown, Trash2 } from "lucide-react";
import { api, runAction } from "@/app/lib/api";
import { useApi } from "@/app/lib/use-api";
import { Tuition } from "@/components/type";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge } from "../../ui";

type BookmarkList = {
  bookmarks: Tuition[];
  count: number;
  limit: number | null;
  plan: "free" | "pro";
};

export default function StudentBookmarksPage() {
  const { data, loading, error, reload } =
    useApi<BookmarkList>("/api/student/bookmarks");

  function removeBookmark(tuitionId: string) {
    void runAction(
      () =>
        api(`/api/student/bookmarks/${encodeURIComponent(tuitionId)}`, {
          method: "DELETE",
        }),
      "Bookmark removed.",
      reload,
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved tuitions"
        subtitle="Keep interesting tuitions together and come back when you are ready."
      />

      {data && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e3e5f5] bg-white p-4">
          <p className="text-sm font-medium text-slate-600">
            {data.plan === "pro"
              ? `${data.count} saved · Unlimited bookmarks`
              : `${data.count} of ${data.limit ?? 5} bookmarks used`}
          </p>
          {data.plan === "free" && (
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e2a78] hover:underline"
            >
              <Crown size={16} aria-hidden="true" />
              Get unlimited bookmarks with Pro
            </Link>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={reload}
          >
            Try again
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      ) : error ? null : data?.bookmarks.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.bookmarks.map((tuition) => {
            const isAvailable =
              tuition.status === "active" &&
              tuition.approvalStatus === "approved";
            const displayStatus =
              tuition.approvalStatus === "approved"
                ? tuition.status
                : tuition.approvalStatus;

            return (
              <article
                key={tuition._id}
                className="flex flex-col rounded-2xl border border-[#e3e5f5] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1e2a78]">
                      {tuition.subject} · {tuition.classLevel}
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-lg font-bold text-[#101535]">
                      {tuition.title}
                    </h2>
                  </div>
                  <Bookmark
                    size={20}
                    className="mt-1 shrink-0 text-[#1e2a78]"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  ৳{Number(tuition.monthlyFee).toLocaleString("en-US")} / month
                  <span className="mx-2">·</span>
                  {tuition.location}
                </p>
                <div className="mt-3">
                  <StatusBadge status={displayStatus} />
                </div>

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {isAvailable ? (
                    <Button
                      nativeButton={false}
                      render={<Link href={`/tuitions/${tuition._id}`} />}
                      className="bg-[#1e2a78] text-white hover:bg-[#161f5c]"
                    >
                      View tuition
                    </Button>
                  ) : (
                    <span className="self-center text-sm text-slate-500">
                      No longer available
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeBookmark(tuition._id)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <Bookmark
            size={28}
            className="mx-auto text-[#1e2a78]"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-lg font-bold text-[#101535]">
            No saved tuitions yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Browse tuitions and bookmark the ones you like.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/tuitions" />}
            className="mt-5 bg-[#1e2a78] text-white hover:bg-[#161f5c]"
          >
            Browse tuitions
          </Button>
        </div>
      )}
    </div>
  );
}
