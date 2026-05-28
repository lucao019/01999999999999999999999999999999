"use client"

import { useState } from "react"
import { ProjectPageLayout } from "@/components/project-page-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const initialStages = [
  {
    id: "identificar",
    title: "Etapa 01: Identificar aparelho",
    completed: true,
    items: [
      { id: "modelo", label: "Modelo identificado", completed: true },
      { id: "codename", label: "Codename verificado", completed: true },
      { id: "bootloader", label: "Estado do bootloader checado", completed: true },
    ],
  },
  {
    id: "preparar-pc",
    title: "Etapa 02: Preparar PC",
    completed: false,
    items: [
      { id: "drivers", label: "Drivers instalados", completed: true },
      { id: "platform-tools", label: "Platform-tools instalado", completed: true },
      { id: "testar-adb", label: "Testar ADB/Fastboot", completed: false },
    ],
  },
  {
    id: "desbloquear",
    title: "Etapa 03: Desbloquear bootloader",
    completed: false,
    items: [
      { id: "conta-xiaomi", label: "Conta Xiaomi vinculada", completed: false },
      { id: "mi-unlock", label: "Mi Unlock executado", completed: false },
      { id: "tempo-espera", label: "Tempo de espera cumprido", completed: false },
    ],
  },
  {
    id: "instalar-rom",
    title: "Etapa 04: Instalar recovery/ROM",
    completed: false,
    items: [
      { id: "baixar-arquivos", label: "Arquivos corretos baixados", completed: false },
      { id: "entrar-fastboot", label: "Entrar em fastboot", completed: false },
      { id: "flashar-recovery", label: "Flashar recovery", completed: false },
      { id: "instalar-rom", label: "Instalar ROM", completed: false },
    ],
  },
  {
    id: "pos-instalacao",
    title: "Etapa 05: Pós-instalação",
    completed: false,
    items: [
      { id: "primeiro-boot", label: "Primeiro boot realizado", completed: false },
      { id: "config-inicial", label: "Configuração inicial feita", completed: false },
      { id: "testes", label: "Testes de câmera, Wi-Fi, chip e bateria", completed: false },
    ],
  },
]

const checklistItems = [
  { id: "driver", label: "Driver instalado" },
  { id: "fastboot", label: "Fastboot reconhecendo" },
  { id: "bootloader", label: "Bootloader desbloqueado" },
  { id: "backup", label: "Backup feito" },
  { id: "rom", label: "ROM baixada" },
  { id: "recovery", label: "Recovery instalado" },
]

export default function OficinaTechPage() {
  const [modelo, setModelo] = useState("")
  const [codename, setCodename] = useState("")
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [feedback, setFeedback] = useState<string | null>(null)

  const toggleChecklist = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const completedCount = Object.values(checklist).filter(Boolean).length
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100)

  const handleSave = () => {
    if (progressPercent === 100) {
      setFeedback("Todos os itens concluídos! Você está pronto para iniciar o primeiro boot.")
    } else if (progressPercent >= 50) {
      const nextItem = checklistItems.find((item) => !checklist[item.id])
      setFeedback(`Progresso do projeto: ${progressPercent}%. Próxima ação: ${nextItem?.label.toLowerCase()}.`)
    } else {
      setFeedback(`Progresso do projeto: ${progressPercent}%. Continue completando os itens do checklist.`)
    }
  }

  return (
    <ProjectPageLayout
      title="Oficina Tech / Android"
      icon="tech"
      status="Ativo"
      progress={40}
      stages={initialStages}
      onSave={handleSave}
    >
      <div className="space-y-5">
        {/* Modelo */}
        <div className="space-y-2">
          <Label htmlFor="modelo" className="text-sm font-medium">
            Modelo do aparelho
          </Label>
          <Input
            id="modelo"
            placeholder="Ex: Redmi Note 11"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="bg-input"
          />
        </div>

        {/* Codename */}
        <div className="space-y-2">
          <Label htmlFor="codename" className="text-sm font-medium">
            Codename
          </Label>
          <Input
            id="codename"
            placeholder="Ex: spes"
            value={codename}
            onChange={(e) => setCodename(e.target.value)}
            className="bg-input"
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Checklist de preparação</Label>
          <div className="space-y-2 mt-2">
            {checklistItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={cn(
                  "flex items-center gap-3 w-full p-3 rounded-lg border transition-colors text-left",
                  checklist[item.id]
                    ? "bg-primary/10 border-primary/30"
                    : "bg-secondary/50 border-border hover:border-primary/30"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                    checklist[item.id]
                      ? "bg-primary border-primary"
                      : "border-muted-foreground"
                  )}
                >
                  {checklist[item.id] && (
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    checklist[item.id] ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm font-medium text-foreground">{feedback}</p>
          </div>
        )}
      </div>
    </ProjectPageLayout>
  )
}
