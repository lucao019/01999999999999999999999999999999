"use client"

import { useMemo, useState } from "react"
import {
  Calendar,
  Filter,
  FolderOpen,
  CheckCircle2,
  MessageSquare,
  PenLine,
  Wrench,
  Bug,
  Brain,
  Sparkles,
  Code2,
  Clock,
  GraduationCap,
  Rocket,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type HistoricoTipo =
  | "upgrade"
  | "bug"
  | "aprendizado"
  | "decisao"
  | "codigo"
  | "proxima-acao"

interface HistoricoItem {
  id: string
  data: string
  hora: string
  tipo: HistoricoTipo
  titulo: string
  descricao: string
  impacto: string
  projeto: string
}

const historicoData: HistoricoItem[] = [
  {
    id: "upgrade-ultima-hora-1",
    data: "Hoje",
    hora: "Agora",
    tipo: "upgrade",
    titulo: "Calculadora substituiu Gerador de Plano",
    descricao:
      "A antiga aba Gerador de Plano foi renomeada para Calculadora, com rota técnica nova em /dashboard/calculadora e visual alinhado ao resto do sistema.",
    impacto:
      "A função ficou mais clara: agora a página é uma calculadora de TDEE, macros, meta calórica e estrutura base de treino.",
    projeto: "Calculadora",
  },
  {
    id: "upgrade-ultima-hora-2",
    data: "Hoje",
    hora: "Agora",
    tipo: "upgrade",
    titulo: "Consultoria substituiu Alunos",
    descricao:
      "A aba Alunos foi transformada em Consultoria. Os textos mudaram para cliente, check-in, plano e gestão de acompanhamento.",
    impacto:
      "A área ficou mais profissional e alinhada com a ideia de organizar uma consultoria, sem limitar a tela apenas a alunos.",
    projeto: "Consultoria",
  },
  {
    id: "upgrade-ultima-hora-3",
    data: "Hoje",
    hora: "Agora",
    tipo: "bug",
    titulo: "Corrigido problema de rota com Consultoria",
    descricao:
      "A rota técnica estava indo para /dashboard/Consultoria com letra maiúscula, causando erro 404. O caminho correto foi definido como /dashboard/consultoria.",
    impacto:
      "A navegação ficou consistente com o padrão do Next.js, usando rota minúscula igual ao nome da pasta.",
    projeto: "Rotas / Next.js",
  },
  {
    id: "upgrade-ultima-hora-4",
    data: "Hoje",
    hora: "Agora",
    tipo: "bug",
    titulo: "Investigado erro do validator do Next.js",
    descricao:
      "Foi identificado que o arquivo .next/types/validator.ts estava sendo gerado com import errado para page.jss, indicando cache quebrado após renomear rotas.",
    impacto:
      "Ficou claro que arquivos dentro de .next são gerados automaticamente e não devem ser editados manualmente. A correção correta é limpar o cache .next.",
    projeto: "Next.js / Cache",
  },
  {
    id: "upgrade-ultima-hora-5",
    data: "Hoje",
    hora: "Agora",
    tipo: "upgrade",
    titulo: "Projetos virou Central de Missões",
    descricao:
      "A aba Projetos foi atualizada para tratar cada pesquisa importada como uma missão/trabalho de casa, com hero visual, estatísticas, filtros, busca, cards premium e botão Abrir missão.",
    impacto:
      "As conversas importadas deixaram de ser apenas conteúdo salvo e passaram a funcionar como tarefas executáveis dentro do site.",
    projeto: "Projetos",
  },
  {
    id: "upgrade-ultima-hora-6",
    data: "Hoje",
    hora: "Agora",
    tipo: "upgrade",
    titulo: "Página interna de Projeto virou Missão de Pesquisa",
    descricao:
      "A rota /dashboard/projetos/[id] foi melhorada com leitura rápida, problema original, conteúdo importado, checklist, anotações e salvamento em localStorage.",
    impacto:
      "Cada pesquisa agora pode ser estudada, marcada, anotada e transformada em conteúdo final.",
    projeto: "Projetos / Missões",
  },
  {
    id: "upgrade-ultima-hora-7",
    data: "Hoje",
    hora: "Agora",
    tipo: "upgrade",
    titulo: "Dicas passou a usar as pesquisas importadas",
    descricao:
      "A aba Dicas deixou de usar dicas fixas manuais e passou a gerar dicas rápidas a partir de monstroPages, usando problema, contexto, solução prática e botão Abrir missão.",
    impacto:
      "Cada conversa importada agora pode aparecer como dica prática consumível.",
    projeto: "Dicas",
  },
  {
    id: "upgrade-ultima-hora-8",
    data: "Hoje",
    hora: "Agora",
    tipo: "upgrade",
    titulo: "Biblioteca virou Arsenal de Conhecimento",
    descricao:
      "A aba Biblioteca foi melhorada com hero visual, estatísticas, pastas detectadas, busca forte, filtros e cards mais completos com botão Abrir missão.",
    impacto:
      "A Biblioteca ficou com função clara de acervo, separada de Projetos e Dashboard.",
    projeto: "Biblioteca",
  },
  {
    id: "upgrade-ultima-hora-9",
    data: "Hoje",
    hora: "Agora",
    tipo: "upgrade",
    titulo: "Dashboard virou Cockpit",
    descricao:
      "A página Dashboard foi reorganizada para funcionar como painel de controle, mostrando resumo geral, próxima missão, últimas pesquisas e pastas mais cheias.",
    impacto:
      "Dashboard parou de disputar função com Projetos e passou a mostrar o estado geral do sistema.",
    projeto: "Dashboard",
  },
  {
    id: "upgrade-ultima-hora-10",
    data: "Hoje",
    hora: "Agora",
    tipo: "aprendizado",
    titulo: "Aprendido padrão de arquitetura do Monstro Site",
    descricao:
      "Foi definido que Dashboard é cockpit, Projetos é execução, Biblioteca é acervo, Dicas é leitura rápida, Histórico é changelog e Consultoria é gestão de clientes.",
    impacto:
      "O site ganhou separação de responsabilidades entre páginas, evitando telas repetidas fazendo a mesma coisa.",
    projeto: "Arquitetura do Site",
  },
  {
    id: "1",
    data: "Hoje",
    hora: "08:20",
    tipo: "upgrade",
    titulo: "Login recebeu fundo animado",
    descricao:
      "Adicionado GIF/vídeo no BrandPanel como fundo da tela inicial, com blur, camada escura, gradiente vermelho, luzes e grid industrial.",
    impacto:
      "A tela de login deixou de ser estática e ganhou identidade visual mais forte.",
    projeto: "Chat-to-Knowledge Pipeline",
  },
  {
    id: "2",
    data: "Hoje",
    hora: "08:05",
    tipo: "bug",
    titulo: "Corrigido vídeo torto no login",
    descricao:
      "O BrandPanel estava usando largura errada e parecia cortado. A classe lg:w-1/2 foi removida e o painel passou a ocupar w-full dentro da coluna correta.",
    impacto:
      "O vídeo passou a preencher o painel esquerdo corretamente.",
    projeto: "Interface / Login",
  },
  {
    id: "3",
    data: "Hoje",
    hora: "07:40",
    tipo: "aprendizado",
    titulo: "Aprendido como funciona a pasta public",
    descricao:
      "Arquivos dentro de public são acessados pela raiz do site. Exemplo: public/login-bg.gif vira /login-bg.gif no navegador.",
    impacto:
      "Agora dá para trocar fundos, imagens e vídeos sem mexer em lógica complexa.",
    projeto: "Next.js / Estrutura",
  },
  {
    id: "4",
    data: "Hoje",
    hora: "07:10",
    tipo: "decisao",
    titulo: "Dashboard separado de Projetos",
    descricao:
      "Foi decidido que Dashboard será cockpit/visão geral, Projetos será execução/trabalhos de casa e Biblioteca será acervo de conhecimento.",
    impacto:
      "As páginas pararam de disputar a mesma função e o sistema ficou mais organizado.",
    projeto: "Arquitetura do Site",
  },
  {
    id: "5",
    data: "Hoje",
    hora: "06:45",
    tipo: "upgrade",
    titulo: "Projetos virou área de trabalhos de casa",
    descricao:
      "A aba Projetos passou a representar cada pesquisa importada como uma missão executável, com status, progresso, pasta e tipo.",
    impacto:
      "Cada conversa/pesquisa agora pode virar tarefa prática dentro do sistema.",
    projeto: "Projetos",
  },
  {
    id: "6",
    data: "Hoje",
    hora: "06:20",
    tipo: "codigo",
    titulo: "Criada rota dinâmica de pesquisa",
    descricao:
      "Foi criada a estrutura app/dashboard/projetos/[id]/page.tsx para abrir uma página interna para cada pesquisa.",
    impacto:
      "Agora cada card pode abrir uma missão individual com contexto, conteúdo bruto, checklist e anotações.",
    projeto: "Rotas / Next.js",
  },
  {
    id: "7",
    data: "Hoje",
    hora: "05:50",
    tipo: "upgrade",
    titulo: "conversations.json virou base do site",
    descricao:
      "O export do ChatGPT foi processado e transformado em lib/data/monstro-pages.ts.",
    impacto:
      "As conversas deixaram de ser arquivo bruto e viraram páginas navegáveis no Monstro Site.",
    projeto: "Knowledge Base",
  },
  {
    id: "8",
    data: "Hoje",
    hora: "05:30",
    tipo: "aprendizado",
    titulo: "Aprendido o conceito de ETL",
    descricao:
      "O processo usado foi Extract, Transform, Load: extrair conversas, transformar em páginas e carregar no site.",
    impacto:
      "O projeto ganhou um pipeline real de conversas para conhecimento.",
    projeto: "Chat-to-Knowledge Pipeline",
  },
  {
    id: "9",
    data: "Hoje",
    hora: "Agora",
    tipo: "proxima-acao",
    titulo: "Melhorar a aba Histórico",
    descricao:
      "Transformar o Histórico em um diário de evolução do projeto, registrando upgrades, bugs, aprendizados e decisões do dia.",
    impacto:
      "O site passa a guardar não só conteúdo, mas também o caminho de evolução do próprio sistema.",
    projeto: "Histórico",
  },
]

const tipoIcons: Record<HistoricoTipo, any> = {
  upgrade: Rocket,
  bug: Bug,
  aprendizado: GraduationCap,
  decisao: Brain,
  codigo: Code2,
  "proxima-acao": Sparkles,
}

const tipoColors: Record<HistoricoTipo, string> = {
  upgrade: "bg-red-500/20 text-red-400 border-red-500/30",
  bug: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  aprendizado: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  decisao: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  codigo: "bg-green-500/20 text-green-400 border-green-500/30",
  "proxima-acao": "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
}

const tipoLabels: Record<HistoricoTipo, string> = {
  upgrade: "Upgrade",
  bug: "Bug resolvido",
  aprendizado: "Aprendizado",
  decisao: "Decisão",
  codigo: "Código",
  "proxima-acao": "Próxima ação",
}

export default function HistoricoPage() {
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [filtroProjeto, setFiltroProjeto] = useState<string>("todos")

  const projetos = useMemo(() => {
    return [...new Set(historicoData.map((item) => item.projeto))]
  }, [])

  const filteredHistorico = historicoData.filter((item) => {
    const matchesTipo = filtroTipo === "todos" || item.tipo === filtroTipo
    const matchesProjeto =
      filtroProjeto === "todos" || item.projeto === filtroProjeto

    return matchesTipo && matchesProjeto
  })

  const groupedHistorico = filteredHistorico.reduce((acc, item) => {
    if (!acc[item.data]) {
      acc[item.data] = []
    }

    acc[item.data].push(item)
    return acc
  }, {} as Record<string, HistoricoItem[]>)

  const upgradesHoje = historicoData.filter(
    (item) => item.data === "Hoje" && item.tipo === "upgrade"
  ).length

  const aprendizadosHoje = historicoData.filter(
    (item) => item.data === "Hoje" && item.tipo === "aprendizado"
  ).length

  const bugsHoje = historicoData.filter(
    (item) => item.data === "Hoje" && item.tipo === "bug"
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
              <Clock className="h-4 w-4" />
              Diário de evolução
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Histórico
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                Registro do que foi feito, corrigido, aprendido e decidido no
                desenvolvimento do seu sistema.
              </p>
            </div>
          </div>

          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Hoje
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{upgradesHoje}</p>
              <p className="text-sm text-muted-foreground">Upgrades hoje</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{aprendizadosHoje}</p>
              <p className="text-sm text-muted-foreground">Aprendizados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <Bug className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{bugsHoje}</p>
              <p className="text-sm text-muted-foreground">Bugs resolvidos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/60 bg-card/40">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtros:</span>
            </div>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="upgrade">Upgrades</SelectItem>
                <SelectItem value="bug">Bugs resolvidos</SelectItem>
                <SelectItem value="aprendizado">Aprendizados</SelectItem>
                <SelectItem value="decisao">Decisões</SelectItem>
                <SelectItem value="codigo">Código</SelectItem>
                <SelectItem value="proxima-acao">Próximas ações</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroProjeto} onValueChange={setFiltroProjeto}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os projetos</SelectItem>
                {projetos.map((projeto) => (
                  <SelectItem key={projeto} value={projeto}>
                    {projeto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedHistorico).map(([data, items]) => (
          <div key={data}>
            {/* Date header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/40" />
              <h2 className="text-sm font-black uppercase tracking-[0.25em] text-foreground">
                {data}
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Items */}
            <div className="ml-1 space-y-3 border-l border-border pl-6">
              {items.map((item) => {
                const Icon = tipoIcons[item.tipo]

                return (
                  <Card
                    key={item.id}
                    className="border-border/60 bg-card/50 transition-all hover:border-red-500/40 hover:bg-card/70"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tipoColors[item.tipo]}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-foreground">
                                  {item.titulo}
                                </h3>

                                <Badge
                                  variant="outline"
                                  className={tipoColors[item.tipo]}
                                >
                                  {tipoLabels[item.tipo]}
                                </Badge>
                              </div>

                              <p className="text-sm leading-relaxed text-muted-foreground">
                                {item.descricao}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {item.hora}
                            </div>
                          </div>

                          <div className="rounded-lg border border-border/60 bg-background/30 p-3">
                            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                              Impacto
                            </p>
                            <p className="text-sm text-zinc-300">
                              {item.impacto}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <FolderOpen className="h-3 w-3" />
                            {item.projeto}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {filteredHistorico.length === 0 && (
          <Card className="p-8 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Nenhum registro encontrado com esses filtros.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}