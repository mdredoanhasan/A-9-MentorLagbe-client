"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
