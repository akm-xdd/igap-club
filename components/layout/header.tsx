"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl hover:opacity-70 transition-opacity">
          IGAP.club
        </Link>
        
        <ul className="flex gap-8">
          {navItems.map((item) => {
            // Hide "Home" link when on homepage
            if (item.href === "/" && pathname === "/") return null;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}