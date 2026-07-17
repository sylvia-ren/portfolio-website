"use client";

import { usePathname } from "next/navigation";

/*
 * the page dissolve must remount on every client navigation — otherwise the
 * css entrance never replays and the room appears instantly. pathname as key
 * forces a fresh instance, like turning a new catalogue page.
 */
export function PageDissolve({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-dissolve flex flex-1 flex-col">
      {children}
    </div>
  );
}
