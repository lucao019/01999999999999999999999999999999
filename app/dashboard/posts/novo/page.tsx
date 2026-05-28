"use client"

import Link from "next/link"
import { ArrowLeft, Newspaper } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NovoPostPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-red-500" />
              Novo post
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-relaxed text-zinc-400">
              Tela de criação de post em construção. Por enquanto, os posts são
              publicados pelo Supabase SQL Editor.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}