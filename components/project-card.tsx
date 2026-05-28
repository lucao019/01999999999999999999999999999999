"use client"

import Link from "next/link"
import { ArrowRight, Dumbbell, Smartphone, Video } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  progress: number
  icon: "biohacker" | "tech" | "content"
  status: "em-desenvolvimento" | "ativo" | "concluido"
  subcategories: string[]
}

const iconMap = {
  biohacker: Dumbbell,
  tech: Smartphone,
  content: Video,
}

const statusMap = {
  "em-desenvolvimento": { label: "Em desenvolvimento", color: "bg-yellow-500/20 text-yellow-500" },
  "ativo": { label: "Ativo", color: "bg-green-500/20 text-green-500" },
  "concluido": { label: "Concluído", color: "bg-primary/20 text-primary" },
}

export function ProjectCard({ id, title, description, progress, icon, status, subcategories }: ProjectCardProps) {
  const Icon = iconMap[icon]
  const statusInfo = statusMap[status]

  return (
    <Link href={`/dashboard/projeto/${id}`} className="group block">
      <div className="bg-card border border-border rounded-lg p-6 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
        {/* Industrial corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-1 bg-primary/30 rotate-45 translate-x-8 -translate-y-4" />
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <span className={cn("text-xs font-medium px-2 py-1 rounded", statusInfo.color)}>
            {statusInfo.label}
          </span>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Subcategories */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {subcategories.map((sub) => (
            <span 
              key={sub} 
              className="text-xs bg-secondary/80 text-muted-foreground px-2 py-0.5 rounded"
            >
              {sub}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progresso</span>
            <span className="text-primary font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
          <span>Abrir projeto</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
