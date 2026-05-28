"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Dumbbell, 
  Apple, 
  Brain, 
  Heart, 
  Zap,
  Activity,
  TrendingUp,
  ChevronRight,
  Plus,
  FileText
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sections = [
  {
    id: "treino",
    title: "Treino como Sistema",
    description: "Progressão de carga, volume, séries, fadiga, pump, cluster sets.",
    icon: Dumbbell,
    items: ["Progressão de carga", "Volume semanal", "Séries / Reps", "Fadiga", "Pump", "Cluster set", "Myo-reps"],
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    id: "dieta",
    title: "Dieta e Combustível",
    description: "Alimentos, carboidratos, proteína, função de cada comida no treino.",
    icon: Apple,
    items: ["Frango", "Arroz", "Batata", "Macarrão", "Aveia", "Café", "Nescau"],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "neuroquimica",
    title: "Neuroquímica",
    description: "Adenosina, dopamina, cortisol, cafeína e sono.",
    icon: Brain,
    items: ["Adenosina", "Dopamina", "Cortisol", "Cafeína", "Sono"],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "biomecanica",
    title: "Biomecânica / Dor",
    description: "Fáscia, costelas, respiração, lesões e correção postural.",
    icon: Activity,
    items: ["Inspiração profunda", "Costelas", "Fáscia", "Serrátil", "Trapézio", "Pontada"],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "cardio",
    title: "Cardio e Recuperação",
    description: "Intensidade, tempo de esforço, frequência cardíaca.",
    icon: Heart,
    items: ["Velocidade 90%", "Velocidade 50%", "Tempo de esforço", "Recuperação", "FC"],
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    id: "evolucao",
    title: "Evolução Física",
    description: "Registro de peso, medidas, fotos e progressão.",
    icon: TrendingUp,
    items: ["Peso", "Medidas", "Fotos", "Gráficos", "Metas"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
]

const recentPages = [
  { title: "Adenosina", category: "Neuroquímica", status: "em-construção" },
  { title: "Supino - Progressão", category: "Treino", status: "ativo" },
  { title: "Macarrão e Pump", category: "Dieta", status: "concluído" },
  { title: "Dor Intercostal", category: "Biomecânica", status: "em-construção" },
]

export default function BiohackerPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">
              Biohacker <span className="text-primary">Engine</span>
            </h1>
            <p className="text-muted-foreground">
              Corpo, treino, dieta, biomecânica e neuroquímica.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Página
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
                      href={`/dashboard/biohacker/${section.id}/${item.toLowerCase().replace(/ /g, "-")}`}
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

      {/* Recent Pages */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-xl font-bold">Páginas Recentes</h2>
        </div>
        <div className="space-y-2">
          {recentPages.map((page) => (
            <Link
              key={page.title}
              href="#"
              className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all group"
            >
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">{page.title}</h3>
                <p className="text-sm text-muted-foreground">{page.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-xs px-2 py-1 rounded",
                  page.status === "ativo" && "bg-green-500/20 text-green-500",
                  page.status === "em-construção" && "bg-yellow-500/20 text-yellow-500",
                  page.status === "concluído" && "bg-primary/20 text-primary",
                )}>
                  {page.status}
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
