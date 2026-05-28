"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  ClipboardList,
  Dumbbell,
  Target,
  Activity,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ClienteConsultoria {
  id: string
  nome: string
  idade: number
  peso: number
  altura: number
  objetivo: string
  frequencia: string
  status: "ativo" | "pausado" | "concluido"
  tendencia: "up" | "down" | "stable"
  ultimoCheckin: string
  plano: string
}

const consultoriaData: ClienteConsultoria[] = [
  {
    id: "1",
    nome: "Wellington",
    idade: 37,
    peso: 91,
    altura: 171,
    objetivo: "Definição muscular",
    frequencia: "3x semana",
    status: "ativo",
    tendencia: "down",
    ultimoCheckin: "Hoje",
    plano: "Pré-intermediário",
  },
  {
    id: "2",
    nome: "Carlos",
    idade: 28,
    peso: 85,
    altura: 180,
    objetivo: "Ganho de massa",
    frequencia: "5x semana",
    status: "ativo",
    tendencia: "up",
    ultimoCheckin: "Hoje",
    plano: "Avançado",
  },
  {
    id: "3",
    nome: "Ana",
    idade: 25,
    peso: 62,
    altura: 165,
    objetivo: "Emagrecimento",
    frequencia: "4x semana",
    status: "ativo",
    tendencia: "down",
    ultimoCheckin: "2 dias",
    plano: "Iniciante",
  },
  {
    id: "4",
    nome: "Pedro",
    idade: 35,
    peso: 92,
    altura: 178,
    objetivo: "Recomposição",
    frequencia: "3x semana",
    status: "pausado",
    tendencia: "stable",
    ultimoCheckin: "1 semana",
    plano: "Intermediário",
  },
]

const statusColors = {
  ativo: "bg-green-500/20 text-green-400 border-green-500/30",
  pausado: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  concluido: "bg-red-500/20 text-red-400 border-red-500/30",
}

const statusLabels = {
  ativo: "Ativo",
  pausado: "Pausado",
  concluido: "Concluído",
}

const TendenciaIcon = ({
  tendencia,
}: {
  tendencia: "up" | "down" | "stable"
}) => {
  if (tendencia === "up") {
    return <TrendingUp className="h-4 w-4 text-green-500" />
  }

  if (tendencia === "down") {
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  return <Minus className="h-4 w-4 text-muted-foreground" />
}

export default function ConsultoriaPage() {
  const [clientes] = useState<ClienteConsultoria[]>(consultoriaData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const ativos = clientes.filter((cliente) => cliente.status === "ativo").length
  const pausados = clientes.filter((cliente) => cliente.status === "pausado").length
  const concluidos = clientes.filter(
    (cliente) => cliente.status === "concluido"
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
              <Users className="h-4 w-4" />
              Consultoria
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Consultoria
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                Gestão de clientes, planos, objetivos, check-ins e evolução
                dentro do seu sistema.
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Cliente</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" placeholder="Nome do cliente" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="idade">Idade</Label>
                    <Input id="idade" type="number" placeholder="25" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input id="peso" type="number" placeholder="75" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="altura">Altura (cm)</Label>
                    <Input id="altura" type="number" placeholder="175" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="frequencia">Frequência</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2x">2x semana</SelectItem>
                        <SelectItem value="3x">3x semana</SelectItem>
                        <SelectItem value="4x">4x semana</SelectItem>
                        <SelectItem value="5x">5x semana</SelectItem>
                        <SelectItem value="6x">6x semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="objetivo">Objetivo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                      <SelectItem value="massa">Ganho de massa</SelectItem>
                      <SelectItem value="definicao">Definição</SelectItem>
                      <SelectItem value="recomposicao">Recomposição</SelectItem>
                      <SelectItem value="saude">Saúde geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="mt-2 bg-red-600 hover:bg-red-700"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Adicionar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{clientes.length}</p>
              <p className="text-sm text-muted-foreground">Clientes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{ativos}</p>
              <p className="text-sm text-muted-foreground">Ativos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{pausados}</p>
              <p className="text-sm text-muted-foreground">Pausados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{concluidos}</p>
              <p className="text-sm text-muted-foreground">Concluídos</p>
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
              placeholder="Buscar cliente da consultoria..."
              className="pl-10"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Consultoria grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredClientes.map((cliente) => (
          <Card
            key={cliente.id}
            className="group overflow-hidden border-border/60 bg-card/50 transition-all hover:border-red-500/40 hover:bg-card/70"
          >
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                    <span className="text-lg font-black text-red-500">
                      {cliente.nome.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-foreground">
                      {cliente.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cliente.plano}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver /dashboard//dashboard/perfil</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Gerar plano</DropdownMenuItem>
                    <DropdownMenuItem>Registrar check-in</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Objetivo</span>
                  <span className="text-right font-medium text-foreground">
                    {cliente.objetivo}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Peso</span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    {cliente.peso} kg
                    <TendenciaIcon tendencia={cliente.tendencia} />
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Altura</span>
                  <span className="font-medium text-foreground">
                    {cliente.altura} cm
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Frequência</span>
                  <span className="font-medium text-foreground">
                    {cliente.frequencia}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Último check-in</span>
                  <span className="font-medium text-foreground">
                    {cliente.ultimoCheckin}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <Badge className={statusColors[cliente.status]}>
                  {statusLabels[cliente.status]}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-400"
                >
                  Ver detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredClientes.length === 0 && (
          <Card className="border-border/60 bg-card/40 p-8 text-center sm:col-span-2 xl:col-span-3">
            <p className="text-muted-foreground">
              Nenhum cliente encontrado.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}