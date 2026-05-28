"use client"

import Link from "next/link"
import { ArrowLeft, Newspaper, Plus } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PostsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Painel
            </Button>
          </Link>

          <Link href="/dashboard/posts/novo">
            <Button className="gap-2 bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4" />
              Novo post
            </Button>
          </Link>
        </div>

        <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-red-500" />
              Posts
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-zinc-400">
              Área de gerenciamento de posts em construção. Por enquanto, os
              posts publicados continuam sendo gerenciados diretamente pelo
              Supabase.
            </p>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-zinc-300">
                Próximo passo: criar um editor visual para publicar na timeline
                sem precisar usar SQL Editor.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}