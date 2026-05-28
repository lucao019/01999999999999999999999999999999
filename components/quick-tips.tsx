"use client"

import { Lightbulb, Clock, Target } from "lucide-react"

const tips = [
  {
    icon: Lightbulb,
    title: "Dica do dia",
    content: "Mantenha consistência nos treinos. Frequência supera intensidade a longo prazo.",
  },
  {
    icon: Clock,
    title: "Último projeto atualizado",
    content: "Biohacker Engine - há 2 horas",
  },
  {
    icon: Target,
    title: "Próxima tarefa",
    content: "Completar a Etapa 03 do projeto Oficina Tech",
  },
]

export function QuickTips() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full" />
        Dicas Rápidas
      </h2>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <tip.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{tip.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
