"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Archive,
  BookOpen,
  Brain,
  Calendar,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  FolderOpen,
  Search,
  Sparkles,
  Wrench,
  Users,
  Video,
  Building2,
  FileText,
  Library,
  Target,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

const statusStyles: Record<string, string> = {
  importado: "bg-zinc-800 text-zinc-300 border-zinc-600",
  bruto: "bg-zinc-800 text-zinc-300 border-zinc-600",
  filtrado: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "ideia-limpa": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pronto: "bg-green-500/20 text-green-400 border-green-500/30",
  publicado: "bg-red-500/20 text-red-400 border-red-500/30",
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    importado: "Importado",
    bruto: "Bruto",
    filtrado: "Filtrado",
    "ideia-limpa": "Ideia limpa",
    pronto: "Pronto",
    publicado: "Publicado",
  }

  return labels[status] || status
}

export default function BibliotecaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterFolder, setFilterFolder] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const totalPages = monstroPages.length
  const totalFolders = monstroFolders.length

  const importedPages = monstroPages.filter(
    (page) => page.status === "importado"
  ).length

  const readyPages = monstroPages.filter((page) =>
    ["pronto", "publicado", "ideia-limpa"].includes(page.status)
  ).length

  const filteredPages = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return monstroPages.filter((page) => {
      const searchableText = [
        page.title,
        page.folderLabel,
        page.source,
        page.type,
        page.status,
        page.problem,
        page.context,
        page.content,
        page.practical,
        page.connections?.join(" "),
      ]
        .join(" ")
        .toLowerCase()

      const matchesSearch = !query || searchableText.includes(query)
      const matchesFolder =
        filterFolder === "all" || page.folder === filterFolder
      const matchesStatus =
        filterStatus === "all" || page.status === filterStatus

      return matchesSearch && matchesFolder && matchesStatus
    })
  }, [searchQuery, filterFolder, filterStatus])

  function toggleCardExpand(id: string) {
    const nextExpanded = new Set(expandedCards)

    if (nextExpanded.has(id)) {
      nextExpanded.delete(id)
    } else {
      nextExpanded.add(id)
    }

    setExpandedCards(nextExpanded)
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
                <Library className="h-4 w-4" />
                Arsenal de Conhecimento
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Biblioteca
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                  Suas conversas importadas virando páginas, pesquisas, missões
                  e conteúdo dentro do seu sistema.
                </p>
              </div>
            </div>

            <Link href="/dashboard/projetos">
              <Button className="gap-2 bg-red-600 hover:bg-red-700">
                <Target className="h-4 w-4" />
                Ver como Projetos
              </Button>
            </Link>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <p className="text-2xl font-black">{totalPages}</p>
                <p className="text-sm text-zinc-400">Páginas</p>
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

        <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-red-500" />
              Pastas detectadas
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {monstroFolders.map((folder) => {
                const Icon = folderIcons[folder.id] || FolderOpen
                const active = filterFolder === folder.id

                return (
                  <button
                    key={folder.id}
                    onClick={() => setFilterFolder(active ? "all" : folder.id)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      active
                        ? "border-red-500/60 bg-red-500/10"
                        : "border-white/10 bg-black/30 hover:border-red-500/30 hover:bg-black/50"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                        <Icon className="h-5 w-5" />
                      </div>

                      <Badge variant="secondary">{folder.total}</Badge>
                    </div>

                    <p className="font-bold">{folder.label}</p>
                    <p className="text-xs text-zinc-400">
                      {folder.total} pesquisas nessa pasta
                    </p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                <Input
                  placeholder="Pesquisar: testosterona, robocopy, fastboot, MEI..."
                  className="border-white/10 bg-black/30 pl-10 text-white placeholder:text-zinc-500"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>

              <Select value={filterFolder} onValueChange={setFilterFolder}>
                <SelectTrigger className="w-full border-white/10 bg-black/30 text-white lg:w-[240px]">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Pasta" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todas pastas</SelectItem>
                  {monstroFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.label} ({folder.total})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full border-white/10 bg-black/30 text-white lg:w-[190px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todos status</SelectItem>
                  <SelectItem value="importado">Importado</SelectItem>
                  <SelectItem value="bruto">Bruto</SelectItem>
                  <SelectItem value="filtrado">Filtrado</SelectItem>
                  <SelectItem value="ideia-limpa">Ideia limpa</SelectItem>
                  <SelectItem value="pronto">Pronto</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <span>{filteredPages.length} resultados encontrados</span>
          <span className="text-white/10">|</span>
          <span>{monstroPages.length} páginas no total</span>
        </div>

        <div className="grid gap-4">
          {filteredPages.length === 0 ? (
            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardContent className="py-12 text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-zinc-500" />
                <h3 className="mb-2 text-lg font-semibold">Nada encontrado</h3>
                <p className="text-zinc-400">
                  Tente outra palavra ou remova os filtros.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPages.map((page) => {
              const Icon = folderIcons[page.folder] || FolderOpen
              const statusClass =
                statusStyles[page.status] ||
                "bg-zinc-800 text-zinc-300 border-zinc-600"
              const expanded = expandedCards.has(page.id)

              return (
                <Card
                  key={page.id}
                  className="group overflow-hidden border-white/10 bg-zinc-950/80 text-white shadow-2xl transition-colors hover:border-red-500/40"
                >
                  <CardContent className="p-0">
                    <div className="grid gap-0 lg:grid-cols-[72px_1fr]">
                      <div className="flex items-start justify-center bg-red-950/20 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>

                      <div className="space-y-4 p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 space-y-2">
                            <h2 className="text-lg font-black leading-tight transition-colors group-hover:text-red-400">
                              {page.title}
                            </h2>

                            <p className="line-clamp-2 text-sm text-zinc-400">
                              {page.context}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">{page.folderLabel}</Badge>
                              <Badge variant="secondary">{page.type}</Badge>
                              <Badge className={statusClass}>
                                {getStatusLabel(page.status)}
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(page.createdAt).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </Badge>
                            </div>
                          </div>

                          <Link href={`/dashboard/projetos/${page.id}`}>
                            <Button className="gap-2 bg-red-600 hover:bg-red-700">
                              <Target className="h-4 w-4" />
                              Abrir missão
                            </Button>
                          </Link>
                        </div>

                        {page.problem && (
                          <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                            <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
                              Pergunta original
                            </p>
                            <p className="line-clamp-2 text-sm text-zinc-300">
                              {page.problem}
                            </p>
                          </div>
                        )}

                        <div
                          className={`text-sm text-zinc-400 ${
                            expanded ? "" : "line-clamp-3"
                          }`}
                        >
                          <pre className="whitespace-pre-wrap font-sans">
                            {page.content}
                          </pre>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-zinc-400 hover:text-white"
                            onClick={() => toggleCardExpand(page.id)}
                          >
                            {expanded ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Recolher
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Expandir
                              </>
                            )}
                          </Button>

                          <p className="hidden text-xs text-zinc-500 sm:block">
                            Fonte: {page.source}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </AppShell>
  )
}