"use client"

import { useState } from "react"
import { 
  Archive, 
  FileText,
  MessageSquare,
  Lightbulb,
  FolderX,
  Search,
  Trash2,
  RotateCcw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const categories = [
  { id: "ideias", title: "Ideias Pausadas", icon: Lightbulb, count: 8, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  { id: "rascunhos", title: "Rascunhos", icon: FileText, count: 15, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { id: "conversas", title: "Conversas Exportadas", icon: MessageSquare, count: 23, color: "text-green-500", bgColor: "bg-green-500/10" },
  { id: "projetos", title: "Projetos Arquivados", icon: FolderX, count: 4, color: "text-purple-500", bgColor: "bg-purple-500/10" },
]

const archivedItems = [
  { 
    title: "Ideia: App de controle de macros", 
    category: "ideias", 
    date: "15/01/2024",
    description: "Aplicativo para calcular e acompanhar macronutrientes diários."
  },
  { 
    title: "Rascunho: Vídeo sobre sono", 
    category: "rascunhos", 
    date: "10/01/2024",
    description: "Roteiro incompleto sobre ciclos de sono e recuperação."
  },
  { 
    title: "Conversa ChatGPT: Adenosina", 
    category: "conversas", 
    date: "08/01/2024",
    description: "Pesquisa sobre mecanismo da adenosina e relação com cafeína."
  },
  { 
    title: "Projeto: Bot Telegram", 
    category: "projetos", 
    date: "01/01/2024",
    description: "Automação de notificações de treino. Pausado por falta de tempo."
  },
  { 
    title: "Conversa Gemini: Custom ROM", 
    category: "conversas", 
    date: "28/12/2023",
    description: "Pesquisa sobre compatibilidade de ROMs com Redmi Note 11."
  },
  { 
    title: "Ideia: Planilha de periodização", 
    category: "ideias", 
    date: "20/12/2023",
    description: "Sistema de periodização undulante para treino de força."
  },
]

export default function ArquivoPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredItems = archivedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Archive className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">
              Arquivo <span className="text-muted-foreground">Morto</span>
            </h1>
            <p className="text-muted-foreground">
              Ideias pausadas, rascunhos e conversas exportadas.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar no arquivo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {categories.map((cat) => (
          <Card 
            key={cat.id}
            className={cn(
              "cursor-pointer transition-all hover:border-primary/50 text-center",
              selectedCategory === cat.id && "border-primary"
            )}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
          >
            <CardContent className="p-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2", cat.bgColor)}>
                <cat.icon className={cn("w-5 h-5", cat.color)} />
              </div>
              <p className="text-sm font-medium">{cat.title}</p>
              <p className="text-2xl font-black text-muted-foreground">{cat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Archived Items */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-muted-foreground rounded-full" />
          <h2 className="text-xl font-bold">
            {selectedCategory 
              ? categories.find(c => c.id === selectedCategory)?.title 
              : "Todos os Itens"}
          </h2>
          <span className="text-sm text-muted-foreground">({filteredItems.length})</span>
        </div>
        <div className="space-y-2">
          {filteredItems.map((item, i) => {
            const cat = categories.find(c => c.id === item.category)
            return (
              <Card key={i} className="hover:border-border transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {cat && (
                        <div className={cn("w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5", cat.bgColor)}>
                          <cat.icon className={cn("w-4 h-4", cat.color)} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                        <p className="text-xs text-muted-foreground">Arquivado em {item.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Info */}
      <Card className="mt-8 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Sobre o Arquivo Morto</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Essa pasta guarda ideias que ainda não têm prioridade. Nada se perde - pode voltar quando fizer sentido.</p>
        </CardContent>
      </Card>
    </div>
  )
}
