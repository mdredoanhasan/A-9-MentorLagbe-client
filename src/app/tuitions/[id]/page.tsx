"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  MapPin,
  Monitor,
  Send,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { useRole } from "@/app/dashboard/use-role";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tuition } from "@/components/type";

type ApplicationForm = {
  phone: string;
  schedule: string;
  note: string;
};

const emptyApplicationForm: ApplicationForm = {
  phone: "",
  schedule: "",
  note: "",
};

export default function TuitionDetailsPage() {
  const { id: tuitionId } = useParams<{ id: string }>();
  const { session, role, isPending: isCheckingSession } = useRole();
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationForm, setApplicationForm] = useState(emptyApplicationForm);

  useEffect(() => {
    let isCurrentRequest = true;
    setTuition(null);
    setIsLoading(true);
    setLoadError("");

    api<Tuition>(`/api/tuitions/${encodeURIComponent(tuitionId)}`)
      .then((tuitionDetails) => {
        if (isCurrentRequest) setTuition(tuitionDetails);
      })
      .catch((requestError: unknown) => {
        if (isCurrentRequest) {
          setLoadError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load this tuition.",
          );
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [tuitionId, reloadCount]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.user || role !== "student") {
      toast.error("Only student accounts can apply.");
      return;
    }
    if (!tuition) return;

    setIsSubmitting(true);
    try {
      await api("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          tuitionId: tuition._id,
          phone: applicationForm.phone.trim(),
          schedule: applicationForm.schedule.trim(),
          note: applicationForm.note.trim(),
        }),
      });
      setHasApplied(true);
      setIsApplyDialogOpen(false);
      setApplicationForm(emptyApplicationForm);
      toast.success("Your application has been sent to the mentor.");
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Could not submit your application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <TuitionDetailsSkeleton />;

  if (!tuition) {
    return (
      <main className="min-h-[65vh] bg-[#faf8f4] px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#e3e5f5] bg-white p-8 text-center shadow-sm">
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#101535]">
            Tuition not available
          </h1>
          <p className="mt-3 text-slate-500">
            {loadError || "This tuition may have been removed or is no longer active."}
          </p>
          {loadError && (
            <Button
              type="button"
              variant="outline"
              className="mt-5 border-[#1e2a78] text-[#1e2a78]"
              onClick={() => setReloadCount((currentCount) => currentCount + 1)}
            >
              Try again
            </Button>
          )}
          <div>
            <Button
              asChild
              className="mt-5 bg-[#1e2a78] text-white hover:bg-[#161f5c]"
            >
              <Link href="/tuitions">Browse tuitions</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const isOnline = tuition.mode.toLowerCase() === "online";
  const monthlyFee = Number(tuition.monthlyFee);

  return (
    <main className="min-h-screen bg-[#faf8f4] px-6 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e2a78] transition-colors hover:text-[#161f5c]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to tuitions
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <article className="overflow-hidden rounded-3xl border border-[#e3e5f5] bg-white shadow-sm">
            <div className="relative h-56 overflow-hidden bg-[#1e2a78] sm:h-72">
              {tuition.bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tuition.bannerUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1e2a78] to-[#3b4aa8]">
                  <BookOpen size={72} className="text-white/40" aria-hidden="true" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101535]/80 via-[#101535]/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                <span className="inline-flex rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#1e2a78]">
                  {tuition.subject}
                </span>
                <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-fraunces)] text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {tuition.title}
                </h1>
              </div>
            </div>

            <div className="space-y-8 p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#e8eafb] px-3 py-1.5 text-sm font-medium text-[#1e2a78]">
                  {tuition.classLevel}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                  {tuition.status === "active" ? "Open for applications" : "Closed"}
                </span>
              </div>

              <section aria-labelledby="tuition-details-heading">
                <h2
                  id="tuition-details-heading"
                  className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#101535]"
                >
                  Tuition details
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <DetailFact
                    icon={BookOpen}
                    label="Subject and level"
                    value={`${tuition.subject} · ${tuition.classLevel}`}
                  />
                  <DetailFact
                    icon={Monitor}
                    label="Learning mode"
                    value={isOnline ? "Online" : "Offline"}
                  />
                  <DetailFact
                    icon={MapPin}
                    label="Location"
                    value={tuition.location}
                  />
                  <DetailFact
                    icon={CalendarDays}
                    label="Weekly schedule"
                    value={`${tuition.daysPerWeek} days per week`}
                  />
                </div>
              </section>

              <section aria-labelledby="description-heading">
                <h2
                  id="description-heading"
                  className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#101535]"
                >
                  About this tuition
                </h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                  {tuition.description}
                </p>
              </section>
            </div>
          </article>

          <aside className="lg:sticky lg:top-24">
            <div className="space-y-5 rounded-3xl border border-[#e3e5f5] bg-white p-6 shadow-sm sm:p-7">
              <div>
                <p className="text-sm font-medium text-slate-500">Monthly fee</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#1e2a78]">
                    ৳{Number.isFinite(monthlyFee) ? monthlyFee.toLocaleString("en-US") : tuition.monthlyFee}
                  </span>
                  <span className="text-sm text-slate-500">/ month</span>
                </p>
              </div>

              <div className="border-t border-[#e3e5f5] pt-5">
                <p className="text-sm font-medium text-slate-500">Posted by</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-[#e8eafb] text-[#1e2a78]">
                    <UserRound size={20} aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-[#101535]">
                    {tuition.mentorName || "Mentor"}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#e3e5f5] pt-5">
                {isCheckingSession ? (
                  <Button
                    type="button"
                    disabled
                    className="h-11 w-full bg-[#1e2a78] text-white"
                  >
                    Checking account...
                  </Button>
                ) : session?.user && role === "student" ? (
                  hasApplied ? (
                    <div className="space-y-3">
                      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">
                        Your application has been sent.
                      </p>
                      <Link
                        href="/dashboard/student/my-applications"
                        className="block text-center text-sm font-semibold text-[#1e2a78] hover:underline"
                      >
                        View my applications
                      </Link>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      className="h-11 w-full bg-[#1e2a78] text-white hover:bg-[#161f5c]"
                      onClick={() => setIsApplyDialogOpen(true)}
                    >
                      Apply now
                    </Button>
                  )
                ) : session?.user ? (
                  <p className="rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800">
                    Only student accounts can apply.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-slate-600">
                      Sign in with a student account to apply.
                    </p>
                    <Button
                      asChild
                      className="h-11 w-full bg-[#1e2a78] text-white hover:bg-[#161f5c]"
                    >
                      <Link href="/sign-in">Sign in to apply</Link>
                    </Button>
                    <p className="text-center text-xs text-slate-500">
                      New to MentorLagbe?{" "}
                      <Link
                        href="/sign-up"
                        className="font-semibold text-[#1e2a78] hover:underline"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#101535]">
              Apply for this tuition
            </DialogTitle>
            <DialogDescription>
              Share your contact details and preferred schedule with the mentor.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={submitApplication}>
            <div className="space-y-2">
              <Label htmlFor="application-phone">Phone number</Label>
              <Input
                id="application-phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
                required
                value={applicationForm.phone}
                onChange={(event) =>
                  setApplicationForm((previousForm) => ({
                    ...previousForm,
                    phone: event.target.value,
                  }))
                }
                placeholder="Your contact number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="application-schedule">Preferred schedule</Label>
              <Input
                id="application-schedule"
                maxLength={300}
                required
                value={applicationForm.schedule}
                onChange={(event) =>
                  setApplicationForm((previousForm) => ({
                    ...previousForm,
                    schedule: event.target.value,
                  }))
                }
                placeholder="For example, weekday evenings"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="application-note">Message for the mentor</Label>
              <Textarea
                id="application-note"
                rows={4}
                maxLength={2000}
                value={applicationForm.note}
                onChange={(event) =>
                  setApplicationForm((previousForm) => ({
                    ...previousForm,
                    note: event.target.value,
                  }))
                }
                placeholder="Tell the mentor a little about your learning goals (optional)"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-[#1e2a78] text-white hover:bg-[#161f5c]"
            >
              <Send size={16} aria-hidden="true" />
              {isSubmitting ? "Sending application..." : "Send application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function DetailFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#faf8f4] p-4">
      <span className="mt-0.5 text-[#1e2a78]">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-[#101535]">
          {value}
        </p>
      </div>
    </div>
  );
}

function TuitionDetailsSkeleton() {
  return (
    <main
      className="min-h-screen bg-[#faf8f4] px-6 py-8 sm:py-12"
      aria-label="Loading tuition details"
    >
      <div className="mx-auto max-w-6xl">
        <div className="h-5 w-36 animate-pulse rounded bg-[#e3e5f5]" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-[620px] animate-pulse rounded-3xl border border-[#e3e5f5] bg-white" />
          <div className="h-72 animate-pulse rounded-3xl border border-[#e3e5f5] bg-white" />
        </div>
      </div>
    </main>
  );
}
