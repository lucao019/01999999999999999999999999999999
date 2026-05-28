import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface NextActionProps {
  action?: string
  projectId?: string
}

export function NextAction({ 
  action = "Continuar projeto Biohacker Engine", 
  projectId = "biohacker-engine" 
}: NextActionProps) {
  return (
    <Card className="p-4 mb-8 border-primary/30 bg-primary/5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary fill-primary" />
          </div>
          <div>
            <p className="text-xs text-primary font-medium mb-0.5">PROXIMA ACAO</p>
            <p className="font-bold text-foreground">{action}</p>
          </div>
        </div>
        <Link href={`/dashboard/projeto/${projectId}`}>
          <Button variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
            Ir para o projeto
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
