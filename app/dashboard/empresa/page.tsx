"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Building2, 
  FileText,
  Package,
  Briefcase,
  DollarSign,
  Award,
  ChevronRight,
  Plus,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sections = [
  {
    id: "mei",
    title: "MEI",
    description: "Formalização, nota fiscal e contribuição.",
    icon: FileText,
    items: ["Formalização", "Contribuição mensal", "Nota fiscal", "Limite anual", "Atividades"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "servicos",
    title: "Serviços",
    description: "Consultoria, treino e manutenção técnica.",
    icon: Briefcase,
    items: ["Consultoria fitness", "Treino personalizado", "Manutenção celular", "Suporte técnico"],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "produtos",
    title: "Produtos Digitais",
    description: "Planilhas, guias, cursos e e-books.",
    icon: Package,
    items: ["Planilha de treino", "Planilha de dieta", "Guia Robocopy", "Guia ADB/Fastboot", "Curso Biohacker"],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "portfolio",
    title: "Portfólio",
    description: "Resultados, cases e provas de trabalho.",
    icon: Award,
    items: ["Cases de sucesso", "Antes/Depois", "Depoimentos", "Métricas"],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "monetizacao",
    title: "Monetização",
    description: "YouTube, skins, mercado digital e receitas.",
    icon: DollarSign,
    items: ["YouTube", "Skins CS2", "Mercado digital", "Receita recorrente"],
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
]

const architectBiomechanic = {
  posicionamento: "Analiso corpo como sistema",
  promessa: "Treino inteligente, não força bruta",
  publico: "Quem quer resultado com lógica",
  frase: "Eu transformo treino em sistema.",
}

const produtos = [
  { title: "Planilha de Treino", price: "R$ 47", status: "ativo" },
  { title: "Planilha de Dieta", price: "R$ 37", status: "em-criação" },
  { title: "Guia Robocopy", price: "Gratuito", status: "ativo" },
  { title: "Guia ADB/Fastboot", price: "Gratuito", status: "em-criação" },
  { title: "Curso Biohacker Engine", price: "R$ 197", status: "planejamento" },
]

export default function EmpresaPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">
              Empresa <span className="text-primary">& Monetização</span>
            </h1>
            <p className="text-muted-foreground">
              MEI, serviços, produtos digitais e monetização.
            </p>
          </div>
        </div>
      </div>

      {/* Architect Biomechanic Card */}
      <Card className="mb-8 border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Architect Biomechanic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><strong className="text-primary">Posicionamento:</strong> {architectBiomechanic.posicionamento}</p>
              <p><strong className="text-primary">Promessa:</strong> {architectBiomechanic.promessa}</p>
              <p><strong className="text-primary">Público:</strong> {architectBiomechanic.publico}</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center p-6 bg-card rounded-lg border border-border">
                <p className="text-lg font-bold text-primary italic">&quot;{architectBiomechanic.frase}&quot;</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
        <Button variant="outline" className="gap-2">
          <ExternalLink className="w-4 h-4" />
          Abrir MEI
        </Button>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sections.map((section) => (
          <Card 
            key={section.id}
            className={cn(
              "cursor-pointer transition-all hover:border-primary/50",
              selectedSection === section.id && "border-primary"
            )}
            onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", section.bgColor)}>
                  <section.icon className={cn("w-5 h-5", section.color)} />
                </div>
                <div>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </CardHeader>
            {selectedSection === section.id && (
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {section.items.map((item) => (
                    <Link 
                      key={item}
                      href={`/dashboard/empresa/${section.id}/${item.toLowerCase().replace(/ /g, "-")}`}
                      className="text-xs bg-secondary hover:bg-secondary/80 px-2 py-1 rounded transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Produtos Digitais */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-xl font-bold">Produtos Digitais</h2>
        </div>
        <div className="space-y-2">
          {produtos.map((produto) => (
            <Link
              key={produto.title}
              href="#"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">{produto.title}</h3>
                  <p className="text-sm text-primary font-bold">{produto.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-xs px-2 py-1 rounded",
                  produto.status === "ativo" && "bg-green-500/20 text-green-500",
                  produto.status === "em-criação" && "bg-yellow-500/20 text-yellow-500",
                  produto.status === "planejamento" && "bg-blue-500/20 text-blue-500",
                )}>
                  {produto.status}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
