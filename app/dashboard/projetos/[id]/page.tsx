"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Circle,
  ClipboardList,
  FileText,
  FolderOpen,
  Lightbulb,
  Save,
  Sparkles,
  Target,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

import { getPageById } from "@/lib/data/monstro-pages"

const checklistItems = [
  "Ler o conteúdo bruto da conversa",
  "Identificar o problema central",
  "Separar contexto, mecanismo e conclusão",
  "Extrair os pontos-chave",
  "Criar uma versão limpa para explicar",
  "Transformar em conteúdo, aula ou projeto",
]

const statusLabels: Record<string, string> = {
  importado: "Importado",
  bruto: "Bruto",
  filtrado: "Filtrado",
  "ideia-limpa": "Ideia limpa",
  pronto: "Pronto",
  publicado: "Publicado",
}

const statusStyles: Record<string, string> = {
  importado: "bg-zinc-800 text-zinc-300 border-zinc-600",
  bruto: "bg-zinc-800 text-zinc-300 border-zinc-600",
  filtrado: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "ideia-limpa": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pronto: "bg-green-500/20 text-green-400 border-green-500/30",
  publicado: "bg-red-500/20 text-red-400 border-red-500/30",
}

function getProgress(doneCount: number, total: number) {
  if (total === 0) return 0
  return Math.round((doneCount / total) * 100)
}

function getStatusLabel(status: string) {
  return statusLabels[status] || status
}

function getStatusClass(status: string) {
  return statusStyles[status] || "bg-zinc-800 text-zinc-300 border-zinc-600"
}

function getShortText(text: string, limit = 280) {
  if (!text) return "Sem informação extraída."
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

export default function ProjetoDetalhePage() {
  const params = useParams()
  const id = String(params.id)

  const page = getPageById(id)

  const [doneItems, setDoneItems] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [savedMessage, setSavedMessage] = useState("")

  const storageKey = `monstro:mission:${id}`

  useEffect(() => {
    if (!page) return

    const saved = window.localStorage.getItem(storageKey)

    if (!saved) return

    try {
      const parsed = JSON.parse(saved)

      if (Array.isArray(parsed.doneItems)) {
        setDoneItems(parsed.doneItems)
      }

      if (typeof parsed.notes === "string") {
        setNotes(parsed.notes)
      }
    } catch {
      console.warn("Erro ao carregar missão salva.")
    }
  }, [page, storageKey])

  const progress = useMemo(() => {
    return getProgress(doneItems.length, checklistItems.length)
  }, [doneItems])

  function toggleItem(item: string) {
    setDoneItems((current) => {
      if (current.includes(item)) {
        return current.filter((value) => value !== item)
      }

      return [...current, item]
    })
  }

  function handleSaveMission() {
    const payload = {
      doneItems,
      notes,
      updatedAt: new Date().toISOString(),
    }

    window.localStorage.setItem(storageKey, JSON.stringify(payload))
    setSavedMessage("Missão salva no navegador.")

    window.setTimeout(() => {
      setSavedMessage("")
    }, 2500)
  }

  if (!page) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Link href="/dashboard/projetos">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Projetos
            </Button>
          </Link>

          <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
            <CardContent className="py-12 text-center">
              <FolderOpen className="mx-auto mb-4 h-12 w-12 text-zinc-500" />
              <h1 className="mb-2 text-xl font-bold">Pesquisa não encontrada</h1>
              <p className="text-zinc-400">
                Esse ID não existe dentro de lib/data/monstro-pages.ts.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard/projetos">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Projetos
            </Button>
          </Link>

          <Link href="/dashboard/biblioteca">
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Biblioteca
            </Button>
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/80 p-5 shadow-2xl sm:p-6">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-8 h-72 w-72 rounded-full bg-red-900/15 blur-3xl" />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
                <Target className="h-4 w-4" />
                Missão de Pesquisa
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{page.folderLabel}</Badge>
                  <Badge variant="secondary">{page.type}</Badge>
                  <Badge className={getStatusClass(page.status)}>
                    {getStatusLabel(page.status)}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(page.createdAt).toLocaleDateString("pt-BR")}
                  </Badge>
                </div>

                <div>
                  <h1 className="max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {page.title}
                  </h1>

                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
                    {page.context}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-zinc-400">Progresso</span>
                <span className="font-black text-white">{progress}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="h-full rounded-full bg-red-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                {doneItems.length}/{checklistItems.length} etapas concluídas
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-red-500" />
                  Problema original
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                    {page.problem || "Sem problema original extraído."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-red-500" />
                  Leitura rápida
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-red-400">
                    Contexto
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {getShortText(page.context, 360)}
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-red-400">
                    Próxima ação
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {getShortText(page.practical, 360)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  Conteúdo importado
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="max-h-[560px] overflow-auto rounded-lg border border-white/10 bg-black/30 p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
                    {page.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-red-500" />
                  Checklist da missão
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {checklistItems.map((item) => {
                  const checked = doneItems.includes(item)

                  return (
                    <button
                      key={item}
                      onClick={() => toggleItem(item)}
                      className="flex w-full items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-3 text-left transition-colors hover:border-red-500/30 hover:bg-black/50"
                    >
                      {checked ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
                      )}

                      <span
                        className={`text-sm ${
                          checked
                            ? "text-zinc-500 line-through"
                            : "text-zinc-200"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle>Anotações pessoais</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Escreva aqui sua leitura, insight, ajuste, versão limpa ou próxima ideia..."
                  className="min-h-[240px] resize-y border-white/10 bg-black/30 text-white placeholder:text-zinc-500"
                />

                <Button
                  onClick={handleSaveMission}
                  className="w-full gap-2 bg-red-600 hover:bg-red-700"
                >
                  <Save className="h-4 w-4" />
                  Salvar missão
                </Button>

                {savedMessage && (
                  <p className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-400">
                    {savedMessage}
                  </p>
                )}

                <p className="text-xs text-zinc-500">
                  O checklist e as anotações ficam salvos no navegador usando
                  localStorage.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-red-950/10 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Sparkles className="h-5 w-5" />
                  Output da missão
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-zinc-300">
                <p>
                  Esta pesquisa pode virar uma explicação limpa, um vídeo, uma
                  aula, uma anotação técnica ou uma página final do sistema.
                </p>

                <Button variant="outline" className="w-full gap-2">
                  <Sparkles className="h-4 w-4" />
                  Transformar em conteúdo
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}