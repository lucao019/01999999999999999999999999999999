"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Calendar,
  FileText,
  Newspaper,
  Shield,
  Target,
  User,
  Activity,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Post = {
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

type ActivityEvent = {
  id: string
  user_id: string
  event_type: string
  title: string
  description: string | null
  image_url: string | null
  link_url: string | null
  created_at: string
}

export default function TimelinePage() {
  const [displayName, setDisplayName] = useState("Usuário")
  const [role, setRole] = useState("basic")
  const [posts, setPosts] = useState<Post[]>([])
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadFeed() {
      setIsLoading(true)
      setMessage("")

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/"
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("user_id", user.id)
        .maybeSingle()

      setDisplayName(profile?.display_name || user.email || "Usuário")
      setRole(profile?.role || "basic")

      const [
        { data: postsData, error: postsError },
        { data: activitiesData, error: activitiesError },
      ] = await Promise.all([
        supabase
          .from("posts")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false }),

        supabase
          .from("activity_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(12),
      ])

      if (postsError) {
        setMessage(`Erro ao carregar publicações: ${postsError.message}`)
        setIsLoading(false)
        return
      }

      if (activitiesError) {
        console.error("Erro ao carregar atividades:", activitiesError)
      }

      setPosts(postsData || [])
      setActivities((activitiesData || []) as ActivityEvent[])
      setIsLoading(false)
    }

    loadFeed()
  }, [])

  if (isLoading) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 text-sm text-zinc-400">
          Carregando feed...
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/80 p-5 shadow-2xl sm:p-6">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-8 h-72 w-72 rounded-full bg-red-900/15 blur-3xl" />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="border-red-500/30 bg-red-500/20 text-red-400">
                  Feed
                </Badge>

                <Badge variant="outline" className="text-zinc-300">
                  {role === "admin" ? "Admin" : "Conta básica"}
                </Badge>
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Bem-vindo, {displayName}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                  Timeline pública de posts, ideias, estudos e atualizações dos
                  membros.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/perfil">
                <Button className="gap-2 bg-red-600 hover:bg-red-700">
                  <User className="h-4 w-4" />
                  Meu perfil
                </Button>
              </Link>

              <Link href="/dashboard/biblioteca">
                <Button variant="outline" className="gap-2">
                  <Target className="h-4 w-4" />
                  Biblioteca
                </Button>
              </Link>

              {role === "admin" && (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="gap-2">
                      <Shield className="h-4 w-4" />
                      Painel
                    </Button>
                  </Link>

                  <Link href="/dashboard/posts">
                    <Button variant="outline" className="gap-2">
                      <Newspaper className="h-4 w-4" />
                      Posts
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {message && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {message}
          </div>
        )}

        <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-500" />
              Atividades da Comunidade
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-zinc-400">
                Nenhuma atualização pública ainda.
              </p>
            ) : (
              activities.map((activity) => {
                const content = (
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4 transition-colors hover:border-red-500/40 hover:bg-black/50">
                    <div className="flex gap-4">
                      {activity.image_url ? (
                        <img
                          src={activity.image_url}
                          alt={activity.title}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                          <Activity className="h-7 w-7" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white">
                          {activity.title}
                        </h3>

                        {activity.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                            {activity.description}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-zinc-500">
                          {new Date(activity.created_at).toLocaleString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )

                return activity.link_url ? (
                  <Link key={activity.id} href={activity.link_url}>
                    {content}
                  </Link>
                ) : (
                  <div key={activity.id}>{content}</div>
                )
              })
            )}
          </CardContent>
        </Card>

        {posts.length === 0 && (
          <Card className="border-white/10 bg-zinc-950/80 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-red-500" />
                Nenhuma publicação ainda
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                Quando o admin publicar posts, eles vão aparecer aqui no feed.
              </p>

              {role === "admin" && (
                <Link href="/dashboard/posts/novo">
                  <Button className="gap-2 bg-red-600 hover:bg-red-700">
                    Criar primeiro post
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {posts.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden border-white/10 bg-zinc-950/80 text-white shadow-2xl transition-colors hover:border-red-500/40"
              >
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
                      {new Date(
                        post.published_at || post.created_at
                      ).toLocaleDateString("pt-BR")}
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
            ))}
          </section>
        )}
      </div>
    </AppShell>
  )
}