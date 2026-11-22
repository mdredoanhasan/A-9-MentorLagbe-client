"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { useRole } from "@/app/dashboard/use-role";
import { Button } from "@/components/ui/button";

type BookmarkResponse = {
  bookmarks: { _id: string }[];
};

type BookmarkContextValue = {
  ids: Set<string>;
  isLoading: boolean;
  isCheckingSession: boolean;
  isSignedIn: boolean;
  isStudent: boolean;
  toggleBookmark: (tuitionId: string) => Promise<void>;
};

const BookmarkContext = createContext<BookmarkContextValue | null>(null);
const emptyBookmarkIds = new Set<string>();

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { session, role, isPending } = useRole();
  const userId = session?.user?.id;
  const isSignedIn = Boolean(userId);
  const isStudent = isSignedIn && role === "student";
  const [bookmarkState, setBookmarkState] = useState<{
    userId: string;
    ids: Set<string>;
  }>({ userId: "", ids: emptyBookmarkIds });

  useEffect(() => {
    let isCurrent = true;

    if (isPending || !isStudent || !userId) return;

    api<BookmarkResponse>("/api/student/bookmarks")
      .then((result) => {
        if (isCurrent) {
          setBookmarkState({
            userId,
            ids: new Set(result.bookmarks.map(({ _id }) => _id)),
          });
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          toast.error(
            error instanceof Error ? error.message : "Could not load bookmarks.",
          );
          setBookmarkState({ userId, ids: new Set() });
        }
      })

    return () => {
      isCurrent = false;
    };
  }, [isPending, isStudent, userId]);

  const hasCurrentBookmarks = bookmarkState.userId === userId;
  const ids = isStudent && hasCurrentBookmarks ? bookmarkState.ids : emptyBookmarkIds;
  const isLoading = isPending || (isStudent && !hasCurrentBookmarks);

  const toggleBookmark = useCallback(
    async (tuitionId: string) => {
      if (!isStudent || !userId) return;
      const isBookmarked = ids.has(tuitionId);

      try {
        if (isBookmarked) {
          await api(`/api/student/bookmarks/${encodeURIComponent(tuitionId)}`, {
            method: "DELETE",
          });
          setBookmarkState((currentState) => {
            const nextIds = new Set(
              currentState.userId === userId ? currentState.ids : [],
            );
            nextIds.delete(tuitionId);
            return { userId, ids: nextIds };
          });
          toast.success("Tuition removed from bookmarks.");
          return;
        }

        await api(
          `/api/student/bookmarks/${encodeURIComponent(tuitionId)}`,
          {
            method: "POST",
          },
        );
        setBookmarkState((currentState) => ({
          userId,
          ids: new Set(
            currentState.userId === userId ? currentState.ids : [],
          ).add(tuitionId),
        }));
        toast.success("Tuition bookmarked.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not update bookmark.",
        );
      }
    },
    [ids, isStudent, userId],
  );

  const value = useMemo(
    () => ({
      ids,
      isLoading,
      isCheckingSession: isPending,
      isSignedIn,
      isStudent,
      toggleBookmark,
    }),
    [ids, isLoading, isPending, isSignedIn, isStudent, toggleBookmark],
  );

  return (
    <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
  );
}

export function BookmarkButton({
  tuitionId,
  className = "",
}: {
  tuitionId: string;
  className?: string;
}) {
  const context = useContext(BookmarkContext);
  const router = useRouter();
  const pathname = usePathname();
  const [isSaving, setIsSaving] = useState(false);

  if (!context) {
    throw new Error("BookmarkButton must be rendered inside BookmarkProvider.");
  }

  const {
    ids,
    isLoading,
    isCheckingSession,
    isSignedIn,
    isStudent,
    toggleBookmark,
  } = context;
  const isBookmarked = ids.has(tuitionId);

  if (isCheckingSession || (isSignedIn && !isStudent)) return null;

  async function handleClick() {
    if (!isSignedIn) {
      const callbackUrl = `${pathname}${window.location.search}`;
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    if (!isStudent) return;

    setIsSaving(true);
    try {
      await toggleBookmark(tuitionId);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isSaving || (isStudent && isLoading)}
      aria-pressed={isBookmarked}
      aria-label={
        isBookmarked ? "Remove tuition bookmark" : "Bookmark this tuition"
      }
      onClick={handleClick}
      className={`gap-2 border-[#e3e5f5] bg-white text-[#1e2a78] hover:bg-[#e8eafb] ${className}`}
    >
      {isBookmarked ? (
        <BookmarkCheck size={16} aria-hidden="true" />
      ) : (
        <Bookmark size={16} aria-hidden="true" />
      )}
      {isBookmarked ? "Saved" : "Save"}
    </Button>
  );
}
