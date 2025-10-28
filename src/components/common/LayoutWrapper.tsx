"use client";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow overflow-y-auto">{children}</main>
    </div>
  );
}
