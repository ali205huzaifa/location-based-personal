"use client";

import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import Topbar from "./Topbar";

function getTitleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return "Dashboard";

  const isDynamic =
    segments.length > 1 && /^\d+$/.test(segments[segments.length - 1]);

  const base = isDynamic
    ? segments[segments.length - 2]
    : segments[segments.length - 1];
  if (pathname.includes("/jobs/create")) return "Create Job";
  if (pathname.includes("/jobs/") && isDynamic) return "Jobs";

  return base.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const pageTitle = useMemo(
    () => getTitleFromPath(location.pathname),
    [location.pathname]
  );

  return (
    <div className="flex flex-col h-full">
      <Topbar title={pageTitle} />
      <main className="flex-grow overflow-y-auto p-4">{children}</main>
    </div>
  );
}
