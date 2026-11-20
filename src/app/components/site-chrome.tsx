"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type SiteChromeProps = {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export default function SiteChrome({
  navbar,
  footer,
  children,
}: SiteChromeProps) {
  return (
    <Suspense fallback={<SiteChromeFallback>{children}</SiteChromeFallback>}>
      <SiteChromeByPath navbar={navbar} footer={footer}>
        {children}
      </SiteChromeByPath>
    </Suspense>
  );
}

function SiteChromeByPath({
  navbar,
  footer,
  children,
}: SiteChromeProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  return (
    <>
      {!isDashboard && navbar}
      {children}
      {!isDashboard && footer}
    </>
  );
}

function SiteChromeFallback({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="h-16 border-b border-gray-200 bg-[#faf8f4]"
      />
      {children}
      <div
        aria-hidden="true"
        className="h-24 border-t border-gray-100 bg-[#faf8f4]"
      />
    </>
  );
}
