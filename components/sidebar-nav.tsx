"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calculator,
  Lightbulb,
  History,
  Settings,
  Library,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projetos",
    href: "/dashboard/projetos",
    icon: FolderKanban,
  },
  {
    title: "Biblioteca",
    href: "/dashboard/biblioteca",
    icon: Library,
  },
  {
    title: "Consultoria",
    href: "/dashboard/consultoria",
    icon: Users,
  },
  {
    title: "Calculadora",
    href: "/dashboard/calculadora",
    icon: Calculator,
  },
  {
    title: "Dicas",
    href: "/dashboard/dicas",
    icon: Lightbulb,
  },
  {
    title: "Histórico",
    href: "/dashboard/historico",
    icon: History,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/30 min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/dashboard/configuracoes"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <Settings className="w-5 h-5" />
          Configurações
        </Link>
      </div>
    </aside>
  )
}
