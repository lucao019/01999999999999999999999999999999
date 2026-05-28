"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Calendar,
  Expand,
  MessageCircle,
  Send,
  X,
} from "lucide-react"
import { useParams } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_url: string | null
  category: string | null
  allow_comments: boolean | null
  published_at: string | null
  created_at: string
}

type Comment = {
  id: string
  post_id: string
  user_id: string
  author_name: string | null
  content: string
  status: string | null
  created_at: string
}

export default function TimelinePostPage() {
  const params = useParams()
  const slug = String(params.slug || "")

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState("")
  const [currentUserName, setCurrentUserName] = useState("Usuário")
  const [currentUserId, setCurrentUserId] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState("")
  const [imageOpen, setImageOpen] = useState(false)

  async function loadPost() {
    setIsLoading(true)
    setMessage("")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = "/"
      return
    }

    setCurrentUserId(user.id)
    setIsVerified(Boolean(user.email_confirmed_at))

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("user_id", user.id)
      .maybeSingle()

    setCurrentUserName(
      profile?.display_name || profile?.username || user.email || "Usuário"
    )

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()

    if (postError) {
      setMessage(`Erro ao carregar post: ${postError.message}`)
      setIsLoading(false)
      return
    }

    if (!postData) {
      setMessage("Post não encontrado.")
      setIsLoading(false)
      return
    }

    setPost(postData)

    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postData.id)
      .eq("status", "visible")
      .order("created_at", { ascending: true })

    if (commentsError) {
      setMessage(`Erro ao carregar comentários: ${commentsError.message}`)
      setIsLoading(false)
      return
    }

    setComments(commentsData || [])
    setIsLoading(false)
  }

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  async function handleSendComment() {
    if (!post) return

    const cleanText = commentText.trim()

    if (!cleanText) {
      setMessage("Escreva um comentário antes de enviar.")
      return
    }

    if (!isVerified) {
      setMessage("Você precisa confirmar seu email antes de comentar.")
      return
    }

    setIsSending(true)
    setMessage("")

    const { error } = await supabase.from("comments").insert({
      post_id: post.id,
      user_id: currentUserId,
      author_name: currentUserName,
      content: cleanText,
      status: "visible",
    })

    if (error) {
      setMessage(`Erro ao comentar: ${error.message}`)
      setIsSending(false)
      return
    }

    setCommentText("")
    setIsSending(false)
    await loadPost()
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 text-sm text-zinc-400">
          Carregando post...
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/timeline">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Feed
            </Button>
          </Link>

          {post && (
            <div className="hidden items-center gap-2 text-xs text-zinc-500 sm:flex">
              <span>Post público</span>
              <span>•</span>
              <span>
                Comentários {post.allow_comments ? "abertos" : "fechados"}
              </span>
            </div>
          )}
        </div>

        {message && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {message}
          </div>
        )}

        {post && (
          <>
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]">
              <article className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 shadow-2xl sm:p-6">
                <div className="mb-5 flex flex-wrap gap-2">
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

                <header className="mb-8 space-y-4">
                  <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                    {post.title}
                  </h1>

                  {post.excerpt && (
                    <p className="max-w-3xl text-base leading-relaxed text-zinc-400 md:text-lg">
                      {post.excerpt}
                    </p>
                  )}
                </header>

                <div className="space-y-4 border-t border-white/10 pt-8">
                  {(post.content || "")
                    .split("\n")
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="max-w-4xl text-[15px] leading-7 text-zinc-300 sm:leading-8 md:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </article>

              <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <button
                  type="button"
                  onClick={() => setImageOpen(true)}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-900 lg:aspect-square">
                    {post.cover_url ? (
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:blur-[1px]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent p-4">
                    <span className="text-left text-xs font-medium uppercase tracking-[0.25em] text-zinc-300">
                      Imagem interativa
                    </span>

                    <div className="rounded-full border border-white/20 bg-black/50 p-2">
                      <Expand className="h-4 w-4" />
                    </div>
                  </div>
                </button>

                <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                    Mecanismo
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    O post conecta ambiente moderno, sono, gordura visceral,
                    sedentarismo, estresse e sinal hormonal como um sistema.
                  </p>
                </div>
              </aside>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 sm:p-6">
                <div className="mb-5 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-red-500" />
                  <h2 className="text-xl font-black">Comentários</h2>
                </div>

                {post.allow_comments ? (
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder={
                          isVerified
                            ? "Escreva seu comentário..."
                            : "Confirme seu email para comentar."
                        }
                        disabled={!isVerified || isSending}
                        className="min-h-[110px]"
                      />

                      <Button
                        onClick={handleSendComment}
                        disabled={!isVerified || isSending}
                        className="gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <Send className="h-4 w-4" />
                        {isSending ? "Enviando..." : "Enviar comentário"}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {comments.length === 0 && (
                        <p className="text-sm text-zinc-500">
                          Nenhum comentário ainda. Seja o primeiro.
                        </p>
                      )}

                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-xl border border-white/10 bg-black/30 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <p className="font-bold text-zinc-200">
                              {comment.author_name || "Usuário"}
                            </p>

                            <p className="text-xs text-zinc-500">
                              {new Date(comment.created_at).toLocaleString(
                                "pt-BR"
                              )}
                            </p>
                          </div>

                          <p className="text-sm leading-relaxed text-zinc-300">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400">
                    Comentários fechados para este post.
                  </p>
                )}
              </div>

              <div className="hidden lg:block" />
            </section>
          </>
        )}
      </div>

      {imageOpen && post?.cover_url && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setImageOpen(false)}
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/60 p-3 text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>

          <img
            src={post.cover_url}
            alt={post.title}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl border border-white/10 object-contain shadow-2xl"
          />
        </div>
      )}
    </AppShell>
  )
}