"use client"

import Link from "next/link"
import { ArrowRight, Calendar, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_url: string | null
  category: string | null
  status: string | null
  published_at: string | null
  created_at: string
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="group overflow-hidden border-white/10 bg-zinc-950/80 text-white shadow-2xl transition-colors hover:border-red-500/40">
      <Link href={`/timeline/${post.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-zinc-900">
          {post.cover_url ? (
            <img
              src={post.cover_url}
              alt={post.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-600">
              <FileText className="h-10 w-10" />
            </div>
          )}
        </div>
      </Link>

      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge className="border-red-500/30 bg-red-500/20 text-red-400">
            {post.category || "geral"}
          </Badge>

          <Badge variant="outline" className="gap-1 text-zinc-300">
            <Calendar className="h-3 w-3" />
            {new Date(post.published_at || post.created_at).toLocaleDateString(
              "pt-BR"
            )}
          </Badge>
        </div>

        <div>
          <Link href={`/timeline/${post.slug}`}>
            <h2 className="line-clamp-2 text-xl font-black transition-colors group-hover:text-red-400">
              {post.title}
            </h2>
          </Link>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
            {post.excerpt || "Sem resumo."}
          </p>
        </div>

        <Link href={`/timeline/${post.slug}`}>
          <Button className="w-full gap-2 bg-red-600 hover:bg-red-700">
            Ler post
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}