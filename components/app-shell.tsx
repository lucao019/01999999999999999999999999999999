"use client"

import { MembersSidebar } from "@/components/members-sidebar"
import Link from "next/link"
import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { CodeXml, Library, LogOut, Newspaper, User } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

type AppShellProps = {
  children: ReactNode
  title?: string
  description?: string
}

export function AppShell({ children, title, description }: AppShellProps) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.localStorage.removeItem("monstro:last-email")
    router.push("/login")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background global do app logado */}
      <div className="fixed inset-0 z-0">
        <img
          src="/backgrounds/berserk-skeleton.gif"
          alt="Background animado"
          className="h-full w-full object-cover object-center opacity-35"
        />

        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950/80 to-red-950/40" />
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-red-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-red-900/15 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/timeline" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/40 bg-red-600/20 text-red-500 shadow-lg shadow-red-900/30">
              <CodeXml className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-black leading-none">9999999999999</p>
              <p className="text-xs text-zinc-500">Personal OS</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/timeline">
              <Button variant="ghost" size="sm" className="gap-2">
                <Newspaper className="h-4 w-4" />
                <span className="hidden md:inline">Feed</span>
              </Button>
            </Link>

            <Link href="/dashboard/biblioteca">
              <Button variant="ghost" size="sm" className="gap-2">
                <Library className="h-4 w-4" />
                <span className="hidden md:inline">Biblioteca</span>
              </Button>
            </Link>

            <Link href="/dashboard/perfil">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Perfil</span>
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sair</span>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {(title || description) && (
              <div className="mb-6 rounded-2xl border border-white/10 bg-zinc-950/70 p-5 shadow-2xl backdrop-blur-sm">
                {title && (
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    {title}
                  </h1>
                )}

                {description && (
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
                    {description}
                  </p>
                )}
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {children}
            </div>
          </div>

          <MembersSidebar />
        </div>
      </section>
    </main>
  )
}