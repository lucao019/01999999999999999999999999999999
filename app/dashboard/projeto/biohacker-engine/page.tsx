"use client"

import { useState } from "react"
import { ProjectPageLayout } from "@/components/project-page-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const initialStages = [
  {
    id: "diagnostico",
    title: "Etapa 01: Diagnóstico",
    completed: true,
    items: [
      { id: "peso", label: "Peso registrado", completed: true },
      { id: "altura", label: "Altura registrada", completed: true },
      { id: "objetivo", label: "Objetivo definido", completed: true },
      { id: "frequencia", label: "Frequência de treino definida", completed: true },
      { id: "alimentacao", label: "Alimentação atual mapeada", completed: true },
    ],
  },
  {
    id: "plano",
    title: "Etapa 02: Plano",
    completed: true,
    items: [
      { id: "divisao", label: "Divisão de treino criada", completed: true },
      { id: "volume", label: "Volume semanal definido", completed: true },
      { id: "cardio", label: "Cardio planejado", completed: true },
      { id: "dieta", label: "Dieta base estruturada", completed: true },
    ],
  },
  {
    id: "execucao",
    title: "Etapa 03: Execução",
    completed: false,
    items: [
      { id: "treino-dia", label: "Treino do dia registrado", completed: true },
      { id: "carga", label: "Carga usada anotada", completed: true },
      { id: "repeticoes", label: "Repetições registradas", completed: false },
      { id: "sensacao", label: "Sensação de pump/fadiga avaliada", completed: false },
    ],
  },
  {
    id: "ajuste",
    title: "Etapa 04: Ajuste",
    completed: false,
    items: [
      { id: "peso-subiu", label: "Analisar se peso subiu", completed: false },
      { id: "peso-caiu", label: "Analisar se peso caiu", completed: false },
      { id: "forca", label: "Avaliar se força aumentou", completed: false },
      { id: "comida", label: "Verificar necessidade de ajuste na comida", completed: false },
    ],
  },
]

export default function BiohackerEnginePage() {
  const [peso, setPeso] = useState("")
  const [treinou, setTreinou] = useState<"sim" | "nao" | null>(null)
  const [qualidade, setQualidade] = useState<"fraco" | "bom" | "insano" | null>(null)
  const [pump, setPump] = useState(5)
  const [fadiga, setFadiga] = useState(5)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSave = () => {
    let message = ""
    if (treinou === "sim") {
      if (fadiga > 7) {
        message = "Você treinou bem, mas a fadiga está alta. Sugestão: manter carga e melhorar recuperação."
      } else if (pump >= 7 && fadiga <= 5) {
        message = "Treino excelente! Pump alto e fadiga controlada. Continue assim!"
      } else if (qualidade === "insano") {
        message = "Treino insano! Seu corpo está respondendo bem. Mantenha a consistência."
      } else {
        message = "Bom treino registrado. Acompanhe sua evolução ao longo da semana."
      }
    } else {
      message = "Dia de descanso registrado. Lembre-se: recuperação também é parte do progresso."
    }
    setFeedback(message)
  }

  return (
    <ProjectPageLayout
      title="Biohacker Engine"
      icon="biohacker"
      status="Em desenvolvimento"
      progress={70}
      stages={initialStages}
      onSave={handleSave}
    >
      <div className="space-y-5">
        {/* Peso */}
        <div className="space-y-2">
          <Label htmlFor="peso" className="text-sm font-medium">
            Peso atual (kg)
          </Label>
          <Input
            id="peso"
            type="number"
            placeholder="Ex: 75.5"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="bg-input"
          />
        </div>

        {/* Treinou hoje */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Treinou hoje?</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={treinou === "sim" ? "default" : "outline"}
              size="sm"
              onClick={() => setTreinou("sim")}
              className="flex-1"
            >
              Sim
            </Button>
            <Button
              type="button"
              variant={treinou === "nao" ? "default" : "outline"}
              size="sm"
              onClick={() => setTreinou("nao")}
              className="flex-1"
            >
              Não
            </Button>
          </div>
        </div>

        {treinou === "sim" && (
          <>
            {/* Qualidade do treino */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Como foi o treino?</Label>
              <div className="flex gap-2">
                {(["fraco", "bom", "insano"] as const).map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={qualidade === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQualidade(option)}
                    className="flex-1 capitalize"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pump slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Pump</Label>
                <span className="text-sm font-bold text-primary">{pump}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={pump}
                onChange={(e) => setPump(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {/* Fadiga slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Fadiga</Label>
                <span className="text-sm font-bold text-primary">{fadiga}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={fadiga}
                onChange={(e) => setFadiga(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm font-medium text-foreground">
              <span className="text-primary font-bold">Status:</span> {feedback}
            </p>
          </div>
        )}
      </div>
    </ProjectPageLayout>
  )
}
