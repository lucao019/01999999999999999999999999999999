"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Turnstile } from "@marsidev/react-turnstile"
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react"

import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CadastroPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  )

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""

  const handleCadastro = async (event: React.FormEvent) => {
    event.preventDefault()

    setMessage("")
    setMessageType("info")
    setIsLoading(true)

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()
    const cleanConfirmPassword = confirmPassword.trim()

    if (!cleanName || !cleanEmail || !cleanPassword || !cleanConfirmPassword) {
      setMessageType("error")
      setMessage("Preencha todos os campos.")
      setIsLoading(false)
      return
    }

    if (!turnstileSiteKey) {
      setMessageType("error")
      setMessage("Turnstile não está configurado no ambiente.")
      setIsLoading(false)
      return
    }

    if (!captchaToken) {
      setMessageType("error")
      setMessage("Confirme que você não é um robô para continuar.")
      setIsLoading(false)
      return
    }

    if (cleanPassword.length < 6) {
      setMessageType("error")
      setMessage("A senha precisa ter pelo menos 6 caracteres.")
      setIsLoading(false)
      return
    }

    if (cleanPassword !== cleanConfirmPassword) {
      setMessageType("error")
      setMessage("As senhas não conferem.")
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        captchaToken,
        data: {
          display_name: cleanName,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (error) {
      setMessageType("error")
      setMessage(error.message)
      setCaptchaToken("")
      setIsLoading(false)
      return
    }

    const user = data.user

    if (user) {
      await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          display_name: cleanName,
          username: cleanEmail
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .slice(0, 30),
          role: "member",
          status: "offline",
          bio: "Membro verificado no sistema.",
          login: cleanEmail,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
    }

    await supabase.auth.signOut().catch(() => {})

    setMessageType("success")
    setMessage("Conta criada. Enviamos um link de ativação para seu email.")
    setIsLoading(false)

    window.setTimeout(() => {
      router.push("/login")
    }, 3000)
  }

  const messageClass =
    messageType === "error"
      ? "border-red-500/20 bg-red-500/10 text-red-400"
      : messageType === "success"
        ? "border-green-500/20 bg-green-500/10 text-green-400"
        : "border-white/10 bg-black/30 text-zinc-400"

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-8 text-white sm:px-6">
      <img
        src="/login-bg.gif"
        alt="Fundo animado"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-100"
      />

      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950/90 to-red-950/50" />
      <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-red-900/20 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <section className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex min-h-[620px] flex-col justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl sm:min-h-[680px] sm:p-8">
          <div className="mb-8 space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/40 bg-red-600/20 shadow-lg shadow-red-900/40">
              <UserPlus className="h-7 w-7 text-red-500" />
            </div>

            <div>
              <div className="mx-auto mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
                Cadastro
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white">
                Criar conta
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Crie sua conta. Vamos enviar um link rápido para ativar seu acesso.
              </p>
            </div>
          </div>

          <form onSubmit={handleCadastro} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-200">
                Nome
              </Label>

              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isLoading}
                className="h-12 border-white/10 bg-black/30 text-white placeholder:text-zinc-500"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
                className="h-12 border-white/10 bg-black/30 text-white placeholder:text-zinc-500"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">
                Senha
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="mínimo 6 caracteres"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                  className="h-12 border-white/10 bg-black/30 pr-12 text-white placeholder:text-zinc-500"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-200">
                Confirmar senha
              </Label>

              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="repita a senha"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={isLoading}
                className="h-12 border-white/10 bg-black/30 text-white placeholder:text-zinc-500"
                autoComplete="new-password"
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-3 text-sm text-zinc-400">
                Verificação anti-bot
              </p>

              {turnstileSiteKey ? (
                <Turnstile
                  siteKey={turnstileSiteKey}
                  options={{
                    theme: "dark",
                    size: "normal",
                  }}
                  onSuccess={(token) => {
                    setCaptchaToken(token)
                  }}
                  onError={() => {
                    setCaptchaToken("")
                    setMessageType("error")
                    setMessage("Falha na verificação anti-bot.")
                  }}
                  onExpire={() => {
                    setCaptchaToken("")
                  }}
                />
              ) : (
                <p className="text-sm text-red-400">
                  NEXT_PUBLIC_TURNSTILE_SITE_KEY não configurada.
                </p>
              )}

              <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                Confirme que você é humano antes de criar a conta.
              </p>
            </div>

            {message && (
              <div className={`rounded-lg border p-3 text-sm ${messageClass}`}>
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !captchaToken}
              className="h-12 w-full bg-red-600 text-base font-bold uppercase tracking-wider text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>

            <div className="border-t border-white/10 pt-5 text-center text-sm text-zinc-400">
              Já tem conta?{" "}
              <Link
                href="/login"
                className="font-medium text-red-400 transition-colors hover:text-red-300"
              >
                Entrar
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}