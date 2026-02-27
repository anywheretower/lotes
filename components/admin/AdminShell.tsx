"use client";

import { useRouter, usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Lotes" },
  { href: "/admin/equipamiento", label: "Equipamiento" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-sm font-semibold text-neutral-900">Admin Lotes</h1>
            <nav className="flex gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Ver sitio
            </a>
            <button
              onClick={handleLogout}
              className="text-xs text-neutral-400 hover:text-red-600 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
