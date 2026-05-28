"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Archive,
  BookOpen,
  Brain,
  Building2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  FolderOpen,
  GraduationCap,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  Users,
  Video,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

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

const folderLabels: Record<string, string> = Object.fromEntries(
  monstroFolders.map((folder) => [folder.id, folder.label])
)

function getDicaCategory(folder: string) {
  const labels: Record<string, string> = {
    "biohacker-engine": "Corpo",
    "oficina-tech": "Tech",
    Consultoria: "Consultoria",
    conteudo: "Conteúdo",
    empresa: "Empresa",
    "mente-sistema": "Mente",
    "monstro-site": "Sistema",
    biblioteca: "Biblioteca",
    arquivo: "Arquivo",
  }

  return labels[folder] || folderLabels[folder] || "Geral"
}

function makeShortText(text: string, limit = 220) {
  if (!text) return "Sem informação extraída."
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

function getSolucaoPratica(page: any) {
  if (page.practical) return page.practical

  if (page.folder === "oficina-tech") {
    return "Transformar essa conversa em tutorial técnico passo a passo."
  }

  if (page.folder === "biohacker-engine") {
    return "Transformar essa pesquisa em explicação prática com causa, mecanismo e aplicação."
  }

  if (page.folder === "conteudo") {
    return "Transformar essa ideia em roteiro, post ou vídeo."
  }

  if (page.folder === "mente-sistema") {
    return "Transformar esse raciocínio em regra prática de comportamento."
  }

  return "Abrir a missão e organizar essa pesquisa em conteúdo limpo."
}

export default function DicasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null)
  const [expandedDica, setExpandedDica] = useState<string | null>(null)

  const categorias = useMemo(() => {
    return [
      { id: "todas", label: "Todas", icon: Lightbulb, total: monstroPages.length },
      ...monstroFolders.map((folder) => ({
        id: folder.id,
        label: folder.label,
        icon: folderIcons[folder.id] || FolderOpen,
        total: folder.total,
      })),
    ]
  }, [])

  const dicas = useMemo(() => {
    return monstroPages.map((page) => {
      const Icon = folderIcons[page.folder] || Lightbulb

      return {
        id: page.id,
        titulo: page.title,
        categoria: page.folder,
        categoriaLabel: getDicaCategory(page.folder),
        icon: Icon,
        problema: page.problem || page.title,
        causa: page.context,
        solucao: getSolucaoPratica(page),
        conteudo: page.content,
        tipo: page.type,
        status: page.status,
        data: page.createdAt,
      }
    })
  }, [])

  const filteredDicas = dicas.filter((dica) => {
    const query = searchTerm.toLowerCase().trim()

    const searchableText = [
      dica.titulo,
      dica.categoriaLabel,
      dica.problema,
      dica.causa,
      dica.solucao,
      dica.conteudo,
      dica.tipo,
      dica.status,
    ]
      .join(" ")
      .toLowerCase()

    const matchesSearch = !query || searchableText.includes(query)
    const matchesCategoria =
      !categoriaAtiva ||
      categoriaAtiva === "todas" ||
      dica.categoria === categoriaAtiva

    return matchesSearch && matchesCategoria
  })

  const dicasImportadas = dicas.filter((dica) => dica.status === "importado")
    .length

  const dicasLimpas = dicas.filter((dica) =>
    ["ideia-limpa", "pronto", "publicado"].includes(dica.status)
  ).length

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-zinc-950 via-zinc-950 to-red-950/40 p-6 shadow-xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -bottom-24 left-16 h-72 w-72 rounded-full bg-red-900/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              <Lightbulb className="h-4 w-4" />
              Dicas extraídas das pesquisas
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Dicas Rápidas
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                Cada conversa importada vira uma dica prática: problema, causa,
                solução e acesso direto para abrir como missão.
              </p>
            </div>
          </div>

          <Link href="/dashboard/biblioteca">
            <Button className="gap-2 bg-red-600 hover:bg-red-700">
              <BookOpen className="h-4 w-4" />
              Ver Biblioteca
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{dicas.length}</p>
              <p className="text-sm text-muted-foreground">Dicas geradas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-300">
              <Archive className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{dicasImportadas}</p>
              <p className="text-sm text-muted-foreground">Importadas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{dicasLimpas}</p>
              <p className="text-sm text-muted-foreground">Mais limpas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-border/60 bg-card/40">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar dica: testosterona, robocopy, fastboot, MEI..."
              className="pl-10"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categorias.map((cat) => {
          const Icon = cat.icon
          const active =
            (!categoriaAtiva && cat.id === "todas") || categoriaAtiva === cat.id

          return (
            <button
              key={cat.id}
              onClick={() =>
                setCategoriaAtiva(cat.id === "todas" ? null : cat.id)
              }
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-red-500/50 bg-red-500/10 text-red-400"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:border-red-500/30 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
              <Badge variant="secondary" className="ml-1">
                {cat.total}
              </Badge>
            </button>
          )
        })}
      </div>

      {/* Lista de dicas */}
      <div className="space-y-3">
        {filteredDicas.map((dica) => {
          const Icon = dica.icon
          const isExpanded = expandedDica === dica.id

          return (
            <Collapsible
              key={dica.id}
              open={isExpanded}
              onOpenChange={(open) => setExpandedDica(open ? dica.id : null)}
            >
              <Card className="overflow-hidden border-border/60 bg-card/50 transition-all hover:border-red-500/40 hover:bg-card/70">
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center gap-4 p-4 text-left transition-colors">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-foreground">
                          {dica.titulo}
                        </h3>
                        <Badge variant="outline">{dica.categoriaLabel}</Badge>
                        <Badge variant="secondary">{dica.tipo}</Badge>
                      </div>

                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {dica.problema}
                      </p>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t border-border px-4 pb-4 pt-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                      <div className="grid gap-4">
                        <div className="rounded-lg border border-border/60 bg-background/30 p-4">
                          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-red-400">
                            Problema
                          </p>
                          <p className="text-sm text-foreground">
                            {makeShortText(dica.problema, 500)}
                          </p>
                        </div>

                        <div className="rounded-lg border border-border/60 bg-background/30 p-4">
                          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-red-400">
                            Causa / contexto
                          </p>
                          <p className="text-sm text-foreground">
                            {makeShortText(dica.causa, 500)}
                          </p>
                        </div>

                        <div className="rounded-lg border border-border/60 bg-background/30 p-4">
                          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-red-400">
                            Solução prática
                          </p>
                          <p className="text-sm text-foreground">
                            {makeShortText(dica.solucao, 500)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-400">
                            Origem
                          </p>
                          <p className="text-sm text-zinc-300">
                            Importada do ChatGPT
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(dica.data).toLocaleDateString("pt-BR")}
                          </p>
                        </div>

                        <Link href={`/dashboard/projetos/${dica.id}`}>
                          <Button className="w-full gap-2 bg-red-600 hover:bg-red-700">
                            <Target className="h-4 w-4" />
                            Abrir missão
                          </Button>
                        </Link>

                        <Button variant="outline" className="w-full gap-2">
                          <Sparkles className="h-4 w-4" />
                          Transformar em conteúdo
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )
        })}

        {filteredDicas.length === 0 && (
          <Card className="border-border/60 bg-card/40 p-8 text-center">
            <Lightbulb className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">Nenhuma dica encontrada.</p>
          </Card>
        )}
      </div>
    </div>
  )
}