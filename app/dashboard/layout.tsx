import Link from "next/link";

import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#090909]/90 px-6 backdrop-blur-xl lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
                NAYRBEATS
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Producer Control Center
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden rounded-full bg-blue-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-blue-500 sm:inline-flex"
              >
                + Upload Beat
              </Link>

              <Link
                href="/"
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:border-blue-500 hover:bg-blue-600/10"
              >
                View Store
              </Link>
            </div>
          </header>

          <div className="min-h-[calc(100vh-5rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}