"use client"

import Link from "next/link"
import { ArrowRight, Calendar, Trash2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export type ActivityEvent = {
  id: string
  user_id: string
  title: string
  description: string | null
  image_url: string | null
  link_url: string | null
  created_at: string
}

type ActivityCardProps = {
  activity: ActivityEvent
  canDelete?: boolean
  onDelete?: (activity: ActivityEvent) => void
}

export function ActivityCard({
  activity,
  canDelete = false,
  onDelete,
}: ActivityCardProps) {
  function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    onDelete?.(activity)
  }

  const content = (
    <>
      <div className="aspect-[16/10] overflow-hidden bg-black/40">
        {activity.image_url ? (
          <img
            src={activity.image_url}
            alt={activity.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-red-500">
            <Users className="h-10 w-10" />
          </div>
        )}
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-400">
            comunidade
          </Badge>

          <Badge variant="outline" className="gap-1 text-zinc-300">
            <Calendar className="h-3 w-3" />
            {new Date(activity.created_at).toLocaleDateString("pt-BR")}
          </Badge>
        </div>

        <div>
          <h2 className="line-clamp-2 text-xl font-black transition-colors group-hover:text-red-400">
            {activity.title}
          </h2>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
            {activity.description || "Atualização pública."}
          </p>
        </div>

        <Button className="w-full gap-2 bg-red-600 hover:bg-red-700">
          Ver atualização
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </>
  )

  return (
    <Card className="group relative overflow-hidden border-white/10 bg-zinc-950/80 text-white shadow-2xl transition-colors hover:border-red-500/40">
      {canDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 bg-black/70 text-red-400 backdrop-blur transition-colors hover:bg-red-500/20 hover:text-red-300"
          title="Excluir atualização"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      {activity.link_url ? (
        <Link href={activity.link_url} className="block">
          {content}
        </Link>
      ) : (
        <div className="block">{content}</div>
      )}
    </Card>
  )
}