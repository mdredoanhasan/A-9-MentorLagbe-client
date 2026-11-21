import Link from "next/link";
import type { ReactNode } from "react";
import {
  Sigma, Atom, FlaskConical, Dna, BookOpen, Code, Globe,
  type LucideIcon,
} from "lucide-react";

const subjects: { name: string; icon: LucideIcon }[] = [
  { name: "Math", icon: Sigma },
  { name: "Physics", icon: Atom },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: Dna },
  { name: "English", icon: BookOpen },
  { name: "Programming", icon: Code },
  { name: "IELTS", icon: Globe },
];

type HomepageStatisticsProps = {
  tutorCount: number | null;
  studentCount: number | null;
  liveTuitions: number | null;
};

export function HomepageStatistics({
  tutorCount,
  studentCount,
  liveTuitions,
}: HomepageStatisticsProps) {
  const statistics = [
    { label: "Tutors", value: tutorCount },
    { label: "Students", value: studentCount },
    { label: "Live tuitions", value: liveTuitions },
  ];

  return (
    <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 rounded-2xl border border-gray-200 bg-white py-8 text-center">
      {statistics.map(({ label, value }) => (
        <div key={label}>
          <p className="font-(family-name:--font-fraunces) text-4xl font-bold text-[#1e2a78]">
            {value ?? "—"}
          </p>
          <p className="mt-1 text-sm text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Subjects({ statistics }: { statistics: ReactNode }) {
  return (
    <section className="bg-[#faf8f4] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-wide text-slate-600">Subjects</p>
          <h2 className="mt-2 font-(family-name:--font-fraunces) text-4xl font-bold text-[#101535]">
            Explore Top Subjects
          </h2>
          <p className="mt-3 text-slate-500">
            Jump straight to the subject you need help with.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {subjects.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              href={`/tuitions?searchQuery=${name}`}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-6 transition-colors hover:border-[#1e2a78]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e6eafc] text-[#1e2a78]">
                <Icon size={22} />
              </span>
              <span className="font-medium text-[#101535]">{name}</span>
            </Link>
          ))}
        </div>
        {statistics}
      </div>
    </section>
  );
}