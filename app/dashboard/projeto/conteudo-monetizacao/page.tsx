"use client"

import { useState } from "react"
import { ProjectPageLayout } from "@/components/project-page-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const initialStages = [
  {
    id: "ideia",
    title: "Etapa 01: Ideia",
    completed: true,
    items: [
      { id: "tema", label: "Tema definido", completed: true },
      { id: "publico", label: "Público identificado", completed: true },
      { id: "problema", label: "Problema que resolve mapeado", completed: true },
    ],
  },
  {
    id: "roteiro",
    title: "Etapa 02: Roteiro",
    completed: false,
    items: [
      { id: "introducao", label: "Introdução escrita", completed: true },
      { id: "explicacao", label: "Explicação estruturada", completed: false },
      { id: "demonstracao", label: "Demonstração planejada", completed: false },
      { id: "conclusao", label: "Conclusão preparada", completed: false },
    ],
  },
  {
    id: "gravacao",
    title: "Etapa 03: Gravação",
    completed: false,
    items: [
      { id: "tela", label: "Gravação de tela feita", completed: false },
      { id: "audio", label: "Áudio gravado", completed: false },
      { id: "pratica", label: "Demonstração prática realizada", completed: false },
    ],
  },
  {
    id: "publicacao",
    title: "Etapa 04: Publicação",
    completed: false,
    items: [
      { id: "titulo", label: "Título criado", completed: false },
      { id: "descricao", label: "Descrição escrita", completed: false },
      { id: "thumbnail", label: "Thumbnail criada", completed: false },
      { id: "tags", label: "Tags definidas", completed: false },
    ],
  },
  {
    id: "conversao",
    title: "Etapa 05: Conversão",
    completed: false,
    items: [
      { id: "cta", label: "Chamada para ação incluída", completed: false },
      { id: "link", label: "Link do projeto adicionado", completed: false },
      { id: "proximo", label: "Próximo vídeo planejado", completed: false },
    ],
  },
]

const niveis = ["Iniciante", "Intermediário", "Avançado"] as const
const statusOptions = ["Ideia", "Roteiro", "Gravando", "Publicado"] as const

export default function ConteudoMonetizacaoPage() {
  const [tema, setTema] = useState("")
  const [nivel, setNivel] = useState<(typeof niveis)[number] | null>(null)
  const [status, setStatus] = useState<(typeof statusOptions)[number] | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSave = () => {
    if (!status) {
      setFeedback("Selecione o status atual do seu vídeo para continuar.")
      return
    }

    const statusMessages: Record<typeof statusOptions[number], string> = {
      Ideia: "Seu vídeo está na fase: Ideia. Próxima tarefa: definir o roteiro e a estrutura do conteúdo.",
      Roteiro: "Seu vídeo está na fase: Roteiro. Próxima tarefa: montar a introdução e a demonstração prática.",
      Gravando: "Seu vídeo está na fase: Gravação. Próxima tarefa: finalizar áudio e editar o material.",
      Publicado: "Vídeo publicado! Próxima tarefa: analisar métricas e planejar o próximo conteúdo.",
    }

    setFeedback(statusMessages[status])
  }

  return (
    <ProjectPageLayout
      title="Conteúdo & Monetização"
      icon="content"
      status="Em desenvolvimento"
      progress={25}
      stages={initialStages}
      onSave={handleSave}
    >
      <div className="space-y-5">
        {/* Tema */}
        <div className="space-y-2">
          <Label htmlFor="tema" className="text-sm font-medium">
            Tema do vídeo
          </Label>
          <Input
            id="tema"
            placeholder="Ex: Como instalar custom ROM"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="bg-input"
          />
        </div>

        {/* Nível */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Nível</Label>
          <div className="flex gap-2">
            {niveis.map((option) => (
              <Button
                key={option}
                type="button"
                variant={nivel === option ? "default" : "outline"}
                size="sm"
                onClick={() => setNivel(option)}
                className="flex-1"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={status === option ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus(option)}
                className={cn(
                  "justify-start",
                  status === option && "bg-primary text-primary-foreground"
                )}
              >
                {option}
              </Button>
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
