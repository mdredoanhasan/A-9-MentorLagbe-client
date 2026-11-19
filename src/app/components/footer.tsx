import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaXTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";
import FooterAccount from "./footer-account";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

const socials = [
  { label: "X", href: "#", icon: FaXTwitter },
  { label: "Facebook", href: "#", icon: FaFacebookF },
  { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
];

const heading =
  "font-[family-name:var(--font-fraunces)] text-lg font-bold text-[#101535]";
const linkStyle = "text-slate-500 hover:text-[#1e2a78]";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-[family-name:var(--font-fraunces)] text-2xl font-bold"
          >
            <span className="text-[#1e2a78]">Mentor</span>
            <span className="text-amber-500">Lagbe</span>
          </Link>
          <p className="mt-2 max-w-[17rem] text-slate-500">
            Find the right mentor or the right student, with approvals and plans
            you can trust.
          </p>
          <div className="mt-4 flex gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#101535] hover:border-[#1e2a78]"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className={heading}>Quick links</h3>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={linkStyle}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className={heading}>Account</h3>
          <FooterAccount />
        </div>

        {/* Contact */}
        <div>
          <h3 className={heading}>Contact</h3>
          <ul className="mt-4 space-y-3 text-slate-500">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-[#1e2a78]" />
              <a href="mailto:redoanhasan02@gmail.com" className="hover:text-[#1e2a78]">
                redoanhasan02@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-[#1e2a78]" />
              <a href="tel:+8801714701219" className="hover:text-[#1e2a78]">
                +8801714701219
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-[#1e2a78]" />
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-5 text-center text-sm text-slate-500">
        © 2026 MentorLagbe. All rights reserved.
      </div>
    </footer>
  );
}