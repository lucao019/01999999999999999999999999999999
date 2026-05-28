"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Brain, 
  Target,
  AlertTriangle,
  Skull,
  User,
  Sparkles,
  Zap,
  ChevronRight,
  Plus,
  FileText
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sections = [
  {
    id: "disciplina",
    title: "Disciplina",
    description: "Rotina, consistência, trabalho diário e foco.",
    icon: Target,
    items: ["Rotina", "Consistência", "Trabalho diário", "Foco", "Energia mental"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "escassez",
    title: "Alarme de Escassez",
    description: "Ansiedade financeira, medo e loop mental.",
    icon: AlertTriangle,
    items: ["Gatilho", "Reação", "Loop mental", "Saída prática"],
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    id: "ego",
    title: "Ego",
    description: "Auto-imagem, defesa e interpretação.",
    icon: User,
    items: ["Auto-imagem", "Defesa", "Interpretação", "Projeção"],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "sombra",
    title: "Sombra",
    description: "Aspectos negados, integração e reconhecimento.",
    icon: Skull,
    items: ["Aspectos negados", "Integração", "Reconhecimento", "Aceitação"],
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
  {
    id: "arquetipos",
    title: "Arquétipos",
    description: "Herói, mentor, tirano e inconsciente coletivo.",
    icon: Sparkles,
    items: ["Herói", "Mentor", "Tirano", "Inconsciente coletivo"],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "energia",
    title: "Energia Mental",
    description: "Gasto cognitivo, recuperação e priorização.",
    icon: Zap,
    items: ["Gasto cognitivo", "Recuperação", "Priorização", "Lei do desapego"],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
]

const insights = [
  {
    title: "Alarme de Escassez",
    content: "Problema financeiro → mente interpreta ameaça → cortisol/alerta → pensamento repetitivo → gasto de energia mental.",
    category: "Escassez",
  },
  {
    title: "Trabalho Diário",
    content: "Ação diária → cria repertório → vira conteúdo → vira autoridade → vira projeto.",
    category: "Disciplina",
  },
  {
    title: "Símbolo e Decisão",
    content: "Evento diário → mente organiza em símbolo → símbolo vira narrativa → narrativa influencia decisão.",
    category: "Arquétipos",
  },
]

export default function MentePage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">
              Mente <span className="text-primary">Sistema</span>
            </h1>
            <p className="text-muted-foreground">
              Disciplina, escassez, ego, sombra e arquétipos.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Insight
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Ver Todas
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
                      href={`/dashboard/mente/${section.id}/${item.toLowerCase().replace(/ /g, "-")}`}
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

      {/* Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-xl font-bold">Insights Recentes</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {insights.map((insight, i) => (
            <Card key={i} className="hover:border-primary/50 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                  <span className="text-xs bg-secondary px-2 py-1 rounded">{insight.category}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
