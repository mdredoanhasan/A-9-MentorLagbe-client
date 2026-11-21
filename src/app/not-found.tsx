import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#faf8f4] px-6 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-[#e3e5f5] bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-50 text-2xl font-bold text-amber-700">
          404
        </span>
        <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#101535]">
          Page not found
        </h1>
        <p className="mt-3 text-slate-600">
          The page you are looking for does not exist or may have moved.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            className="bg-[#1e2a78] text-white hover:bg-[#161f5c]"
          >
            Back to home
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/tuitions" />}
            variant="outline"
          >
            Browse tuitions
          </Button>
        </div>
      </section>
    </main>
  );
}
