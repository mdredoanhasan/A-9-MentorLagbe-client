import {
  Search, Send, UserCheck, GraduationCap,
  UserPlus, FilePlus, ShieldCheck, CircleCheck,
  type LucideIcon,
} from "lucide-react";

type Step = { icon: LucideIcon; title: string; text: string };

const groups: { heading: string; steps: Step[] }[] = [
  {
    heading: "For Students",
    steps: [
      { icon: Search, title: "Browse and filter", text: "Search by subject, class level and mode to shortlist tuitions." },
      { icon: Send, title: "Apply", text: "Share your phone, preferred schedule and what you want to learn." },
      { icon: UserCheck, title: "Tutor decides", text: "The tutor reviews your application and accepts or declines." },
      { icon: GraduationCap, title: "Start learning", text: "Track the status in your dashboard and begin your classes." },
    ],
  },
  {
    heading: "For Tutors",
    steps: [
      { icon: UserPlus, title: "Create your account", text: "Sign up as a tutor and complete your profile." },
      { icon: FilePlus, title: "Post a tuition", text: "Add subject, fee, schedule and a banner for your batch." },
      { icon: ShieldCheck, title: "Get approved", text: "An admin reviews the listing before it goes public." },
      { icon: CircleCheck, title: "Accept students", text: "Review applicants and confirm the ones you want to teach." },
    ],
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-work" className="scroll-mt-24 bg-[#faf8f4] py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-wide text-slate-600">How it works</p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl font-bold text-[#101535]">
            How MentorLagbe Works
          </h2>
          <p className="mt-3 text-slate-500">
            A simple flow for students looking for a tutor and tutors looking for students.
          </p>
        </div>

        {/* Groups */}
        {groups.map((group) => (
          <div key={group.heading} className="mt-16">
            <h3 className="text-center font-[family-name:var(--font-fraunces)] text-2xl font-bold text-[#101535]">
              {group.heading}
            </h3>

            <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {group.steps.map(({ icon: Icon, title, text }, stepIndex) => (
                <div key={title} className="text-center">
                  <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1e2a78] text-white">
                    <Icon size={22} />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-[#101535]">
                      {stepIndex + 1}
                    </span>
                  </div>
                  <h4 className="mt-4 font-[family-name:var(--font-fraunces)] text-lg font-bold text-[#101535]">
                    {title}
                  </h4>
                  <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-slate-500">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}