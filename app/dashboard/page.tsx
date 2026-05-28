"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Archive,
  ArrowRight,
  BookOpen,
  Brain,
  Building2,
  Clock,
  Dumbbell,
  FolderOpen,
  Library,
  Sparkles,
  Target,
  User,
  Users,
  Video,
  Wrench,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { monstroFolders, monstroPages } from "@/lib/data/monstro-pages"

const folderIcons: Record<string, any> = {
  "biohacker-engine": Dumbbell,
  "oficina-tech": Wrench,
  Consultoria: Users,
  conteudo: Video,
  empresa: Building2,
  "mente-sistema": Brain,
  "monstro-site": FolderOpen,
  biblioteca: BookOpen,
  arquivo: Archive,
}

const statusLabels: Record<string, string> = {
  importado: "Importado",
  bruto: "Bruto",
  filtrado: "Filtrado",
  "ideia-limpa": "Ideia limpa",
  pronto: "Pronto",
  publicado: "Publicado",
}

function getProgressByStatus(status: string) {
  if (status === "publicado") return 100
  if (status === "pronto") return 85
  if (status === "ideia-limpa") return 65
  if (status === "filtrado") return 45
  if (status === "importado") return 25
  return 15
}

export default function DashboardPage() {
  const [role, setRole] = useState<string>("basic")
  const [displayName, setDisplayName] = useState<string>("Usuário")
  const [isLoadingRole, setIsLoadingRole] = useState(true)

  useEffect(() => {
    async function loadUserRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/"
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("user_id", user.id)
        .maybeSingle()

      setDisplayName(data?.display_name || user.email || "Usuário")
      setRole(data?.role || "basic")
      setIsLoadingRole(false)
    }

    loadUserRole()
  }, [])

  const isAdmin = role === "admin"

  const totalPages = monstroPages.length
  const totalFolders = monstroFolders.length

  const importedPages = monstroPages.filter(
    (page) => page.status === "importado"
  ).length

  const readyPages = monstroPages.filter((page) =>
    ["ideia-limpa", "pronto", "publicado"].includes(page.status)
  ).length

  const nextMission = useMemo(() => {
    return (
      monstroPages.find((page) => page.status === "importado") ||
      monstroPages[0]
    )
  }, [])

  const latestPages = useMemo(() => {
    return [...monstroPages]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
  }, [])

  const topFolders = useMemo(() => {
    return [...monstroFolders].sort((a, b) => b.total - a.total).slice(0, 4)
  }, [])

  if (isLoadingRole) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 text-sm text-zinc-400">
          Carregando permissões...
        </div>
      </AppShell>
    )
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/80 p-5 shadow-2xl sm:p-6">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />

            <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="space-y-4">
                <Badge className="border-red-500/30 bg-red-500/20 text-red-400">
                  Conta básica
                </Badge>

                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Bem-vindo, {displayName}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                    Sua conta foi criada com sucesso. Você pode acessar seu
                    perfil e a área pública de projetos. A biblioteca continua
                    privada para usuários admin.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/perfil">
                  <Button className="gap-2 bg-red-600 hover:bg-red-700">
                    <User className="h-4 w-4" />
                    Editar meu perfil
                  </Button>
                </Link>

                <Link href="/dashboard/projetos">
                  <Button variant="outline" className="gap-2">
                    <Target className="h-4 w-4" />
                    Ver projetos públicos
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/dashboard/perfil">
              <Card className="h-full border-white/10 bg-zinc-950/80 text-white shadow-2xl transition-colors hover:border-red-500/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-red-500" />
                    Perfil
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-zinc-400">
                    Você pode editar nome, foto, cidade e dados básicos.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-white/10 bg-zinc-950/50 text-white opacity-60 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Library className="h-5 w-5 text-red-500" />
                  Biblioteca
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-zinc-400">
                  Acesso privado para admin.
                </p>
              </CardContent>
            </Card>

            <Link href="/dashboard/projetos">
              <Card className="h-full border-white/10 bg-zinc-950/80 text-white shadow-2xl transition-colors hover:border-red-500/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-500" />
                    Projetos
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-zinc-400">
                    Acesse os projetos públicos e acompanhe as ideias abertas da
                    plataforma.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/80 p-5 shadow-2xl sm:p-6">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-8 h-72 w-72 rounded-full bg-red-900/15 blur-3xl" />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
                <Sparkles className="h-4 w-4" />
                Cockpit Admin
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Painel de Controle
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                  Visão geral do seu sistema: pesquisas importadas, missões,
                  pastas, conteúdo e próximas ações.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/projetos">
                <Button className="gap-2 bg-red-600 hover:bg-red-700">
                  <Target className="h-4 w-4" />
                  Abrir Projetos
                </Button>
              </Link>

              <Link href="/dashboard/biblioteca">
                <Button variant="outline" className="gap-2">
                  <Library className="h-4 w-4" />
                  Abrir Biblioteca
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <BookOpen className="h-6 w-6" />
              </div>

              <div>
                <p className="text-2xl font-black">{totalPages}</p>
                <p className="text-sm text-zinc-400">Pesquisas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FolderOpen className="h-6 w-6" />
              </div>

              <div>
                <p className="text-2xl font-black">{totalFolders}</p>
                <p className="text-sm text-zinc-400">Pastas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-300">
                <Archive className="h-6 w-6" />
              </div>

              <div>
                <p className="text-2xl font-black">{importedPages}</p>
                <p className="text-sm text-zinc-400">Importadas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <Sparkles className="h-6 w-6" />
              </div>

              <div>
                <p className="text-2xl font-black">{readyPages}</p>
                <p className="text-sm text-zinc-400">Mais limpas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {nextMission && (
          <Card className="border-red-500/20 bg-red-950/10 text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Target className="h-5 w-5" />
                Próxima missão recomendada
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{nextMission.folderLabel}</Badge>
                    <Badge variant="secondary">{nextMission.type}</Badge>
                    <Badge className="bg-zinc-800 text-zinc-300">
                      {statusLabels[nextMission.status] || nextMission.status}
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-xl font-black">
                      {nextMission.title}
                    </h2>
                    <p className="mt-1 max-w-3xl text-sm text-zinc-400 line-clamp-2">
                      {nextMission.context}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden min-w-[130px] space-y-2 sm:block">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Progresso</span>
                      <span>{getProgressByStatus(nextMission.status)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                      <div
                        className="h-full rounded-full bg-red-600"
                        style={{
                          width: `${getProgressByStatus(nextMission.status)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Link href={`/dashboard/projetos/${nextMission.id}`}>
                    <Button className="gap-2 bg-red-600 hover:bg-red-700">
                      Abrir missão
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                Últimas pesquisas
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {latestPages.map((page) => {
                const Icon = folderIcons[page.folder] || FolderOpen

                return (
                  <Link
                    key={page.id}
                    href={`/dashboard/projetos/${page.id}`}
                    className="block"
                  >
                    <div className="flex gap-4 rounded-xl border border-white/10 bg-black/30 p-4 transition-colors hover:border-red-500/40 hover:bg-black/50">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold">{page.title}</h3>
                        <p className="mt-1 line-clamp-1 text-sm text-zinc-400">
                          {page.context}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="outline">{page.folderLabel}</Badge>
                          <Badge variant="secondary">{page.type}</Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-red-500" />
                Pastas mais cheias
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {topFolders.map((folder) => {
                const Icon = folderIcons[folder.id] || FolderOpen
                const percent =
                  totalPages > 0
                    ? Math.round((folder.total / totalPages) * 100)
                    : 0

                return (
                  <Link
                    key={folder.id}
                    href={`/dashboard/projetos`}
                    className="block"
                  >
                    <div className="rounded-xl border border-white/10 bg-black/30 p-4 transition-colors hover:border-red-500/40 hover:bg-black/50">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-bold">{folder.label}</p>
                            <p className="text-xs text-zinc-400">
                              {folder.total} pesquisas
                            </p>
                          </div>
                        </div>

                        <Badge variant="secondary">{percent}%</Badge>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                        <div
                          className="h-full rounded-full bg-red-600"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}