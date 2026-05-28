import { FolderKanban, CheckCircle2, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

const stats = [
  {
    label: "Projetos ativos",
    value: "3",
    icon: FolderKanban,
  },
  {
    label: "Tarefas pendentes",
    value: "7",
    icon: CheckCircle2,
  },
  {
    label: "Ultima atualizacao",
    value: "Hoje",
    icon: Clock,
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
