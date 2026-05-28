"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Youtube, 
  Lightbulb,
  FileText,
  Video,
  Upload,
  Recycle,
  ChevronRight,
  Plus,
  Play
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const pipeline = [
  { id: "ideia", title: "Ideia", icon: Lightbulb, count: 12, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  { id: "pesquisa", title: "Pesquisa", icon: FileText, count: 5, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { id: "roteiro", title: "Roteiro", icon: FileText, count: 3, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { id: "gravacao", title: "Gravação", icon: Video, count: 1, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { id: "publicado", title: "Publicado", icon: Upload, count: 8, color: "text-green-500", bgColor: "bg-green-500/10" },
  { id: "reaproveitado", title: "Reaproveitado", icon: Recycle, count: 2, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
]

const temas = [
  { title: "Robocopy - Backup Inteligente", status: "roteiro", views: null },
  { title: "ADB / Fastboot para Iniciantes", status: "ideia", views: null },
  { title: "Custom ROM - Guia Completo", status: "ideia", views: null },
  { title: "Por que macarrão dá pump?", status: "gravacao", views: null },
  { title: "Adenosina e Sono", status: "pesquisa", views: null },
  { title: "Progressão de Carga", status: "publicado", views: "2.3K" },
  { title: "Treino Inteligente vs Força Bruta", status: "publicado", views: "1.8K" },
]

const roteiroTemplate = {
  sections: ["Problema", "Contexto", "Mecanismo", "Passo a passo", "Erro comum", "Resultado", "CTA"]
}

export default function ConteudoPage() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const filteredTemas = selectedStage 
    ? temas.filter(t => t.status === selectedStage)
    : temas

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Youtube className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">
              Conteúdo <span className="text-primary">YouTube</span>
            </h1>
            <p className="text-muted-foreground">
              Ideias, roteiros, gravação e publicação.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Ideia
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Novo Roteiro
        </Button>
      </div>

      {/* Pipeline */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-xl font-bold">Pipeline de Conteúdo</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {pipeline.map((stage) => (
            <Card 
              key={stage.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50 text-center",
                selectedStage === stage.id && "border-primary"
              )}
              onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
            >
              <CardContent className="p-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2", stage.bgColor)}>
                  <stage.icon className={cn("w-5 h-5", stage.color)} />
                </div>
                <p className="text-sm font-medium">{stage.title}</p>
                <p className={cn("text-2xl font-black", stage.color)}>{stage.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Temas */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-bold">
              {selectedStage ? `Temas em ${pipeline.find(p => p.id === selectedStage)?.title}` : "Todos os Temas"}
            </h2>
          </div>
          <div className="space-y-2">
            {filteredTemas.map((tema, i) => {
              const stage = pipeline.find(p => p.id === tema.status)
              return (
                <Link
                  key={i}
                  href="#"
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {stage && (
                      <div className={cn("w-8 h-8 rounded flex items-center justify-center", stage.bgColor)}>
                        <stage.icon className={cn("w-4 h-4", stage.color)} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">{tema.title}</h3>
                      <p className="text-sm text-muted-foreground">{stage?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {tema.views && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {tema.views}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Roteiro Template */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-bold">Roteiro Padrão</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estrutura do Vídeo</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {roteiroTemplate.sections.map((section, i) => (
                  <li key={section} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 bg-primary/10 rounded text-primary font-bold flex items-center justify-center text-xs">
                      {i + 1}
                    </span>
                    {section}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Exemplo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong className="text-primary">Problema:</strong> Pessoa come macarrão e sente treino mais cheio.</p>
              <p><strong className="text-primary">Mecanismo:</strong> Carboidrato abastece glicogênio muscular.</p>
              <p><strong className="text-primary">Resultado:</strong> Melhor performance se encaixado no plano.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
