"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Dumbbell, Smartphone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Stage {
  id: string
  title: string
  completed: boolean
  items: { id: string; label: string; completed: boolean }[]
}

interface ProjectPageLayoutProps {
  title: string
  icon: "biohacker" | "tech" | "content"
  status: string
  progress: number
  stages: Stage[]
  children: React.ReactNode
  onSave: () => void
}

const iconMap = {
  biohacker: Dumbbell,
  tech: Smartphone,
  content: Video,
}

export function ProjectPageLayout({
  title,
  icon,
  status,
  progress,
  stages,
  children,
  onSave,
}: ProjectPageLayoutProps) {
  const Icon = iconMap[icon]
  const [stageData, setStageData] = useState(stages)

  const toggleItem = (stageId: string, itemId: string) => {
    setStageData((prev) =>
      prev.map((stage) => {
        if (stage.id === stageId) {
          const updatedItems = stage.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
          const allCompleted = updatedItems.every((item) => item.completed)
          return { ...stage, items: updatedItems, completed: allCompleted }
        }
        return stage
      })
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar ao painel
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-foreground">{title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground">
                Status: <span className="text-primary font-medium">{status}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progresso do Projeto</span>
          <span className="text-2xl font-black text-primary">{progress}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stages/Checklist section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            Etapas
          </h2>
          <div className="space-y-4">
            {stageData.map((stage) => (
              <div key={stage.id} className="border border-border rounded-lg overflow-hidden">
                <div
                  className={cn(
                    "flex items-center gap-3 p-3 bg-secondary/30",
                    stage.completed && "bg-primary/10"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                      stage.completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {stage.completed && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      stage.completed ? "text-primary" : "text-foreground"
                    )}
                  >
                    {stage.title}
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  {stage.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(stage.id, item.id)}
                      className="flex items-center gap-2 w-full text-left hover:bg-secondary/50 p-1 rounded transition-colors"
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          item.completed
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {item.completed && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          item.completed
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction area */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Área de Interação
            </h2>
            {children}
          </div>

          <Button onClick={onSave} className="w-full" size="lg">
            Salvar Atualização
          </Button>
        </div>
      </div>
    </div>
  )
}
