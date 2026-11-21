import { Suspense } from "react";
import Hero from "./components/hero";
import HowItWorks from "./components/how-it-work";
import HomeStats from "./components/home-stats";
import LatestTuitions from "./components/latest-tuitions";
import PricingFaq from "./components/PricingFaq";
import PricingPage from "./components/pro-plan";
import Subjects from "./components/subjects";

export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <Suspense
        fallback={
          <section className="bg-white py-16">
            <div className="mx-auto max-w-6xl px-6">
              <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-100" />
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-72 animate-pulse rounded-2xl border border-gray-100 bg-slate-50"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <LatestTuitions />
      </Suspense>
      <Subjects
        statistics={
          <Suspense fallback={<HomeStatsFallback />}>
            <HomeStats />
          </Suspense>
        }
      />
      <HowItWorks />
      <PricingPage />
      <PricingFaq/>
    </div>
  );
}

function HomeStatsFallback() {
  return (
    <div
      aria-label="Loading homepage statistics"
      className="mx-auto mt-12 grid max-w-3xl grid-cols-3 rounded-2xl border border-gray-200 bg-white py-8 text-center"
    >
      {["Tutors", "Students", "Live tuitions"].map((label) => (
        <div key={label}>
          <p className="font-(family-name:--font-fraunces) text-4xl font-bold text-[#1e2a78]">
            —
          </p>
          <p className="mt-1 text-sm text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
