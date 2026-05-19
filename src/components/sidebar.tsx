import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import type { Profile } from "@/types/content";

const nav = [
  { group: "Content", items: [
    { href: "/", label: "Overview", icon: "◢" },
    { href: "/hero", label: "Hero", icon: "★" },
    { href: "/amenities", label: "Amenities", icon: "▣" },
    { href: "/rooms", label: "Rooms", icon: "◉" },
    { href: "/testimonials", label: "Testimonials", icon: "☆" },
    { href: "/contact", label: "Contact & Footer", icon: "✉" },
  ]},
  { group: "Media", items: [
    { href: "/media", label: "Media Library", icon: "🖼" },
  ]},
  { group: "System", items: [
    { href: "/settings", label: "Settings", icon: "⚙" },
  ]},
];

export function Sidebar({ profile }: { profile: Profile | null }) {
  return (
    <aside className="hidden md:flex md:w-72 md:shrink-0 md:flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--color-brand)] font-display text-lg text-[var(--color-brand-foreground)]">
            H
          </span>
          <div>
            <div className="font-display text-lg leading-tight">A-Wise CMS</div>
            <div className="text-xs text-[var(--color-text-soft)]">Hotel A-Wise</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {nav.map((section) => (
          <div key={section.group}>
            <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-text-soft)]">
              {section.group}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
                  >
                    <span className="w-5 text-center text-[var(--color-text-soft)]">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-surface-2)] text-sm font-medium">
            {(profile?.full_name || profile?.email || "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium">{profile?.full_name || "Admin"}</div>
            <div className="truncate text-xs text-[var(--color-text-soft)]">{profile?.email}</div>
          </div>
          <form action={signOut}>
            <button
              aria-label="Sign out"
              className="text-[var(--color-text-soft)] hover:text-[var(--color-text)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
                <path d="m16 17 5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12H9" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
