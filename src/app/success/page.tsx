import { Suspense } from "react";
import CheckoutSuccess from "./success-content";

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  return (
    <Suspense fallback={<SuccessLoading />}>
      {searchParams.then(({ session_id }) => (
        <CheckoutSuccess
          sessionId={Array.isArray(session_id) ? session_id[0] : session_id}
        />
      ))}
    </Suspense>
  );
}

function SuccessLoading() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#faf8f4] px-6 py-16">
      <div className="w-full max-w-lg animate-pulse rounded-3xl border border-[#e3e5f5] bg-white p-8">
        <div className="mx-auto size-14 rounded-full bg-[#e8eafb]" />
        <div className="mx-auto mt-5 h-8 w-64 rounded bg-[#e8eafb]" />
        <div className="mx-auto mt-3 h-4 w-80 max-w-full rounded bg-slate-100" />
      </div>
    </main>
  );
}
