"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  Library,
  Calculator,
  Lightbulb,
} from "lucide-react"

const navItems = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Projetos", href: "/dashboard/projetos", icon: FolderKanban },
  { title: "Biblioteca", href: "/dashboard/biblioteca", icon: Library },
  { title: "calculadora", href: "/dashboard/calculadora", icon: Calculator },
  { title: "Dicas", href: "/dashboard/dicas", icon: Lightbulb },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
